import {
    Component,
    inject,
    signal,
} from '@angular/core'

import {
    FormBuilder,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'

import { Router } from '@angular/router'

import { AuthService } from '../../../core/services/auth.service'


@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        ReactiveFormsModule,
    ],
    templateUrl: './register.html',
    styleUrl: './register.css',
})
export class RegisterComponent {
    private readonly formBuilder =
        inject(FormBuilder)

    private readonly authService =
        inject(AuthService)

    private readonly router =
        inject(Router)


    readonly cargando = signal(false)

    readonly error = signal('')

    readonly exito = signal('')


    readonly registerForm =
        this.formBuilder.group({
            NombreCompleto: [
                '',
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(150),
                ],
            ],

            Email: [
                '',
                [
                    Validators.required,
                    Validators.email,
                    Validators.maxLength(150),
                ],
            ],

            Contrasena: [
                '',
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(150),
                ],
            ],

            ConfirmarContrasena: [
                '',
                [
                    Validators.required,
                ],
            ],

            Pais: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(100),
                ],
            ],

            Edad: [
                null,
                [
                    Validators.min(1),
                    Validators.max(120),
                ],
            ],

            Telefono: [
                '',
                [
                    Validators.maxLength(20),
                ],
            ],
        })


    mostrarError(campo: string): boolean {
        const control =
            this.registerForm.get(campo)

        return Boolean(
            control &&
            control.invalid &&
            (control.dirty || control.touched)
        )
    }


    contrasenasNoCoinciden(): boolean {
        const contrasena =
            this.registerForm.controls
                .Contrasena.value

        const confirmar =
            this.registerForm.controls
                .ConfirmarContrasena.value

        return Boolean(
            confirmar &&
            contrasena !== confirmar
        )
    }


    registrarse(): void {
        this.error.set('')

        this.exito.set('')

        if (
            this.registerForm.invalid ||
            this.contrasenasNoCoinciden()
        ) {
            this.registerForm.markAllAsTouched()

            return
        }

const {
    NombreCompleto,
    Email,
    Contrasena,
    Pais,
    Edad,
    Telefono,
} = this.registerForm.getRawValue()


        this.cargando.set(true)

    this.authService
    .registrar({
        NombreCompleto: NombreCompleto ?? '',
        Email: Email ?? '',
        Contrasena: Contrasena ?? '',
        Pais: Pais ?? '',
        Edad: Edad ?? undefined,
        Telefono: Telefono ?? undefined,
    })
    .subscribe({
                next: () => {
                    this.cargando.set(false)

                    this.exito.set(
                        'Cuenta creada correctamente. Ahora puedes iniciar sesión.'
                    )

                    this.registerForm.reset()

                    setTimeout(() => {
                        void this.router.navigate([
                            '/login',
                        ])
                    }, 1200)
                },

                error: (error: Error) => {
                    this.cargando.set(false)

                    this.error.set(
                        error.message ||
                        'No fue posible crear la cuenta'
                    )
                },
            })
    }

irALogin(): void {
    void this.router.navigate([
        '/login',
    ])
}
}