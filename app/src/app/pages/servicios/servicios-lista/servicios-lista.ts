import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicioService } from '../../../core/services/servicio.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Servicio } from '../../../core/models/servicio.model';
import { Role } from '../../../core/models/usuario.model';
import { Categoria } from '../../../core/models/categoria.model';

import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-servicios-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios-lista.html',
  styleUrls: ['./servicios-lista.css'],
})
export class ServiciosLista implements OnInit {
  private servicioService = inject(ServicioService);
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);
private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  servicios = signal<Servicio[]>([]);
  categorias = signal<Categoria[]>([]);
  loading = signal(false);
  error = signal('');
  mensaje = signal('');

  termino = '';
  categoriaSeleccionada = '';
  modalidadSeleccionada = '';
  precioMin: number | null = null;
  precioMax: number | null = null;
  private filtrosVersion = signal(0);

  serviciosFiltrados = computed(() => {
    this.filtrosVersion();
    const termino = this.termino.trim().toLowerCase();
    const categoria = Number(this.categoriaSeleccionada);
    const modalidad = this.modalidadSeleccionada;
    const precioMin = this.precioMin;
    const precioMax = this.precioMax;

    return this.servicios().filter((servicio) => {
      const coincideNombre = !termino || servicio.Nombre.toLowerCase().includes(termino);
      const coincideCategoria = !this.categoriaSeleccionada || servicio.idcategoria === categoria;
      const coincideModalidad = !modalidad || servicio.Modalidad === modalidad;
      const coincidePrecioMin = precioMin == null || servicio.Precio >= precioMin;
      const coincidePrecioMax = precioMax == null || servicio.Precio <= precioMax;

      return (
        coincideNombre &&
        coincideCategoria &&
        coincideModalidad &&
        coincidePrecioMin &&
        coincidePrecioMax
      );
    });
  });

  ngOnInit(): void {
    this.cargarServicios();
    this.cargarCategorias();
  }

cargarServicios() {
  this.loading.set(true);
  this.error.set('');
  this.mensaje.set('');

  const usuario = this.authService.profesional();

  if (!usuario) {
    this.error.set('No hay una sesión iniciada.');
    this.loading.set(false);
    return;
  }

  
  if (usuario.Role === Role.ADMIN) {
    this.servicioService.listar().subscribe({
      next: (data) => {
        this.servicios.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los servicios.');
        this.loading.set(false);
      },
    });

    return;
  }

  if (usuario.Role === Role.DESARROLLADOR) {
    this.servicioService.obtenerPorProfesionalActivo(usuario.Id).subscribe({
      next: (data) => {
        this.servicios.set(data);
        this.loading.set(false);

        if (data.length === 0) {
          this.mensaje.set('No tienes servicios registrados.');
        }
      },
      error: () => {
        this.error.set('No se pudieron cargar tus servicios.');
        this.loading.set(false);
      },
    });

    return;
  }


  this.servicios.set([]);
  this.error.set('No tienes permisos para ver servicios.');
  this.loading.set(false);
}

  cargarCategorias() {
    this.categoriaService.listar().subscribe({
      next: (data) => {
        this.categorias.set(data);
      },
      error: () => {
        this.error.set('No se pudieron cargar las categorías.');
      },
    });
  }

  aplicarFiltros() {
    this.error.set('');
    this.mensaje.set('');
    this.filtrosVersion.update((version) => version + 1);
  }

  limpiar() {
    this.termino = '';
    this.categoriaSeleccionada = '';
    this.modalidadSeleccionada = '';
    this.precioMin = null;
    this.precioMax = null;
    this.mensaje.set('');
    this.error.set('');
    this.cargarServicios();
  }



  irACrear() {
    this.router.navigate(['/servicios/create']);
  }

  irAEditar(id: number) {
    this.router.navigate(['/servicios/edit', id]);
  }

  irADetalle(id: number) {
    this.router.navigate(['/servicios/detail', id]);
  }


  toggleEstado(id: number) {
    const confirmar = confirm('¿Deseas cambiar el estado de este servicio?');
    if (!confirmar) return;

    const servicio = this.servicios().find((item) => item.Id === id);
    const accion = servicio?.Estado === 'ACTIVO' ? 'desactivado' : 'activado';

    this.servicioService.toggleEstado(id).subscribe({
      next: () => {
        this.notificationService.success(`Servicio ${accion} correctamente.`);
        this.cargarServicios();
      },
      error: () => {
        this.notificationService.error(
          'No se pudo actualizar el estado del servicio.'
        );
      },
    });
  }
}