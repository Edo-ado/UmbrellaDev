import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cita-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-lista.html',
  styleUrls: ['./usuario-lista.css'],
})
export class CitaLista implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/api/citas';

  citas = signal<any[]>([]);
  loading = signal(false);
  error = signal('');
  mensaje = signal('');

  // Filtros
  estadoSeleccionado = '';
  profesionalSeleccionado = '';
  fechaInicial = '';
  fechaFinal = '';

  estados = ['PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA'];

  // Lista de profesionales derivada de las citas cargadas
  profesionales = computed(() => {
    const map = new Map<number, string>();
    this.citas().forEach((c) => {
      if (c.profesional) {
        map.set(c.profesional.id, `${c.profesional.nombre} ${c.profesional.apellido ?? ''}`.trim());
      }
    });
    return Array.from(map.entries()).map(([id, nombre]) => ({ id, nombre }));
  });

  // Combina los 3 filtros sobre las citas ya cargadas
  citasFiltradas = computed(() => {
    const estado = this.estadoSeleccionado;
    const profesionalId = this.profesionalSeleccionado;
    const desde = this.fechaInicial ? new Date(this.fechaInicial) : null;
    const hasta = this.fechaFinal ? new Date(this.fechaFinal) : null;

    return this.citas().filter((c) => {
      const coincideEstado = !estado || c.estado === estado;
      const coincideProfesional = !profesionalId || c.profesionalId === Number(profesionalId);
      const fechaCita = new Date(c.fecha);
      const coincideDesde = !desde || fechaCita >= desde;
      const coincideHasta = !hasta || fechaCita <= hasta;
      return coincideEstado && coincideProfesional && coincideDesde && coincideHasta;
    });
  });

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas() {
    this.loading.set(true);
    this.error.set('');

    this.http.get<any[]>(`${this.apiUrl}`).subscribe({
      next: (data) => {
        this.citas.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las citas.');
        this.loading.set(false);
      },
    });
  }

  limpiarFiltros() {
    this.estadoSeleccionado = '';
    this.profesionalSeleccionado = '';
    this.fechaInicial = '';
    this.fechaFinal = '';
  }

  irACrear() {
    this.router.navigate(['/citasCrear']);
  }

  irADetalle(id: number) {
    this.router.navigate(['/citasDetalle', id]);
  }
}