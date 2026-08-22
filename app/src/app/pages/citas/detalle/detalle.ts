import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';
import { ResenaService } from '../../../core/services/resena.service';
import { Cita, EstadoCita } from '../../../core/models/cita.model';

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
  private resenaService = inject(ResenaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
 readonly EstadoCita = EstadoCita;


  cita = signal<Cita | null>(null);
  loading = signal<boolean>(false);
  error = signal<string>('');

  

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
    this.router.navigate(['/citas']);
  }
}