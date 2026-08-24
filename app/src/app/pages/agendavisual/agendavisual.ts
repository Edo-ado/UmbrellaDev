import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  addMonths,
  differenceInMinutes,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';

import { CitaService } from '../../core/services/cita.service';
import { AuthService } from '../../core/services/auth.service';
import { Cita, EstadoCita } from '../../core/models/cita.model';

@Component({
  selector: 'app-agenda-visual',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agendavisual.html',
  styleUrl: './agendavisual.css',
})
export class AgendaVisualComponent implements OnInit {
  private citaService = inject(CitaService);
  private authService = inject(AuthService);
  private router = inject(Router);

  citas = signal<Cita[]>([]);
  mesActual = signal(new Date());
  loading = signal(false);
  error = signal('');


    estadoSeleccionado = signal<EstadoCita | ''>('');
    profesionalSeleccionado = signal('');
    fechaInicial = signal('');
    fechaFinal = signal('');

    estados = Object.values(EstadoCita);

  diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  usuarioActual = this.authService.profesional;

  nombreMes = computed(() =>
    format(this.mesActual(), 'MMMM yyyy', { locale: es }),
  );

  citasVisibles = computed(() => {
    const usuario = this.usuarioActual();
    const todasLasCitas = this.citas();

    if (!usuario) {
      return [];
    }

    //admin ve todas las citas
    if (usuario.Role === 'ADMIN') {
      return todasLasCitas;
    }

    //desarrollador ve sus citas
    if (usuario.Role === 'DESARROLLADOR') {
      return todasLasCitas.filter(
        (cita) => cita.idprofesional === usuario.Id,
      );
    }

    //usuario ve las citas donde es cliente
    if (usuario.Role === 'USUARIO') {
      return todasLasCitas.filter(
        (cita) => cita.idcliente === usuario.Id,
      );
    }

    return [];
  });

profesionales = computed(() => {
  const mapa = new Map<number, string>();

  this.citas().forEach((cita) => {
    if (cita.profesional) {
      mapa.set(
        cita.profesional.Id,
        cita.profesional.NombreCompleto,
      );
    }
  });

  return Array.from(mapa.entries()).map(([id, nombre]) => ({
    id,
    nombre,
  }));
});



  diasDelMes = computed(() => {
    const mes = this.mesActual();

    return eachDayOfInterval({
      start: startOfWeek(startOfMonth(mes), { weekStartsOn: 1 }),
      end: endOfWeek(endOfMonth(mes), { weekStartsOn: 1 }),
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
      error: () => {
        this.error.set('No se pudieron cargar las citas.');
        this.loading.set(false);
      },
    });
  }


  filtrarPorProfesional(): void {
  const profesionalId = Number(this.profesionalSeleccionado());

  if (!profesionalId) {
    this.cargarCitas();
    return;
  }

  this.estadoSeleccionado.set('');
  this.fechaInicial.set('');
  this.fechaFinal.set('');

  this.loading.set(true);
  this.error.set('');

  this.citaService.getByProfesional(profesionalId).subscribe({
    next: (data) => {
      this.citas.set(data);
      this.loading.set(false);
    },
    error: () => {
      this.error.set('No se pudieron cargar las citas del profesional.');
      this.loading.set(false);
    },
  });
}

filtrarPorEstado(): void {
  const estado = this.estadoSeleccionado();

  if (!estado) {
    this.cargarCitas();
    return;
  }

  this.profesionalSeleccionado.set('');
  this.fechaInicial.set('');
  this.fechaFinal.set('');

  this.loading.set(true);
  this.error.set('');

  this.citaService.getByStatus(estado).subscribe({
    next: (data) => {
      this.citas.set(data);
      this.loading.set(false);
    },
    error: () => {
      this.error.set('No se pudieron cargar las citas por estado.');
      this.loading.set(false);
    },
  });
}


filtrarPorFechas(): void {
  const fechaInicial = this.fechaInicial();
  const fechaFinal = this.fechaFinal();

  if (!fechaInicial || !fechaFinal) {
    this.error.set('Selecciona una fecha inicial y una fecha final.');
    return;
  }

  this.estadoSeleccionado.set('');
  this.profesionalSeleccionado.set('');

  this.loading.set(true);
  this.error.set('');

  this.citaService.getByFechas(fechaInicial, fechaFinal).subscribe({
    next: (data) => {
      this.citas.set(data);
      this.loading.set(false);
    },
    error: () => {
      this.error.set('No se pudieron cargar las citas por fechas.');
      this.loading.set(false);
    },
  });
}

limpiarFiltros(): void {
  this.estadoSeleccionado.set('');
  this.profesionalSeleccionado.set('');
  this.fechaInicial.set('');
  this.fechaFinal.set('');

  this.cargarCitas();
}

  mesAnterior(): void {
    this.mesActual.update((fecha) => subMonths(fecha, 1));
  }

  mesSiguiente(): void {
    this.mesActual.update((fecha) => addMonths(fecha, 1));
  }

  irAHoy(): void {
    this.mesActual.set(new Date());
  }

  esDelMesActual(dia: Date): boolean {
    return isSameMonth(dia, this.mesActual());
  }

  citasDelDia(dia: Date): Cita[] {
    return this.citasVisibles().filter((cita) =>
      isSameDay(new Date(cita.Fecha), dia),
    );
  }


  


  
  irADetalle(citaId: number): void {
    this.router.navigate(['/citas/detalle', citaId]);
  }
}