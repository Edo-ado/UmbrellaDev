import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioForm } from '../../../shared/components/servicio-form/servicio-form';
import { UsuarioService } from '../../../core/services/usuario.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { EspecialidadService } from '../../../core/services/especialidad.service';
import { ServicioService } from '../../../core/services/servicio.service';
import { Profesional } from '../../../core/models/profesional.model';
import { Categoria } from '../../../core/models/categoria.model';
import { Especialidad } from '../../../core/models/especialidad.model';
import { Servicio, ServicioCreateDto, ServicioUpdateDto } from '../../../core/models/servicio.model';

@Component({
  selector: 'app-servicios-edit',
  standalone: true,
  imports: [CommonModule, ServicioForm],
  templateUrl: './servicios-edit.html',
  styleUrls: ['./servicios-edit.css']
})
export class ServiciosEdit implements OnInit {
  private usuarioService = inject(UsuarioService);
  private categoriaService = inject(CategoriaService);
  private especialidadService = inject(EspecialidadService);
  private servicioService = inject(ServicioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  saving = signal(false);
  loading = signal(false);
  error = signal('');

  profesionales = signal<Profesional[]>([]);
  categorias = signal<Categoria[]>([]);
  especialidades = signal<Especialidad[]>([]);
  servicio = signal<Servicio | null>(null);

  private servicioId!: number;

  ngOnInit(): void {
    this.servicioId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarServicio();
    this.cargarProfesionales();
    this.cargarCategorias();
    this.cargarEspecialidades();
  }

  cargarServicio(): void {
    this.loading.set(true);
    this.error.set('');

    this.servicioService.obtenerPorId(this.servicioId).subscribe({
      next: (data) => {
        this.servicio.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el servicio a editar.');
        this.loading.set(false);
      }
    });
  }

  cargarProfesionales(): void {
    this.usuarioService.obtenerDesarrolladores().subscribe({
      next: (data) => { this.profesionales.set(data); },
      error: () => { this.error.set('No se pudieron cargar los profesionales.'); }
    });
  }

  cargarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (data) => { this.categorias.set(data); },
      error: () => { this.error.set('No se pudieron cargar las categorías.'); }
    });
  }

  cargarEspecialidades(): void {
    this.especialidadService.listar().subscribe({
      next: (data) => { this.especialidades.set(data); },
      error: () => { this.error.set('No se pudieron cargar las especialidades.'); }
    });
  }

  guardar(data: ServicioCreateDto | ServicioUpdateDto): void {
    this.saving.set(true);
    this.error.set('');

    this.servicioService.actualizar(this.servicioId, data as ServicioUpdateDto).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/servicios']);
      },
      error: () => {
        this.saving.set(false);
        this.error.set('No se pudo actualizar el servicio.');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/servicios']);
  }
}