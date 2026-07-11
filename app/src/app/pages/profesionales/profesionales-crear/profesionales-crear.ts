import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProfesionalForm } from '../../../shared/components/profesional-form/profesional-form';
import { UsuarioService } from '../../../core/services/usuario.service';
import { EspecialidadService } from '../../../core/services/especialidad.service';
import { ImageService } from '../../../core/services/imagen.service';
import { Especialidad, ProfesionalCreateDto, ProfesionalUpdateDto } from '../../../core/models/profesional.model';

@Component({
  selector: 'app-profesionales-crear',
  standalone: true,
  imports: [CommonModule, ProfesionalForm],
  templateUrl: './profesionales-crear.html',
  styleUrls: ['./profesionales-crear.css'],
})
export class ProfesionalesCrear {
  private readonly router = inject(Router);
  private readonly imageService = inject(ImageService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly especialidadService = inject(EspecialidadService);

  especialidades = signal<Especialidad[]>([]);
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.cargarEspecialidades();
  }

  cargarEspecialidades() {
    this.loading.set(true);
    this.error.set(null);

    this.especialidadService.listar().subscribe({
      next: (especialidades) => {
        this.especialidades.set(especialidades ?? []);
      },
      error: () => {
        this.error.set('No se pudieron cargar las especialidades.');
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  guardar({ dto, foto }: { dto: ProfesionalCreateDto | ProfesionalUpdateDto; foto: File | null }) {
    this.saving.set(true);
    this.error.set(null);

    if (!foto) {
      this.crear(dto as ProfesionalCreateDto);
      return;
    }

    this.imageService.upload(foto).subscribe({
      next: (res) => {
        this.crear({ ...dto, Foto: res.fileName } as ProfesionalCreateDto);
      },
      error: () => {
        this.error.set('No se pudo subir la foto.');
        this.saving.set(false);
      },
    });
  }

  private crear(data: ProfesionalCreateDto) {
    this.usuarioService.crear(data).subscribe({
      next: () => {
        this.router.navigate(['/profesionales']);
      },
      error: () => {
        this.error.set('No se pudo registrar el profesional.');
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