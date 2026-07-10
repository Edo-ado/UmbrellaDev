import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';
import { Cita, EstadoCita } from '../../../core/models/cita.model';

@Component({
  selector: 'app-citas-listado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listado.html',
  styleUrl: './listado.css',
})
export class CitasListadoComponent implements OnInit {
  private citaService = inject(CitaService);
  private router = inject(Router);

  citas = signal<Cita[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string | null>(null);

  // Filtros
  filtroEstado = signal<string>('TODOS');
  filtroProfesionalId = signal<string>('TODOS');
  filtroFechaInicial = signal<string>('');
  filtroFechaFinal = signal<string>('');

  estados = Object.values(EstadoCita);

  // Lista de profesionales únicos derivada de las citas cargadas
  profesionales = computed(() => {
    const map = new Map<number, string>();
    this.citas().forEach((c) => {
      if (c.profesional) {
        map.set(c.profesional.id, `${c.profesional.nombre} ${c.profesional.apellido ?? ''}`.trim());
      }
    });
    return Array.from(map.entries()).map(([id, nombre]) => ({ id, nombre }));
  });

  // Citas filtradas combinando los 3 filtros
  citasFiltradas = computed(() => {
    let resultado = this.citas();

    if (this.filtroEstado() !== 'TODOS') {
      resultado = resultado.filter((c) => c.estado === this.filtroEstado());
    }

    if (this.filtroProfesionalId() !== 'TODOS') {
      resultado = resultado.filter(
        (c) => c.profesionalId === Number(this.filtroProfesionalId()),
      );
    }

    if (this.filtroFechaInicial()) {
      const min = new Date(this.filtroFechaInicial());
      resultado = resultado.filter((c) => new Date(c.fecha) >= min);
    }

    if (this.filtroFechaFinal()) {
      const max = new Date(this.filtroFechaFinal());
      resultado = resultado.filter((c) => new Date(c.fecha) <= max);
    }

    return resultado;
  });

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.citaService.getAll().subscribe({
      next: (data) => {
        this.citas.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Error al cargar las citas');
        this.cargando.set(false);
      },
    });
  }

  onFiltroEstadoChange(event: Event): void {
    this.filtroEstado.set((event.target as HTMLSelectElement).value);
  }

  onFiltroProfesionalChange(event: Event): void {
    this.filtroProfesionalId.set((event.target as HTMLSelectElement).value);
  }

  onFiltroFechaInicialChange(event: Event): void {
    this.filtroFechaInicial.set((event.target as HTMLInputElement).value);
  }

  onFiltroFechaFinalChange(event: Event): void {
    this.filtroFechaFinal.set((event.target as HTMLInputElement).value);
  }

  limpiarFiltros(): void {
    this.filtroEstado.set('TODOS');
    this.filtroProfesionalId.set('TODOS');
    this.filtroFechaInicial.set('');
    this.filtroFechaFinal.set('');
  }

  irACrearCita(): void {
    this.router.navigate(['/citasCrear']);
  }

  irADetalle(id: number): void {
    this.router.navigate(['/citasDetalle', id]);
  }
}