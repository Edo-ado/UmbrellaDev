export enum EstadoCita {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADA = 'CONFIRMADA',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
}

export interface Cita {
  id: number;
  fecha: string;       
  hora: string;
  estado: EstadoCita;
  clienteId: number;
  profesionalId: number;
  servicioId: number;
  cliente?: {
    id: number;
    nombre: string;
    apellido?: string;
  };
  profesional?: {
    id: number;
    nombre: string;
    apellido?: string;
  };
  servicio?: {
    id: number;
    nombre: string;
  };
}