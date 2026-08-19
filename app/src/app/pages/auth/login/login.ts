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
    selector: 'app-login',
    standalone: true,
    imports: [
  
        ReactiveFormsModule,
    ],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class LoginComponent {
    private readonly formBuilder = inject(FormBuilder)

    private readonly authService = inject(AuthService)

    private readonly router = inject(Router)


    readonly cargando = signal(false)

    readonly error = signal('')

readonly loginForm = this.formBuilder.group({
    Email: [
        '',
        [
            Validators.required,
            Validators.email,
        ],
    ],

    Contrasena: [
        '',
        [
            Validators.required,
            Validators.minLength(4),
        ],
    ],
})

    mostrarError(campo: string): boolean {
        const control =
            this.loginForm.get(campo)

        return Boolean(
            control &&
            control.invalid &&
            (control.dirty || control.touched)
        )
    }


    iniciarSesion(): void {
        this.error.set('')

        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched()

            return
        }

        const email =
            this.loginForm.value.Email ?? ''

        const contrasena =
            this.loginForm.value.Contrasena ?? ''

        this.cargando.set(true)

        this.authService
            .login({
                Email: email,
                Contrasena: contrasena ,
            })
            .subscribe({
                next: (usuario) => {
                    this.cargando.set(false)

                    if (usuario.Role === 'ADMIN') {
                        void this.router.navigate(['/usuarios'])

                        return
                    }

                    void this.router.navigate(['/'])
                },

                error: (error: Error) => {
                    this.cargando.set(false)

                    this.error.set(
                        error.message ||
                        'No fue posible iniciar sesión'
                    )
                },
            })
    }


    irARegistro(): void {
        void this.router.navigate(['/register'])
    }
}