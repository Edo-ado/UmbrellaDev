import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  Cita,
  EstadoCita,
  HistorialEstadoCita,
} from '../../../core/models/cita.model';

@Component({
  selector: 'app-citas-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle.html',
  styleUrl: './detalle.css',
})
export class CitasDetalle implements OnInit {
  private citaService = inject(CitaService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  cita = signal<Cita | null>(null);
  loading = signal<boolean>(false);
  error = signal<string>('');
  mensaje = signal<string>('');

  mostrandoModal = signal<boolean>(false);
  accionPendiente = signal<'rechazar' | 'cancelar' | null>(null);
  motivoModal = signal<string>('');
  errorMotivo = signal<string>('');

  usuarioActual = this.authService.profesional;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error.set('ID de cita inválido.');
      return;
    }

    this.cargarCita(id);
  }

  cargarCita(id: number): void {
    this.loading.set(true);
    this.error.set('');

    this.citaService.getById(id).subscribe({
      next: (data) => {
        this.cita.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set(
          err.error?.message || 'No se pudo cargar la cita.'
        );
        this.loading.set(false);
      },
    });
  }

  volver(): void {
    this.router.navigate(['/citas']);
  }

  abrirModalRechazar(): void {
    this.accionPendiente.set('rechazar');
    this.motivoModal.set('');
    this.errorMotivo.set('');
    this.mostrandoModal.set(true);
  }

  abrirModalCancelar(): void {
    this.accionPendiente.set('cancelar');
    this.motivoModal.set('');
    this.errorMotivo.set('');
    this.mostrandoModal.set(true);
  }

  cerrarModal(): void {
    this.mostrandoModal.set(false);
    this.accionPendiente.set(null);
    this.motivoModal.set('');
    this.errorMotivo.set('');
  }

  confirmarAccion(): void {
    const cita = this.cita();
    const accion = this.accionPendiente();
    const motivo = this.motivoModal().trim();

    if (!cita || !accion) {
      return;
    }

    if (!motivo) {
      this.errorMotivo.set('El motivo es obligatorio.');
      return;
    }

    this.error.set('');
    this.mensaje.set('');

    if (accion === 'rechazar') {
      this.rechazarCita(cita.Id, motivo);
      return;
    }

    this.cancelarCita(cita.Id, motivo);
  }

  private rechazarCita(idCita: number, motivo: string): void {
    this.citaService.rechazar(idCita, motivo).subscribe({
      next: () => {
        this.mensaje.set('Cita rechazada correctamente.');
        this.cerrarModal();
        this.cargarCita(idCita);
      },
      error: (err) => {
        this.errorMotivo.set(
          err.error?.message || 'No se pudo rechazar la cita.'
        );
      },
    });
  }

  private cancelarCita(idCita: number, motivo: string): void {
    const usuario = this.usuarioActual();
    const actorRol = usuario?.Role;

    if (!actorRol) {
      this.errorMotivo.set(
        'No se pudo identificar el rol del usuario actual.'
      );
      return;
    }

    this.citaService.cancelar(idCita, motivo, actorRol).subscribe({
      next: () => {
        this.mensaje.set('Cita cancelada correctamente.');
        this.cerrarModal();
        this.cargarCita(idCita);
      },
      error: (err) => {
        this.errorMotivo.set(
          err.error?.message || 'No se pudo cancelar la cita.'
        );
      },
    });
  }

  getHistorialEstados(): HistorialEstadoCita[] {
    return this.cita()?.historialEstadoCitas ?? [];
  }

  private esElProfesionalDeLaCita(cita: Cita): boolean {
    const usuario = this.usuarioActual();

    return !!usuario && usuario.Id === cita.idprofesional;
  }

  private esElClienteDeLaCita(cita: Cita): boolean {
    const usuario = this.usuarioActual();

    return !!usuario && usuario.Id === cita.idcliente;
  }

  puedeAceptar(): boolean {
    const cita = this.cita();

    return !!cita &&
      cita.Estado === EstadoCita.PENDIENTE &&
      this.esElProfesionalDeLaCita(cita);
  }

  puedeRechazar(): boolean {
    const cita = this.cita();

    return !!cita &&
      cita.Estado === EstadoCita.PENDIENTE &&
      this.esElProfesionalDeLaCita(cita);
  }

  puedeCancelar(): boolean {
    const cita = this.cita();

    if (!cita) {
      return false;
    }

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

  puedeCompletar(): boolean {
    const cita = this.cita();

    return !!cita &&
      cita.Estado === EstadoCita.ACEPTADA &&
      this.esElProfesionalDeLaCita(cita);
  }

  aceptar(): void {
    const cita = this.cita();

    if (!cita) {
      return;
    }

    this.error.set('');
    this.mensaje.set('');

    this.citaService.aceptar(cita.Id).subscribe({
      next: () => {
        this.mensaje.set('Cita aceptada correctamente.');
        this.cargarCita(cita.Id);
      },
      error: (err) => {
        this.error.set(
          err.error?.message || 'No se pudo aceptar la cita.'
        );
      },
    });
  }

  completar(): void {
    const cita = this.cita();

    if (!cita) {
      return;
    }

    this.error.set('');
    this.mensaje.set('');

    this.citaService.completar(cita.Id).subscribe({
      next: () => {
        this.mensaje.set('Cita completada correctamente.');
        this.cargarCita(cita.Id);
      },
      error: (err) => {
        this.error.set(
          err.error?.message || 'No se pudo completar la cita.'
        );
      },
    });
  }
}