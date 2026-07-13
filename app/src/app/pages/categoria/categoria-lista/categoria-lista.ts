import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../core/models/categoria.model';

@Component({
  selector: 'app-categoria-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categoria-lista.html',
  styleUrls: ['./categoria-lista.css'],
})
export class CategoriaLista implements OnInit {
  private categoriaService = inject(CategoriaService);

  categorias = signal<Categoria[]>([]);
  loading = signal(false);
  error = signal('');
  mensaje = signal('');

  termino = '';
  estadoSeleccionado = '';

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.loading.set(true);
    this.error.set('');
    this.mensaje.set('');

    this.categoriaService.listar().subscribe({
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
    const estado = this.estadoSeleccionado as 'ACTIVO' | 'INACTIVO' | '';

    this.loading.set(true);
    this.error.set('');
    this.mensaje.set('');

    if (!termino && !estado) {
      this.cargarCategorias();
      return;
    }

    if (termino) {
      this.categoriaService.buscarPorNombre(termino).subscribe({
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
      return;
    }

    if (estado) {
      this.categoriaService.obtenerPorEstado(estado).subscribe({
        next: (data) => {
          this.categorias.set(data);
          this.loading.set(false);
          if (data.length === 0) {
            this.mensaje.set(`No se encontraron categorías con estado "${estado}".`);
          }
        },
        error: () => {
          this.error.set('No se pudo filtrar por estado.');
          this.loading.set(false);
        },
      });
    }
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

    this.categoriaService.toggleEstado(id).subscribe({
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