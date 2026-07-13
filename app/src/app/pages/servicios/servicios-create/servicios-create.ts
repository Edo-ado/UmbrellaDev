import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioForm } from '../../../shared/components/servicio-form/servicio-form';
import { UsuarioService } from '../../../core/services/usuario.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { EspecialidadService } from '../../../core/services/especialidad.service';
import { ServicioService } from '../../../core/services/servicio.service';
import { Profesional } from '../../../core/models/profesional.model';
import { Categoria } from '../../../core/models/categoria.model';
import { Especialidad } from '../../../core/models/especialidad.model';
import { ServicioCreateDto } from '../../../core/models/servicio.model';

@Component({
  selector: 'app-servicios-create',
  standalone: true,
  imports: [CommonModule, ServicioForm],
  templateUrl: './servicios-create.html',
  styleUrls: ['./servicios-create.css']
})
export class ServiciosCreate implements OnInit {
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private categoriaService = inject(CategoriaService);
  private especialidadService = inject(EspecialidadService);
  private servicioService = inject(ServicioService);

  saving = signal(false);
  error = signal('');

  profesionales = signal<Profesional[]>([]);
  categorias = signal<Categoria[]>([]);
  especialidades = signal<Especialidad[]>([]);

  ngOnInit(): void {
    this.cargarProfesionales();
    this.cargarCategorias();
    this.cargarEspecialidades();
  }

  cargarProfesionales(): void {
    this.usuarioService.obtenerDesarrolladores().subscribe({
      next: (data) => this.profesionales.set(data),
      error: () => this.error.set('No se pudieron cargar los profesionales.'),
    });
  }

  cargarCategorias(): void {
    this.categoriaService.listar().subscribe({
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
    this.saving.set(true);
    this.error.set('');

    this.servicioService.crear(data).subscribe({
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