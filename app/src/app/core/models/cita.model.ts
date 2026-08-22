export enum EstadoCita {
  PENDIENTE = 'PENDIENTE',
  ACEPTADA = 'ACEPTADA',
  RECHAZADA = 'RECHAZADA',
  CANCELADA = 'CANCELADA',
  COMPLETA = 'COMPLETA',
}

export interface Cita {
  Id: number;
  Fecha: string;
  Hora: string;
  Modalidad: string;
  Descripcion: string;
  Comentarios?: string;
  Estado: EstadoCita;
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
  };
}