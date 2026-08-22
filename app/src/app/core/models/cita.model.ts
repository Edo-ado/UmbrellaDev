export enum EstadoCita {
  PENDIENTE = 'PENDIENTE',
  ACEPTADA = 'ACEPTADA',
  RECHAZADA = 'RECHAZADA',
  CANCELADA = 'CANCELADA',
  COMPLETA = 'COMPLETA',
}

export interface HistorialEstadoCita {
  Id: number;
  EstadoAnterior: EstadoCita;
  EstadoNuevo: EstadoCita;
  Motivo?: string | null;
  Fecha: string;
  citaId: number;
}
export interface Cita {
  Id: number;

  Fecha: string;
  Hora: string;
  HoraFin: string;
  TiempoTotal: number;

  Monto: number;

  MotivoCancelacion?: string;
  MotivoRechazo?: string;

  Modalidad: 'PRESENCIAL' | 'VIRTUAL' | 'HIBRIDA';
  Descripcion?: string;
  Comentarios?: string;
  Estado: EstadoCita;

  CreatedAt: string;
  UpdatedAt: string;

  idcliente: number;
  idprofesional: number;
  idservicio: number;

  cliente?: {
    Id: number;
    NombreCompleto: string;
  };

  profesional?: {
    Id: number;
    NombreCompleto: string;
  };

  servicio?: {
    Id: number;
    Nombre: string;
    Precio?: number;
  };

  historialEstadoCitas?: HistorialEstadoCita[];
}