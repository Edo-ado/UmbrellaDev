import {
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Profesional } from '../../core/models/profesional.model';
import { Servicio } from '../../core/models/servicio.model';
import { Cita } from '../../core/models/cita.model';
import { AuthService } from '../../core/services/auth.service';
import { CitaService } from '../../core/services/cita.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { ServicioService } from '../../core/services/servicio.service';

import { FormsModule } from '@angular/forms';
import { Categoria } from '../../core/models/categoria.model';
import { CategoriaService } from '../../core/services/categoria.service';

@Component({
  selector: 'app-panel-general',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panel-general.html',
  styleUrl: './panel-general.css',
})
export class PanelGeneral implements OnInit {
  private citaService = inject(CitaService);
  private usuarioService = inject(UsuarioService);
  private servicioService = inject(ServicioService);
  private router = inject(Router);
  private categoriaService = inject(CategoriaService);
  private authService = inject(AuthService);

usuarioActual = this.authService.profesional;
  citas = signal<Cita[]>([]);
  profesionales = signal<Profesional[]>([]);
  servicios = signal<Servicio[]>([]);
categorias = signal<Categoria[]>([]);
  profesionalSeleccionado = signal<Profesional | null>(null);

  loadingCitas = signal(false);
  loadingProfesionales = signal(false);
  loadingServicios = signal(false);

  errorCitas = signal('');
  errorProfesionales = signal('');
  errorServicios = signal('');

  ngOnInit(): void {
    this.cargarCitas();
    this.cargarProfesionales();
    this.cargarCategorias();
  }

cargarCategorias(): void {
  this.categoriaService.listar().subscribe({
    next: (data) => {
      this.categorias.set(
        data.filter((categoria) => categoria.Estado === 'ACTIVO'),
      );
    },
    error: () => {
      this.errorServicios.set(
        'No se pudieron cargar las categorías.',
      );
    },
  });
}

cargarCitas(): void {
  const usuario = this.usuarioActual();

  if (!usuario) {
    this.errorCitas.set('No hay un usuario autenticado.');
    return;
  }

  this.loadingCitas.set(true);
  this.errorCitas.set('');

  this.citaService.getAll().subscribe({
    next: (data) => {
      const misCitas = data.filter(
        (cita) => Number(cita.idcliente) === Number(usuario.Id),
      );

      this.citas.set(misCitas);
      this.loadingCitas.set(false);
    },
    error: () => {
      this.errorCitas.set('No se pudieron cargar tus citas.');
      this.loadingCitas.set(false);
    },
  });
}

cargarProfesionales(): void {
  this.loadingProfesionales.set(true);
  this.errorProfesionales.set('');

  this.usuarioService.getDesarrolladoresDisponibles().subscribe({
    next: (data) => {
      this.profesionales.set(data);
      this.loadingProfesionales.set(false);
    },
    error: () => {
      this.errorProfesionales.set(
        'No se pudieron cargar los profesionales.',
      );
      this.loadingProfesionales.set(false);
    },
  });
}

  seleccionarProfesional(profesional: Profesional): void {
    this.profesionalSeleccionado.set(profesional);
    this.servicios.set([]);
    this.errorServicios.set('');

    this.cargarServicios(profesional.Id);
  }

  cargarServicios(profesionalId: number): void {
    this.loadingServicios.set(true);
    this.errorServicios.set('');

    this.servicioService
      .obtenerPorProfesionalActivo(profesionalId)
      .subscribe({
        next: (data) => {
          this.servicios.set(data);
          this.loadingServicios.set(false);
        },
        error: () => {
          this.errorServicios.set(
            'No se pudieron cargar los servicios.',
          );
          this.loadingServicios.set(false);
        },
      });
  }

  solicitarCita(): void {
    this.router.navigate(['/citas/crear']);
  }

  verDetalleCita(id: number): void {
    this.router.navigate(['/citas/detalle', id]);
  }

  verProfesionales(): void {
    this.router.navigate(['/profesionales']);
  }

  verServicios(): void {
    this.router.navigate(['/servicios']);
  }
}