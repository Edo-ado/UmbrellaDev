import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';
import { Cita } from '../../../core/models/cita.model';

@Component({
  selector: 'app-citas-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle.html',
  styleUrl: './detalle.css',
})
export class CitasDetalle implements OnInit {
  private citaService = inject(CitaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  cita = signal<Cita | null>(null);
  loading = signal<boolean>(false);
  error = signal<string>('');

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
        this.error.set('No se pudo cargar la cita.');
        this.loading.set(false);
      },
    });
  }

  volver(): void {
    this.router.navigate(['/citas']);
  }
}