import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Profesional } from '../../../core/models/profesional.model';

@Component({
  selector: 'app-profesionales-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profesionales-detalle.html',
  styleUrls: ['./profesionales-detalle.css'],
})
export class ProfesionalesDetalle {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usuarioService = inject(UsuarioService);

  profesional = signal<Profesional | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  private readonly id = Number(this.route.snapshot.paramMap.get('id'));

  constructor() {
    this.cargarProfesional();
  }

  cargarProfesional() {
    if (!this.id) {
      this.error.set('El identificador del profesional no es válido.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.usuarioService.obtenerPorId(this.id).subscribe({
      next: (profesional) => {
        this.profesional.set(profesional);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la información del profesional.');
        this.loading.set(false);
      },
    });
  }

  irAEditar() {
    this.router.navigate(['/profesionalesEditar', this.id]);
  }

  volver() {
    this.router.navigate(['/profesionales']);
  }
}