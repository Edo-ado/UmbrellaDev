import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ServicioService, Servicio } from '../../../core/services/servicios.service';
import { EstadoCita } from '../../../core/models/cita.model';

interface UsuarioOption {
  Id: number;
  NombreCompleto: string;
  Role: string;
}

@Component({
  selector: 'app-citas-crear',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class CitasCrear implements OnInit {
  private citaService = inject(CitaService);
  private usuarioService = inject(UsuarioService);
  private servicioService = inject(ServicioService);
  private router = inject(Router);

  usuarios = signal<UsuarioOption[]>([]);
  serviciosDisponibles = signal<Servicio[]>([]);

  loading = signal<boolean>(false);
  cargandoServicios = signal<boolean>(false);
  guardando = signal<boolean>(false);
  error = signal<string>('');
  mensaje = signal<string>('');

  // Campos del formulario
  idcliente = signal<string>('');
  idprofesional = signal<string>('');
  idservicio = signal<string>('');
  fecha = signal<string>('');
  hora = signal<string>('');
  modalidad = signal<string>('');
  descripcion = signal<string>('');
  comentarios = signal<string>('');

  errores = signal<Record<string, string>>({});

  modalidades = ['VIRTUAL', 'PRESENCIAL', 'HIBRIDA'];

  clientes = computed(() => this.usuarios().filter((u) => u.Role === 'USUARIO'));
  profesionales = computed(() =>
    this.usuarios().filter((u) => u.Role === 'DESARROLLADOR'),
  );

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loading.set(true);
    this.error.set('');

    this.usuarioService.listar().subscribe({
      next: (data: any[]) => {
        this.usuarios.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error(err);
        this.error.set('No se pudieron cargar los datos.');
        this.loading.set(false);
      },
    });
  }

  onProfesionalChange(): void {
    this.idservicio.set('');
    this.serviciosDisponibles.set([]);

    const profId = this.idprofesional();
    if (!profId) return;

    this.cargandoServicios.set(true);
    this.servicioService.getByProfesional(Number(profId)).subscribe({
      next: (data) => {
        this.serviciosDisponibles.set(data);
        this.cargandoServicios.set(false);
      },
      error: (err) => {
        console.error(err);
        this.cargandoServicios.set(false);
      },
    });
  }

  private validar(): boolean {
    const errs: Record<string, string> = {};

    if (!this.idcliente()) {
      errs['cliente'] = 'El cliente es obligatorio.';
    }

    if (!this.idprofesional()) {
      errs['profesional'] = 'El profesional es obligatorio.';
    }

    if (!this.idservicio()) {
      errs['servicio'] = 'El servicio es obligatorio.';
    } else if (
      this.idprofesional() &&
      !this.serviciosDisponibles().some((s) => s.Id === Number(this.idservicio()))
    ) {
      errs['servicio'] = 'El servicio seleccionado no pertenece al profesional elegido.';
    }

    if (!this.fecha()) {
      errs['fecha'] = 'La fecha es obligatoria.';
    } else {
      const fechaSeleccionada = new Date(this.fecha() + 'T00:00:00');
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (isNaN(fechaSeleccionada.getTime())) {
        errs['fecha'] = 'El formato de la fecha no es válido.';
      } else if (fechaSeleccionada < hoy) {
        errs['fecha'] = 'La fecha no puede ser anterior a hoy.';
      }
    }

    if (!this.hora()) {
      errs['hora'] = 'La hora es obligatoria.';
    } else if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(this.hora())) {
      errs['hora'] = 'El formato de la hora no es válido.';
    }

    if (!this.modalidad()) {
      errs['modalidad'] = 'La modalidad es obligatoria.';
    }

    if (!this.descripcion().trim()) {
      errs['descripcion'] = 'La descripción es obligatoria.';
    } else if (this.descripcion().trim().length < 10) {
      errs['descripcion'] = 'La descripción debe tener al menos 10 caracteres.';
    }

    this.errores.set(errs);
    return Object.keys(errs).length === 0;
  }

  guardar(): void {
    this.mensaje.set('');
    this.error.set('');

    // if (!this.validar()) {
    //   this.error.set('Revisá los campos marcados antes de continuar.');
    //   return;
    // }

    this.guardando.set(true);

    const body = {
      idcliente: Number(this.idcliente()),
      idprofesional: Number(this.idprofesional()),
      idservicio: Number(this.idservicio()),
      Fecha: this.fecha(),
      Hora: this.hora(),
      Modalidad: this.modalidad(),
      Descripcion: this.descripcion().trim(),
      Comentarios: this.comentarios().trim(),
      Estado: EstadoCita.PENDIENTE as EstadoCita,
    };

    this.citaService.create(body).subscribe({
      next: () => {
        this.mensaje.set('Cita creada correctamente.');
        this.guardando.set(false);
        setTimeout(() => this.router.navigate(['/citas']), 1200);
      },
      error: (err: any) => {
        console.error(err);
        this.error.set('No se pudo crear la cita.');
        this.guardando.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/citas']);
  }
}