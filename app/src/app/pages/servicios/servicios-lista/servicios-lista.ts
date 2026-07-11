import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-servicios-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './servicios-lista.html',
  styleUrls: ['./servicios-lista.css']
})
export class ServiciosLista implements OnInit {
  apiUrl = 'http://localhost:3000/servicios';
  categoriasUrl = 'http://localhost:3000/categorias';

  servicios: any[] = [];
  serviciosFiltrados: any[] = [];

  termino: string = '';
  modalidadSeleccionada: string = '';
  categoriaSeleccionada: string = '';

  precioMin: number | null = null;
  precioMax: number | null = null;

  categorias: any[] = [];

  mensaje: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.cargarServicios();
    this.cargarCategorias();
  }

  cargarServicios(): void {
    this.loading = true;
    this.error = '';
    this.mensaje = '';

    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.servicios = data;
        this.serviciosFiltrados = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los servicios.';
        this.loading = false;
      }
    });
  }

  cargarCategorias(): void {
    this.http.get<any[]>(this.categoriasUrl).subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: () => {
        this.error = 'No se pudieron cargar las categorías.';
      }
    });
  }

  buscar(): void {
    const terminoLimpio = this.termino.trim().toLowerCase();

    this.serviciosFiltrados = this.servicios.filter((servicio) => {
      const coincideNombre = !terminoLimpio ||
        servicio.Nombre?.toLowerCase().includes(terminoLimpio);

      const coincideModalidad = !this.modalidadSeleccionada ||
        servicio.Modalidad === this.modalidadSeleccionada;

      const coincideCategoria = !this.categoriaSeleccionada ||
        servicio.categoria?.Id?.toString() === this.categoriaSeleccionada;

      const coincidePrecioMin = this.precioMin == null ||
        servicio.Precio >= this.precioMin;

      const coincidePrecioMax = this.precioMax == null ||
        servicio.Precio <= this.precioMax;

      return coincideNombre && coincideModalidad && coincideCategoria &&
             coincidePrecioMin && coincidePrecioMax;
    });

    this.mensaje = this.serviciosFiltrados.length === 0
      ? 'No se encontraron servicios con los filtros aplicados.'
      : '';
  }

  filtrarPorModalidad(): void {
    this.buscar();
  }

  filtrarPorCategoria(): void {
    this.buscar();
  }

  limpiar(): void {
    this.termino = '';
    this.modalidadSeleccionada = '';
    this.categoriaSeleccionada = '';
    this.precioMin = null;
    this.precioMax = null;
    this.mensaje = '';
    this.error = '';
    this.serviciosFiltrados = [...this.servicios];
  }

 toggleEstado(id: number): void {
  this.http.patch<any>(`${this.apiUrl}/CambioEstado/${id}`, {}).subscribe({
    next: (servicioActualizado) => {
      // Actualiza solo el servicio afectado, sin recargar ni reordenar todo
      const actualizar = (lista: any[]) =>
        lista.map(s => s.Id === id ? { ...s, ...servicioActualizado } : s);

      this.servicios = actualizar(this.servicios);
      this.serviciosFiltrados = actualizar(this.serviciosFiltrados);

      this.mensaje = 'Estado del servicio actualizado correctamente.';
    },
    error: () => {
      this.error = 'No se pudo actualizar el estado del servicio.';
    }
  });
}

  irACrear(): void {
    this.router.navigate(['/servicios/create']);
  }

  irAEditar(id: number): void {
    this.router.navigate(['/servicios/edit', id]);
  }

  irADetalle(id: number): void {
    this.router.navigate(['/servicios/detail', id]);
  }
}