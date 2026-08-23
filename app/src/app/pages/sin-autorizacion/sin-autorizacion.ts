import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sin-autorizacion',
  standalone: true,
  imports: [],
  templateUrl: './sin-autorizacion.html',
  styleUrl: './sin-autorizacion.css',
})
export class SinAutorizacion {
  private router = inject(Router);
  private authService = inject(AuthService);

  usuarioActual = this.authService.profesional;

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }

  cerrarSesion(): void {
    this.authService.logout();
  }
}