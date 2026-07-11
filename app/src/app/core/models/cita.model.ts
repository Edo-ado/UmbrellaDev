export enum EstadoCita {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADA = 'CONFIRMADA',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
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