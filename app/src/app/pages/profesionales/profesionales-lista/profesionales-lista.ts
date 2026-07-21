import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profesional-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profesionales-lista.html',
  styleUrls: ['./profesionales-lista.css'],
})
export class ProfesionalLista implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/usuarios/';

  profesionales = signal<any[]>([]);
  loading = signal(false);
  error = signal('');
  mensaje = signal('');

  termino = '';
  modalidadSeleccionada = '';
  disponibilidadSeleccionada = '';

  profesionalesFiltrados = computed(() => {
    const termino = this.termino.trim().toLowerCase();
    const modalidad = this.modalidadSeleccionada;
    const disponibilidad = this.disponibilidadSeleccionada;

    return this.profesionales().filter((p) => {
      const coincideNombre = !termino || p.NombreCompleto?.toLowerCase().includes(termino);
      const coincideModalidad = !modalidad || p.Modalidad === modalidad;
      const coincideDisponibilidad = !disponibilidad || String(p.Disponibilidad) === disponibilidad;
      return coincideNombre && coincideModalidad && coincideDisponibilidad;
    });
  });

  ngOnInit(): void {
    this.cargarProfesionales();
  }

  cargarProfesionales() {
    this.loading.set(true);
    this.error.set('');

    this.http.get<any[]>(`${this.apiUrl}rol/DESARROLLADOR`).subscribe({
      next: (data) => {
        this.profesionales.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los profesionales.');
        this.loading.set(false);
      },
    });
  }

  buscar() {
    this.loading.set(true);
    this.error.set('');
    this.mensaje.set('');

    const termino = this.termino.trim();

    if (!termino) {
      this.cargarProfesionales();
      return;
    }

    this.http.get<any[]>(`${this.apiUrl}buscar?nombre=${encodeURIComponent(termino)}`).subscribe({
      next: (data) => {
        this.profesionales.set(data);
        this.loading.set(false);

        if (data.length === 0) {
          this.mensaje.set(`No se encontró ningún profesional con el nombre "${termino}".`);
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
      this.cargarProfesionales();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.http.get<any[]>(`${this.apiUrl}modalidad/${this.modalidadSeleccionada}`).subscribe({
      next: (data) => {
        this.profesionales.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo filtrar por modalidad.');
        this.loading.set(false);
      },
    });
  }

  filtrarPorDisponibilidad() {
    if (!this.disponibilidadSeleccionada) {
      this.cargarProfesionales();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.http.get<any[]>(`${this.apiUrl}/disponibilidad/${this.disponibilidadSeleccionada}`).subscribe({
      next: (data) => {
        this.profesionales.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo filtrar por disponibilidad.');
        this.loading.set(false);
      },
    });
  }

  limpiar() {
    this.termino = '';
    this.modalidadSeleccionada = '';
    this.disponibilidadSeleccionada = '';
    this.cargarProfesionales();
  }

  // ------- Navegación -------

irACrear() {
  this.router.navigate(['/profesionalescrear']);
}

irAEditar(id: number) {
  this.router.navigate(['/profesionalesEditar', id]);
}

irADetalle(id: number) {
  this.router.navigate(['/profesionalesDetalle', id]);
}

  // ------- Disponibilidad -------

  toggleDisponibilidad(id: number) {
    const confirmar = confirm('¿Deseas cambiar la disponibilidad de este profesional?');
    if (!confirmar) return;

    this.http.patch(`${this.apiUrl}CambioDisponibilidad/${id}`, {}).subscribe({
      next: () => {
        this.mensaje.set('Disponibilidad actualizada correctamente.');
        this.cargarProfesionales();
        setTimeout(() => this.mensaje.set(''), 2500);
      },
      error: () => {
        this.error.set('No se pudo actualizar la disponibilidad.');
      },
    });
  }


  
}