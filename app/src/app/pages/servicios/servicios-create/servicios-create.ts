import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioForm } from '../../../shared/components/servicio-form/servicio-form';
import { CategoriaService } from '../../../core/services/categoria.service';
import { EspecialidadService } from '../../../core/services/especialidad.service';
import { ServicioService } from '../../../core/services/servicio.service';
import { AuthService } from '../../../core/services/auth.service';
import { Categoria } from '../../../core/models/categoria.model';
import { Especialidad } from '../../../core/models/especialidad.model';
import { ServicioCreateDto } from '../../../core/models/servicio.model';

@Component({
  selector: 'app-servicios-create',
  standalone: true,
  imports: [CommonModule, ServicioForm],
  templateUrl: './servicios-create.html',
  styleUrls: ['./servicios-create.css'],
})
export class ServiciosCreate implements OnInit {
  private router = inject(Router);
  private categoriaService = inject(CategoriaService);
  private especialidadService = inject(EspecialidadService);
  private servicioService = inject(ServicioService);
  private authService = inject(AuthService);

  saving = signal(false);
  error = signal('');

  categorias = signal<Categoria[]>([]);
  especialidades = signal<Especialidad[]>([]);

  profesionalActual = this.authService.profesional;

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarEspecialidades();
  }

  cargarCategorias(): void {
    this.categoriaService.getAllActivos().subscribe({
      next: (data) => this.categorias.set(data),
      error: () => this.error.set('No se pudieron cargar las categorías.'),
    });
  }

  cargarEspecialidades(): void {
    this.especialidadService.listar().subscribe({
      next: (data) => this.especialidades.set(data),
      error: () => this.error.set('No se pudieron cargar las especialidades.'),
    });
  }

  guardar(data: ServicioCreateDto): void {
    const profesional = this.profesionalActual();

    if (!profesional) {
      this.error.set(
        'No se pudo identificar al profesional autenticado.',
      );
      return;
    }

    this.saving.set(true);
    this.error.set('');

    const servicio: ServicioCreateDto = {
      ...data,
      idprofesional: profesional.Id,
    };

    this.servicioService.crear(servicio).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/servicios']);
      },
      error: () => {
        this.saving.set(false);
        this.error.set('No se pudo registrar el servicio.');
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/servicios']);
  }
}