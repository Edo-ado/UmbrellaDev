import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
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
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  citas = signal<Cita[]>([]);
  loading = signal<boolean>(false);
  error = signal<string>('');
  mensaje = signal<string>('');
  mostrandoModalMotivo = signal<boolean>(false);
  citaPendienteMotivo = signal<Cita | null>(null);
  accionMotivo = signal<'rechazo' | 'cancelacion'>('rechazo');
  motivoEstado = signal<string>('');
  errorMotivoEstado = signal<string>('');

  estadoSeleccionado = signal<string>('');
  profesionalSeleccionado = signal<string>('');
  fechaInicial = signal<string>('');
  fechaFinal = signal<string>('');

  estados = Object.values(EstadoCita);

  usuarioActual = this.authService.profesional;


  // NUEVO: primero restringimos qué citas puede VER cada rol
  // - DESARROLLADOR (profesional): solo las citas donde él es el profesional
  // - USUARIO (cliente): solo las citas donde él es el cliente
  // - ADMIN: todas

citasVisibles = computed(() => {
  const usuario = this.usuarioActual();
  const todasLasCitas = this.citas();

  if (!usuario) {
    return [];
  }

  // ADMIN: ve todas las citas.
  if (usuario.Role === 'ADMIN') {
    return todasLasCitas;
  }

  // DESARROLLADOR: ve las citas donde es profesional.
  if (usuario.Role === 'DESARROLLADOR') {
    return todasLasCitas.filter(
      (cita) => cita.idprofesional === usuario.Id,
    );
  }

  // USUARIO: ve las citas donde es cliente.
  if (usuario.Role === 'USUARIO') {
    return todasLasCitas.filter(
      (cita) => cita.idcliente === usuario.Id,
    );
  }

  
  return [];
});

  profesionales = computed(() => {
    const map = new Map<number, string>();

    this.citasVisibles().forEach((cita) => {
      if (cita.profesional) {
        map.set(cita.profesional.Id, cita.profesional.NombreCompleto);
      }
    });

    return Array.from(map.entries()).map(([id, nombre]) => ({
      id,
      nombre,
    }));
  });


  //Los filtros del panel se aplican SOBRE citasVisibles, no sobre todas las citas
  citasFiltradas = computed(() => {
    const estado = this.estadoSeleccionado();
    const profesionalId = this.profesionalSeleccionado();
    const desde = this.fechaInicial() ? new Date(this.fechaInicial()) : null;
    const hasta = this.fechaFinal() ? new Date(this.fechaFinal()) : null;

    return this.citasVisibles().filter((cita) => {
      const coincideEstado = !estado || cita.Estado === estado;

      const coincideProfesional =!profesionalId || cita.idprofesional === Number(profesionalId);

      const fechaCita = new Date(cita.Fecha);

      const coincideDesde = !desde || fechaCita >= desde;

      const coincideHasta = !hasta || fechaCita <= hasta;

      return (
        coincideEstado &&
        coincideProfesional &&
        coincideDesde &&
        coincideHasta
      );
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

  private esElProfesionalDeLaCita(cita: Cita): boolean {
    const usuario = this.usuarioActual();
    return !!usuario && usuario.Id === cita.idprofesional;
  }

  private esElClienteDeLaCita(cita: Cita): boolean {
    const usuario = this.usuarioActual();
    return !!usuario && usuario.Id === cita.idcliente;
  }

  puedeAceptar(cita: Cita): boolean {
    return (
      cita.Estado === EstadoCita.PENDIENTE &&
      this.esElProfesionalDeLaCita(cita)
    );
  }

  puedeRechazar(cita: Cita): boolean {
    return (
      cita.Estado === EstadoCita.PENDIENTE &&
      this.esElProfesionalDeLaCita(cita)
    );
  }

  puedeCancelar(cita: Cita): boolean {
    if (cita.Estado === EstadoCita.PENDIENTE) {
      return this.esElClienteDeLaCita(cita);
    }

    if (cita.Estado === EstadoCita.ACEPTADA) {
      return (
        this.esElClienteDeLaCita(cita) ||
        this.esElProfesionalDeLaCita(cita)
      );
    }

    return false;
  }

  puedeCompletar(cita: Cita): boolean {
    return (
      cita.Estado === EstadoCita.ACEPTADA &&
      this.esElProfesionalDeLaCita(cita)
    );
  }

  aceptar(cita: Cita): void {
    this.error.set('');
    this.mensaje.set('');

    this.citaService.aceptar(cita.Id).subscribe({
      next: () => {
        this.mensaje.set('Cita aceptada correctamente.');
        this.notificationService.success('Cita aceptada correctamente.');
        this.cargarCitas();
      },
      error: () => {},
    });
  }

  rechazar(cita: Cita): void {
    this.abrirModalMotivo(cita, 'rechazo');
  }

  cancelar(cita: Cita): void {
    this.abrirModalMotivo(cita, 'cancelacion');
  }

  private abrirModalMotivo(
    cita: Cita,
    accion: 'rechazo' | 'cancelacion',
  ): void {
    this.citaPendienteMotivo.set(cita);
    this.accionMotivo.set(accion);
    this.motivoEstado.set('');
    this.errorMotivoEstado.set('');
    this.mostrandoModalMotivo.set(true);
  }

  cerrarModalMotivo(): void {
    this.mostrandoModalMotivo.set(false);
    this.citaPendienteMotivo.set(null);
    this.motivoEstado.set('');
    this.errorMotivoEstado.set('');
  }

  confirmarMotivo(): void {
    const cita = this.citaPendienteMotivo();
    const motivo = this.motivoEstado().trim();

    if (!cita) {
      return;
    }

    if (!motivo) {
      const accion = this.accionMotivo() === 'rechazo' ? 'rechazo' : 'cancelación';
      this.errorMotivoEstado.set(`El motivo de la ${accion} es obligatorio.`);
      return;
    }

    this.error.set('');
    this.mensaje.set('');

    if (this.accionMotivo() === 'rechazo') {
      this.citaService.rechazar(cita.Id, motivo).subscribe({
        next: () => {
          this.cerrarModalMotivo();
          this.mensaje.set('Cita rechazada correctamente.');
          this.notificationService.success('Cita rechazada correctamente.');
          this.cargarCitas();
        },
        error: () => {},
      });
      return;
    }

    const actorRol = this.usuarioActual()?.Role;

    if (!actorRol) {
      this.notificationService.error(
        'No se pudo identificar el rol del usuario.'
      );
      return;
    }

    this.citaService.cancelar(cita.Id, motivo, actorRol).subscribe({
      next: () => {
        this.cerrarModalMotivo();
        this.mensaje.set('Cita cancelada correctamente.');
        this.notificationService.success('Cita cancelada correctamente.');
        this.cargarCitas();
      },
      error: () => {},
    });
  }

  completar(cita: Cita): void {
    this.error.set('');
    this.mensaje.set('');

    this.citaService.completar(cita.Id).subscribe({
      next: () => {
        this.mensaje.set('Cita completada correctamente.');
        this.notificationService.success('Cita completada correctamente.');
        this.cargarCitas();
      },
      error: () => {},
    });
  }
}