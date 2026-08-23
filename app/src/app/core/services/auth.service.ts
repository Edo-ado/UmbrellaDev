import {
    computed,
    inject,
    Injectable,
    signal,
} from '@angular/core'

import {
    HttpClient,
    HttpErrorResponse,
} from '@angular/common/http'

import { Router } from '@angular/router'

import {
    catchError,
    finalize,
    map,
    Observable,
    of,
    shareReplay,
    switchMap,
    tap,
    throwError,
} from 'rxjs'

import { environment } from '../../../environments/environment'

import { ApiResponse } from '../models/api-response.model'

import {
    LoginRequest,
    LoginResult,
    RegisterRequest,
    Profesional,
} from '../models/usuario.model'

import { Role } from '../models/usuario.model'


@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly http = inject(HttpClient)

    private readonly router = inject(Router)

    private readonly apiUrl =
        `${environment.apiUrl}/usuarios`

    private readonly tokenKey = 'access_token'

    private readonly _token = signal<string | null>(
        this.leerTokenAlmacenado()
    )

    private readonly _profesional =
        signal<Profesional | null>(null)

    private readonly _cargandoSesion =
        signal(false)

    private readonly _sesionInicializada =
        signal(false)

    private solicitudPerfilActual:
        Observable<Profesional | null> | null = null


    readonly token = this._token.asReadonly()

    readonly profesional =
        this._profesional.asReadonly()

    readonly cargandoSesion =
        this._cargandoSesion.asReadonly()

    readonly sesionInicializada =
        this._sesionInicializada.asReadonly()


    readonly autenticado = computed(
        () =>
            this._token() !== null &&
            this._profesional() !== null
    )

    readonly rol = computed(
        () => this._profesional()?.Role ?? null
    )

    readonly esAdmin = computed(() => {
        const rol = this.rol()

        return rol !== null && rol === Role.ADMIN
    })


    login(
        credenciales: LoginRequest
    ): Observable<Profesional> {
        this._cargandoSesion.set(true)

        return this.http
            .post<ApiResponse<LoginResult>>(
                `${this.apiUrl}/login`,
                credenciales
            )
            .pipe(
                map((response) => {
                    const resultado = response.data

                    if (!resultado?.token || !resultado?.Id) {
                        throw new Error(
                            'El API no devolvió los datos de autenticación esperados'
                        )
                    }

                    return resultado
                }),

                tap(({ token }) => {
                    this.guardarToken(token)
                }),

                switchMap((resultado) =>
                    this.obtenerPerfil(resultado.Id)
                ),

                tap((profesional) => {
                    this._profesional.set(profesional)

                    this._sesionInicializada.set(true)
                }),

                catchError((error: unknown) => {
                    this.limpiarSesion()

                    return throwError(
                        () =>
                            this.obtenerErrorAutenticacion(
                                error
                            )
                    )
                }),

                finalize(() => {
                    this._cargandoSesion.set(false)
                })
            )
    }


    obtenerPerfil(id: number): Observable<Profesional> {
        return this.http
            .get<ApiResponse<Profesional>>(
                `${this.apiUrl}/perfil/${id}`
            )
            .pipe(
                map((response) => {
                    const profesional = response.data

                    if (!profesional) {
                        throw new Error(
                            'El API no devolvió la información del perfil'
                        )
                    }

                    return profesional
                })
            )
    }


    inicializarSesion():
        Observable<Profesional | null> {
        if (this._sesionInicializada()) {
            return of(this._profesional())
        }

        const token = this._token()

        if (!token) {
            this._profesional.set(null)

            this._sesionInicializada.set(true)

            return of(null)
        }

        return this.cargarPerfil()
    }


    cargarPerfil():
        Observable<Profesional | null> {
        if (this.solicitudPerfilActual) {
            return this.solicitudPerfilActual
        }

        const token = this._token()

        if (!token) {
            this._profesional.set(null)

            this._sesionInicializada.set(true)

            return of(null)
        }

        const id = this.decodificarIdDesdeToken(token)

        if (!id) {
            this.limpiarSesion()

            return of(null)
        }

        this._cargandoSesion.set(true)

        this.solicitudPerfilActual =
            this.obtenerPerfil(id)
                .pipe(
                    tap((profesional) => {
                        this._profesional.set(profesional)
                    }),

                    map(
                        (
                            profesional
                        ): Profesional | null =>
                            profesional
                    ),

                    catchError(() => {
                        this.limpiarSesion()

                        return of(null)
                    }),

                    finalize(() => {
                        this._cargandoSesion.set(false)

                        this._sesionInicializada.set(true)

                        this.solicitudPerfilActual = null
                    }),

                    shareReplay({
                        bufferSize: 1,
                        refCount: false,
                    })
                )

        return this.solicitudPerfilActual
    }


    registrar(
        datos: RegisterRequest
    ): Observable<Profesional> {
        return this.http
            .post<ApiResponse<Profesional>>(
                `${this.apiUrl}/register`,
                datos
            )
            .pipe(
                map((response) => {
                    const profesional = response.data

                    if (!profesional) {
                        throw new Error(
                            'El API no devolvió el profesional registrado'
                        )
                    }

                    return profesional
                })
            )
    }


    /**
     * Recarga el perfil del usuario actualmente autenticado.
     * Se usa después de editar "Mi Perfil" para reflejar los cambios
     * guardados sin necesidad de volver a iniciar sesión.
     */
    refrescarPerfil(): Observable<Profesional> {
        const usuarioActual = this._profesional()

        if (!usuarioActual) {
            return throwError(
                () => new Error('No hay una sesión activa')
            )
        }

        return this.obtenerPerfil(usuarioActual.Id).pipe(
            tap((profesional) => {
                this._profesional.set(profesional)
            })
        )
    }


    logout(redirigir = true): void {
        this.limpiarSesion()

        if (redirigir) {
            void this.router.navigate(['/login'])
        }
    }


    tieneRol(rolesPermitidos: Role[]): boolean {
        const rolActual = this.rol()

        return (
            rolActual !== null &&
            rolesPermitidos.includes(rolActual as Role)
        )
    }


    obtenerToken(): string | null {
        return this._token()
    }


    private guardarToken(token: string): void {
        const tokenLimpio = token.trim()

        if (!tokenLimpio) {
            throw new Error(
                'El token recibido no es válido'
            )
        }

        localStorage.setItem(
            this.tokenKey,
            tokenLimpio
        )

        this._token.set(tokenLimpio)
    }


    private leerTokenAlmacenado(): string | null {
        const token =
            localStorage.getItem(this.tokenKey)

        if (!token) {
            return null
        }

        const tokenLimpio = token.trim()

        return tokenLimpio.length > 0
            ? tokenLimpio
            : null
    }


    /**
     * Decodifica el payload del JWT SIN verificar su firma.
     * Solo se usa para leer el Id y poder restaurar la sesión
     * (ej. al recargar la página); la validación real de la firma
     * la hace siempre el backend en cada request protegido.
     */
    private decodificarIdDesdeToken(token: string): number | null {
        try {
            const payloadBase64 = token.split('.')[1]

            if (!payloadBase64) {
                return null
            }

            const payloadJson = atob(
                payloadBase64
                    .replace(/-/g, '+')
                    .replace(/_/g, '/')
            )

            const payload = JSON.parse(payloadJson)

            return typeof payload.Id === 'number'
                ? payload.Id
                : null
        } catch {
            return null
        }
    }


    private limpiarSesion(): void {
        localStorage.removeItem(this.tokenKey)

        this._token.set(null)

        this._profesional.set(null)

        this._cargandoSesion.set(false)

        this._sesionInicializada.set(true)

        this.solicitudPerfilActual = null
    }


    private obtenerErrorAutenticacion(
        error: unknown
    ): Error {
        if (!(error instanceof HttpErrorResponse)) {
            return error instanceof Error
                ? error
                : new Error(
                    'No fue posible iniciar sesión'
                )
        }

        if (error.status === 0) {
            return new Error(
                'No fue posible conectarse con el servidor'
            )
        }

        if (error.status === 400) {
            return new Error(
                error.error?.message ??
                'Los datos enviados no son válidos'
            )
        }

        if (error.status === 401) {
            return new Error(
                error.error?.message ??
                'Correo o contraseña incorrectos'
            )
        }

        if (error.status === 403) {
            return new Error(
                error.error?.message ??
                'No tiene permisos para realizar esta acción'
            )
        }

        if (error.status === 404) {
            return new Error(
                error.error?.message ??
                'No fue posible obtener el perfil del profesional'
            )
        }

        return new Error(
            error.error?.message ??
            'Ocurrió un error durante la autenticación'
        )
    }
}