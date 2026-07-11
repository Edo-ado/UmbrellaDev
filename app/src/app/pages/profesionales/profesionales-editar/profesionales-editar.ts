import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProfesionalForm } from '../../../shared/components/profesional-form/profesional-form';
import { UsuarioService } from '../../../core/services/usuario.service';
import { EspecialidadService } from '../../../core/services/especialidad.service';
import { ImageService } from '../../../core/services/imagen.service';
import {
  Especialidad,
  Profesional,
  ProfesionalCreateDto,
  ProfesionalUpdateDto,
} from '../../../core/models/profesional.model';

@Component({
  selector: 'app-profesionales-editar',
  standalone: true,
  imports: [CommonModule, ProfesionalForm],
  templateUrl: './profesionales-editar.html',
  styleUrls: ['./profesionales-editar.css'],
})
export class ProfesionalesEditar {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usuarioService = inject(UsuarioService);
  private readonly especialidadService = inject(EspecialidadService);
  private readonly imageService = inject(ImageService);

  profesional = signal<Profesional | null>(null);
  especialidades = signal<Especialidad[]>([]);
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);

  private readonly id = Number(this.route.snapshot.paramMap.get('id'));

  constructor() {
    this.cargarDatos();
  }

  cargarDatos() {
    if (!this.id) {
      this.error.set('El identificador del profesional no es válido.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      profesional: this.usuarioService.obtenerPorId(this.id),
      especialidades: this.especialidadService.listar(),
    }).subscribe({
      next: ({ profesional, especialidades }) => {
        this.profesional.set(profesional);
        this.especialidades.set(especialidades ?? []);
      },
      error: () => {
        this.error.set('No se pudo cargar la información del profesional.');
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  guardar({ dto, foto }: { dto: ProfesionalCreateDto | ProfesionalUpdateDto; foto: File | null }) {
    if (!this.id) return;

    this.saving.set(true);
    this.error.set(null);

    if (!foto) {
      this.actualizar(dto as ProfesionalUpdateDto);
      return;
    }

    const previousFileName = this.profesional()?.Foto;

    this.imageService.upload(foto, previousFileName).subscribe({
      next: (res) => {
        this.actualizar({ ...dto, Foto: res.fileName } as ProfesionalUpdateDto);
      },
      error: () => {
        this.error.set('No se pudo subir la foto.');
        this.saving.set(false);
      },
    });
  }

  private actualizar(data: ProfesionalUpdateDto) {
    this.usuarioService.actualizar(this.id, data).subscribe({
      next: () => {
        this.router.navigate(['/profesionales']);
      },
      error: () => {
        this.error.set('No se pudo actualizar el profesional.');
      },
      complete: () => {
        this.saving.set(false);
      },
    });
  }

  cancelar() {
    this.router.navigate(['/profesionales']);
  }
}