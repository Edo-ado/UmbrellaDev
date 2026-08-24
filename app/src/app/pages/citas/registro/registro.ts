import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ServicioService, Servicio } from '../../../core/services/servicios.service';
import { AuthService } from '../../../core/services/auth.service';
import { EstadoCita } from '../../../core/models/cita.model';
import {Role} from '../../../core/models/usuario.model'

interface UsuarioOption {
  Id: number;
  NombreCompleto: string;
  Role: string;
  Disponibilidad?: boolean;
}

@Component({
  selector: 'app-citas-crear',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class CitasCrear implements OnInit {
  private citaService = inject(CitaService);
  private usuarioService = inject(UsuarioService);
  private servicioService = inject(ServicioService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mostrarConfirmacion = signal<boolean>(false);
  usuarios = signal<UsuarioOption[]>([]);
  serviciosDisponibles = signal<Servicio[]>([]);

  loading = signal<boolean>(false);
  cargandoServicios = signal<boolean>(false);
  guardando = signal<boolean>(false);
  error = signal<string>('');
  mensaje = signal<string>('');

  usuarioActual = this.authService.profesional;

  cargaValida = computed(() => this.usuarioActual()?.Role === Role.USUARIO);

  idprofesional = signal<string>('');
  idservicio = signal<string>('');
  fecha = signal<string>('');
  hora = signal<string>('');
  modalidad = signal<string>('');
  descripcion = signal<string>('');
  comentarios = signal<string>('');

  errores = signal<Record<string, string>>({});

  modalidades = ['VIRTUAL', 'PRESENCIAL', 'HIBRIDA'];

  profesionales = computed(() =>
    this.usuarios().filter((u) => u.Role === 'DESARROLLADOR'),
  );

  servicioSeleccionado = computed(() => {
    const idServ = this.idservicio();
    if (!idServ) return null;

    return this.serviciosDisponibles().find(
      (s) => s.Id === Number(idServ)
    ) ?? null;
  });

  montoEstimado = computed(() => {
    const servicio = this.servicioSeleccionado();
    return servicio ? servicio.Precio : null;
  });

  ngOnInit(): void {
    if (!this.cargaValida()) {
      this.error.set(
        'Solo los usuarios clientes pueden agendar citas. Este usuario no tiene permiso para hacerlo.'
      );
      return;
    }

    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loading.set(true);
    this.error.set('');

    this.usuarioService.listar().subscribe({
      next: (data: any[]) => {
        this.usuarios.set(data);
        this.loading.set(false);
        this.precargarDesdeQueryParams();
      },
      error: (err: any) => {
        console.error(err);
        this.error.set('No se pudieron cargar los datos.');
        this.loading.set(false);
      },
    });
  }

  /**
   * Si venimos desde el Panel General con un profesional/servicio
   * ya elegidos (query params), los precargamos en el formulario.
   */
  private precargarDesdeQueryParams(): void {
    const params = this.route.snapshot.queryParamMap;
    const idProf = params.get('idprofesional');
    const idServ = params.get('idservicio');

    if (!idProf) {
      return;
    }

    const profesionalExiste = this.profesionales().some(
      (p) => p.Id === Number(idProf),
    );

    if (!profesionalExiste) {
      return;
    }

    this.idprofesional.set(idProf);

    this.cargandoServicios.set(true);
    this.servicioService.getByProfesional(Number(idProf)).subscribe({
      next: (data) => {
        this.serviciosDisponibles.set(data);
        this.cargandoServicios.set(false);

        if (idServ && data.some((s) => s.Id === Number(idServ))) {
          this.idservicio.set(idServ);
          this.onServicioChange();
        }
      },
      error: (err) => {
        console.error(err);
        this.cargandoServicios.set(false);
      },
    });
  }

  onProfesionalChange(): void {
    this.idservicio.set('');
    this.serviciosDisponibles.set([]);
    this.modalidad.set('');

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

  onServicioChange(): void {
    const servicio = this.servicioSeleccionado();

    if (servicio) {
      this.modalidad.set(servicio.Modalidad);
    } else {
      this.modalidad.set('');
    }
  }

  private validar(): boolean {
    const errs: Record<string, string> = {};

    if (!this.cargaValida()) {
      errs['cliente'] = 'Solo los usuarios clientes pueden agendar citas.';
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

    if (!this.validar()) {
      this.error.set('Revisá los campos marcados antes de continuar.');
      return;
    }

    this.mostrarConfirmacion.set(true);
  }

  cerrarConfirmacion(): void {
    this.mostrarConfirmacion.set(false);
  }

  confirmarCita(): void {
    if (this.guardando()) {
      return;
    }

    this.mostrarConfirmacion.set(false);
    this.guardando.set(true);

    const body = {
      idcliente: Number(this.usuarioActual()?.Id),
      idprofesional: Number(this.idprofesional()),
      idservicio: Number(this.idservicio()),
      Fecha: this.fecha(),
      Hora: this.hora(),
      Modalidad: this.modalidad() as 'PRESENCIAL' | 'VIRTUAL' | 'HIBRIDA',
      Descripcion: this.descripcion().trim(),
      Comentarios: this.comentarios().trim(),
      Estado: EstadoCita.PENDIENTE as EstadoCita,
    };

    this.citaService.solicitar(body).subscribe({
      next: () => {
        this.mensaje.set('Cita creada correctamente.');
        this.guardando.set(false);
        setTimeout(() => this.router.navigate(['/citas']), 1200);
      },
      error: (err: any) => {
        console.error(err);
        this.error.set(
          err.error?.message || 'No se pudo crear la cita.'
        );
        this.guardando.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/citas']);
  }
}