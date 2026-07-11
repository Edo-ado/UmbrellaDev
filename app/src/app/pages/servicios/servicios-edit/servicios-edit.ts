import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioForm } from '../../../shared/components/servicio-form/servicio-form';
import { UsuarioService } from '../../../core/services/usuario.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { EspecialidadService } from '../../../core/services/especialidad.service';
import { ServicioService } from '../../../core/services/servicio.service';
import { Profesional } from '../../../core/models/profesional.model';
import { Categoria } from '../../../core/models/categoria.model';
import { Especialidad } from '../../../core/models/especialidad.model';
import { Servicio, ServicioUpdateDto } from '../../../core/models/servicio.model';
import { ChangeDetectorRef } from '@angular/core';


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

private cdr = inject(ChangeDetectorRef);

  saving: boolean = false;
  loading: boolean = false;
  error: string = '';

  profesionales: Profesional[] = [];
  categorias: Categoria[] = [];
  especialidades: Especialidad[] = [];
  servicio: Servicio | null = null;

  private servicioId!: number;

  ngOnInit(): void {
    this.servicioId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarServicio();
    this.cargarProfesionales();
    this.cargarCategorias();
    this.cargarEspecialidades();
  }

  cargarServicio(): void {
    this.loading = true;
    this.error = '';

    this.servicioService.obtenerPorId(this.servicioId).subscribe({
    next: (data) => {
  console.log("NEXT");

  this.servicio = data;
  this.loading = false;

  this.cdr.detectChanges();   

  console.log("loading:", this.loading);
  console.log("servicio:", this.servicio);

      },
      error: () => {
        this.error = 'No se pudo cargar el servicio a editar.';
        this.loading = false;
      }
    });
  }

  cargarProfesionales(): void {
    this.usuarioService.obtenerDesarrolladores().subscribe({
      next: (data) => { this.profesionales = data; },
      error: () => { this.error = 'No se pudieron cargar los profesionales.'; }
    });
  }

  cargarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (data) => { this.categorias = data; },
      error: () => { this.error = 'No se pudieron cargar las categorías.'; }
    });
  }

  cargarEspecialidades(): void {
    this.especialidadService.listar().subscribe({
      next: (data) => { this.especialidades = data; },
      error: () => { this.error = 'No se pudieron cargar las especialidades.'; }
    });
  }

  guardar(data: ServicioUpdateDto): void {
    this.saving = true;
    this.error = '';

    this.servicioService.actualizar(this.servicioId, data).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/servicios']);
      },
      error: () => {
        this.saving = false;
        this.error = 'No se pudo actualizar el servicio.';
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/servicios']);
  }
}