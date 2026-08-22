import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';
import { Location } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import {
  Cita,
  EstadoCita,
  HistorialEstadoCita,
} from '../../../core/models/cita.model';

import { ResenaService } from '../../../core/services/resena.service';


import { ResenaDeCita } from '../../../core/models/resena.model';



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
  private resenaService = inject(ResenaService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private router = inject(Router);
 readonly EstadoCita = EstadoCita;


  cita = signal<Cita | null>(null);
  loading = signal<boolean>(false);
  error = signal<string>('');
  mensaje = signal<string>('');

  mostrandoModal = signal<boolean>(false);
  accionPendiente = signal<'rechazar' | 'cancelar' | null>(null);
  motivoModal = signal<string>('');
  errorMotivo = signal<string>('');

  usuarioActual = this.authService.profesional;

  

resenaExistente = signal<ResenaDeCita | null>(null);
verificandoResena = signal<boolean>(false);
resenaEnviada = signal<boolean>(false);




tieneResena = computed(() => this.resenaExistente() !== null);
  
  hoverPuntuacion = signal<number>(0);
  puntuacion = signal<number>(5);
  comentario = signal<string>('');
  enviandoResena = signal<boolean>(false);
  errorResena = signal<string>('');

 
  puedeDejarResena = computed(() => {
  const c = this.cita();
  return (
    !!c &&
    c.Estado === EstadoCita.COMPLETA &&
    !this.tieneResena() &&
    !this.resenaEnviada()
  );
});

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
  this.loading.set(true);
  this.error.set('');

  this.citaService.getById(id).subscribe({
    next: (data) => {
      this.cita.set(data);
      this.loading.set(false);

      if (data?.Estado === EstadoCita.COMPLETA) {
        this.verificarResena(id);
      }
    },
    error: (err) => {
      console.error(err);
      this.error.set('No se pudo cargar la cita.');
      this.loading.set(false);
    },
  });
}

  verificarResena(citaId: number): void {
  this.verificandoResena.set(true);

  this.resenaService.obtenerPorCita(citaId).subscribe({
    next: (res) => {
      this.resenaExistente.set(res);
      this.verificandoResena.set(false);
    },
    error: (err) => {
      console.error(err);
      this.verificandoResena.set(false);
    },
  });
}

  enviarResena(): void {
    const c = this.cita();
    if (!c) return;

    this.errorResena.set('');

    if (!this.comentario().trim()) {
      this.errorResena.set('El comentario es obligatorio.');
      return;
    }

    if (
      !Number.isInteger(this.puntuacion()) ||
      this.puntuacion() < 1 ||
      this.puntuacion() > 10
    ) {
      this.errorResena.set('La calificación debe ser un entero entre 1 y 10.');
      return;
    }

    this.enviandoResena.set(true);

   this.resenaService
  .dejarResena({
    idcita: c.Id,
    Comentario: this.comentario(),
    Puntuacion: this.puntuacion(),
  })
  .subscribe({
    next: (nuevaResena) => {
      this.enviandoResena.set(false);
      this.resenaEnviada.set(true);
      this.resenaExistente.set(nuevaResena as any); // ajusta el tipo según lo que devuelva create
    },
    error: (err) => {
      console.error(err);
      this.enviandoResena.set(false);
      this.errorResena.set(
        err?.error?.message || 'No se pudo registrar la reseña.',
      );
    },
  });
  }

volver(): void {
  this.location .back();
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