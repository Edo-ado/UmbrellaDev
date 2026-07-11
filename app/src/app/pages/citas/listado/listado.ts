import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';
import { Cita, EstadoCita } from '../../../core/models/cita.model';

@Component({
  selector: 'app-citas-listado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listado.html',
  styleUrl: './listado.css',
})
export class CitasListadoComponent implements OnInit {
  private citaService = inject(CitaService);
  private router = inject(Router);

  citas = signal<Cita[]>([]);
  loading = signal<boolean>(false);
  error = signal<string>('');
  mensaje = signal<string>('');

  estadoSeleccionado = signal<string>('');
  profesionalSeleccionado = signal<string>('');
  fechaInicial = signal<string>('');
  fechaFinal = signal<string>('');

  estados = Object.values(EstadoCita);

  profesionales = computed(() => {
    const map = new Map<number, string>();
    this.citas().forEach((c) => {
      if (c.profesional) {
        map.set(c.profesional.Id, c.profesional.NombreCompleto);
      }
    });
    return Array.from(map.entries()).map(([id, nombre]) => ({ id, nombre }));
  });

  citasFiltradas = computed(() => {
    const estado = this.estadoSeleccionado();
    const profesionalId = this.profesionalSeleccionado();
    const desde = this.fechaInicial() ? new Date(this.fechaInicial()) : null;
    const hasta = this.fechaFinal() ? new Date(this.fechaFinal()) : null;

    return this.citas().filter((c) => {
      const coincideEstado = !estado || c.Estado === estado;
      const coincideProfesional = !profesionalId || c.idprofesional === Number(profesionalId);
      const fechaCita = new Date(c.Fecha);
      const coincideDesde = !desde || fechaCita >= desde;
      const coincideHasta = !hasta || fechaCita <= hasta;
      return coincideEstado && coincideProfesional && coincideDesde && coincideHasta;
    });
  });

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.loading.set(true);
    this.error.set('');

    this.citaService.getAll().subscribe({
      next: (data) => {
        this.citas.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('No se pudieron cargar las citas.');
        this.loading.set(false);
      },
    });
  }

  limpiarFiltros(): void {
    this.estadoSeleccionado.set('');
    this.profesionalSeleccionado.set('');
    this.fechaInicial.set('');
    this.fechaFinal.set('');
  }

  irACrearCita(): void {
    this.router.navigate(['/citas/crear']);
  }

  irADetalle(id: number): void {
    this.router.navigate(['/citas/detalle', id]);
  }
}