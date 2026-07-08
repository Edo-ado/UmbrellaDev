import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-categoria-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categoria-lista.html',
  styleUrls: ['./categoria-lista.css'],
})
export class CategoriaLista implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/categorias';

  categorias = signal<any[]>([]);
  loading = signal(false);
  error = signal('');
  mensaje = signal('');

  termino = '';
  estadoSeleccionado = '';

  categoriasFiltradas = computed(() => {
    const termino = this.termino.trim().toLowerCase();
    const estado = this.estadoSeleccionado;

    return this.categorias().filter((c) => {
      const coincideNombre =
        !termino || c.Nombre?.toLowerCase().includes(termino);
      const coincideEstado = !estado || c.Estado === estado;
      return coincideNombre && coincideEstado;
    });
  });

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.loading.set(true);
    this.error.set('');
    this.mensaje.set('');

    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.categorias.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las categorías.');
        this.loading.set(false);
      },
    });
  }

  buscar() {
    const termino = this.termino.trim();

    if (!termino) {
      this.cargarCategorias();
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.mensaje.set('');

    this.http
      .get<any[]>(`${this.apiUrl}/buscar?nombre=${encodeURIComponent(termino)}`)
      .subscribe({
        next: (data) => {
          this.categorias.set(data);
          this.loading.set(false);

          if (data.length === 0) {
            this.mensaje.set(`No se encontró ninguna categoría con el nombre "${termino}".`);
          }
        },
        error: () => {
          this.error.set('No se pudo realizar la búsqueda.');
          this.loading.set(false);
        },
      });
  }

  limpiar() {
    this.termino = '';
    this.estadoSeleccionado = '';
    this.mensaje.set('');
    this.error.set('');
    this.cargarCategorias();
  }

  toggleEstado(id: number) {
    const confirmar = confirm('¿Deseas cambiar el estado de esta categoría?');
    if (!confirmar) return;

    this.http.patch(`${this.apiUrl}/CambioEstado/${id}`, {}).subscribe({
      next: () => {
        this.mensaje.set('Estado actualizado correctamente.');
        this.cargarCategorias();
        setTimeout(() => this.mensaje.set(''), 2500);
      },
      error: () => {
        this.error.set('No se pudo actualizar el estado de la categoría.');
      },
    });
  }
}