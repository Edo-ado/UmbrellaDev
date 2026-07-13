import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicioService } from '../../../core/services/servicio.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Servicio } from '../../../core/models/servicio.model';
import { Categoria } from '../../../core/models/categoria.model';

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

  ngOnInit(): void {
    this.cargarServicios();
    this.cargarCategorias();
  }

  cargarServicios() {
    this.loading.set(true);
    this.error.set('');

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

  buscar() {
    this.loading.set(true);
    this.error.set('');
    this.mensaje.set('');

    const termino = this.termino.trim();

    if (!termino) {
      this.cargarServicios();
      return;
    }

    this.servicioService.buscarPorNombre(termino).subscribe({
      next: (data) => {
        this.servicios.set(data);
        this.loading.set(false);

        if (data.length === 0) {
          this.mensaje.set(`No se encontró ningún servicio con el nombre "${termino}".`);
        }
      },
      error: () => {
        this.error.set('No se pudo realizar la búsqueda.');
        this.loading.set(false);
      },
    });
  }

  filtrarPorModalidad() {
    if (!this.modalidadSeleccionada) {
      this.cargarServicios();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.servicioService.obtenerPorModalidad(this.modalidadSeleccionada).subscribe({
      next: (data) => {
        this.servicios.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo filtrar por modalidad.');
        this.loading.set(false);
      },
    });
  }

  filtrarPorCategoria() {
    if (!this.categoriaSeleccionada) {
      this.cargarServicios();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.servicioService.obtenerPorCategoria(Number(this.categoriaSeleccionada)).subscribe({
      next: (data) => {
        this.servicios.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo filtrar por categoría.');
        this.loading.set(false);
      },
    });
  }

  filtrarPorRangoPrecio() {
    if (this.precioMin == null || this.precioMax == null) {
      this.cargarServicios();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.servicioService.obtenerPorRangoPrecio(this.precioMin, this.precioMax).subscribe({
      next: (data) => {
        this.servicios.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo filtrar por rango de precio.');
        this.loading.set(false);
      },
    });
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

    this.servicioService.toggleEstado(id).subscribe({
      next: () => {
        this.mensaje.set('Estado actualizado correctamente.');
        this.cargarServicios();
        setTimeout(() => this.mensaje.set(''), 2500);
      },
      error: () => {
        this.error.set('No se pudo actualizar el estado del servicio.');
      },
    });
  }
}