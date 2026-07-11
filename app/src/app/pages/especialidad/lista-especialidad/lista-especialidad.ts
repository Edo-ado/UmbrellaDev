import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EspecialidadService } from '../../../core/services/especialidad.service'; 
import { Especialidad } from '../../../core/models/especialidad.model'; 

@Component({
  selector: 'app-especialidad-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-especialidad.html',
  styleUrls: ['./lista-especialidad.css'],
})
export class EspecialidadLista implements OnInit {
  private especialidadService = inject(EspecialidadService);

  especialidades = signal<Especialidad[]>([]);
  loading = signal(false);
  error = signal('');
  mensaje = signal('');

  termino = '';
  estadoSeleccionado = '';

  especialidadesFiltradas = computed(() => {
    const termino = this.termino.trim().toLowerCase();
    const estado = this.estadoSeleccionado;

    return this.especialidades().filter((e) => {
      const coincideNombre =
        !termino || e.Nombre?.toLowerCase().includes(termino);
      const coincideEstado = !estado || e.Estado === estado;
      return coincideNombre && coincideEstado;
    });
  });

  ngOnInit(): void {
    this.cargarEspecialidades();
  }

  cargarEspecialidades() {
    this.loading.set(true);
    this.error.set('');
    this.mensaje.set('');

    this.especialidadService.listar().subscribe({
      next: (data) => {
        this.especialidades.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las especialidades.');
        this.loading.set(false);
      },
    });
  }

  buscar() {
    const termino = this.termino.trim();

    if (!termino) {
      this.cargarEspecialidades();
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.mensaje.set('');

    this.especialidadService.buscarPorNombre(termino).subscribe({
      next: (data) => {
        this.especialidades.set(data);
        this.loading.set(false);

        if (data.length === 0) {
          this.mensaje.set(`No se encontró ninguna especialidad con el nombre "${termino}".`);
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
    this.cargarEspecialidades();
  }

  toggleEstado(id: number) {
    const confirmar = confirm('¿Deseas cambiar el estado de esta especialidad?');
    if (!confirmar) return;

    this.especialidadService.toggleEstado(id).subscribe({
      next: () => {
        this.mensaje.set('Estado actualizado correctamente.');
        this.cargarEspecialidades();
        setTimeout(() => this.mensaje.set(''), 2500);
      },
      error: () => {
        this.error.set('No se pudo actualizar el estado de la especialidad.');
      },
    });
  }
}