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

  //filtros
    categoriaSeleccionada = '';
    modalidadSeleccionada = '';
    precioMin: number | null = null;
    precioMax: number | null = null;
    nombreServicio = '';

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


//filtros

filtrarPorCategoria(): void {
  const categoriaId = Number(this.categoriaSeleccionada);

  if (!categoriaId) {
    this.errorServicios.set('Selecciona una categoría.');
    return;
  }

  this.loadingServicios.set(true);
  this.errorServicios.set('');

  this.servicioService.obtenerPorCategoria(categoriaId).subscribe({
    next: (data) => {
      this.servicios.set(data);
      this.loadingServicios.set(false);
    },
    error: () => {
      this.errorServicios.set(
        'No se pudieron filtrar los servicios por categoría.',
      );
      this.loadingServicios.set(false);
    },
  });
}

filtrarPorModalidad(): void {
  if (!this.modalidadSeleccionada) {
    this.errorServicios.set('Selecciona una modalidad.');
    return;
  }

  this.loadingServicios.set(true);
  this.errorServicios.set('');

  this.servicioService
    .obtenerPorModalidad(this.modalidadSeleccionada)
    .subscribe({
      next: (data) => {
        this.servicios.set(data);
        this.loadingServicios.set(false);
      },
      error: () => {
        this.errorServicios.set(
          'No se pudieron filtrar los servicios por modalidad.',
        );
        this.loadingServicios.set(false);
      },
    });
}

filtrarPorPrecio(): void {
  if (this.precioMin === null || this.precioMax === null) {
    this.errorServicios.set('Indica precio mínimo y máximo.');
    return;
  }

  if (this.precioMin > this.precioMax) {
    this.errorServicios.set(
      'El precio mínimo no puede ser mayor que el máximo.',
    );
    return;
  }

  this.loadingServicios.set(true);
  this.errorServicios.set('');

  this.servicioService
    .obtenerPorRangoPrecio(this.precioMin, this.precioMax)
    .subscribe({
      next: (data) => {
        this.servicios.set(data);
        this.loadingServicios.set(false);
      },
      error: () => {
        this.errorServicios.set(
          'No se pudieron filtrar los servicios por precio.',
        );
        this.loadingServicios.set(false);
      },
    });
}

buscarPorNombre(): void {
  if (!this.nombreServicio.trim()) {
    this.errorServicios.set('Escribe un nombre para buscar.');
    return;
  }

  this.loadingServicios.set(true);
  this.errorServicios.set('');

  this.servicioService
    .buscarPorNombre(this.nombreServicio.trim())
    .subscribe({
      next: (data) => {
        this.servicios.set(data);
        this.loadingServicios.set(false);
      },
      error: () => {
        this.errorServicios.set(
          'No se pudieron buscar los servicios por nombre.',
        );
        this.loadingServicios.set(false);
      },
    });
}

limpiarFiltrosServicios(): void {
  this.categoriaSeleccionada = '';
  this.modalidadSeleccionada = '';
  this.precioMin = null;
  this.precioMax = null;
  this.nombreServicio = '';
  this.errorServicios.set('');

  const profesional = this.profesionalSeleccionado();

  if (profesional) {
    this.cargarServicios(profesional.Id);
  } else {
    this.servicios.set([]);
  }
}
aplicarFiltrosServicios(): void {
  const profesional = this.profesionalSeleccionado();

  if (!profesional) {
    this.errorServicios.set(
      'Selecciona un profesional antes de aplicar filtros.',
    );
    return;
  }

  if (
    this.precioMin !== null &&
    this.precioMax !== null &&
    this.precioMin > this.precioMax
  ) {
    this.errorServicios.set(
      'El precio mínimo no puede ser mayor que el precio máximo.',
    );
    return;
  }

  this.loadingServicios.set(true);
  this.errorServicios.set('');

  this.servicioService
    .obtenerServiciosFiltrados(
      profesional.Id,
      this.categoriaSeleccionada
        ? Number(this.categoriaSeleccionada)
        : undefined,
      this.modalidadSeleccionada || undefined,
      this.precioMin,
      this.precioMax,
      this.nombreServicio?.trim() || undefined,
    )
    .subscribe({
      next: (data) => {
        this.servicios.set(data);
        this.loadingServicios.set(false);
      },
      error: () => {
        this.errorServicios.set(
          'No se pudieron aplicar los filtros de servicios.',
        );
        this.loadingServicios.set(false);
      },
    });
}

verDetalleProfesional(id: number): void {
  this.router.navigate(['/profesionalesDetalle/', id]);
}


solicitarCitaConServicio(servicio: Servicio): void {
  const profesional = this.profesionalSeleccionado();

  if (!profesional) {
    return;
  }

  this.router.navigate(['/citas/crear'], {
    queryParams: {
      idprofesional: profesional.Id,
      idservicio: servicio.Id,
    },
  });
}

}