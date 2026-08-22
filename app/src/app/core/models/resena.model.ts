
export interface ResenaListItem {
  Id: number;
  Puntuacion: number;
  Comentario: string | null;
  CreatedAt: string;
  clienteId: number;
  cita: any; // reemplaza "any" por tu interfaz Cita si ya la tienes
}


export interface ResenaResumen {
  Id: number;
  Puntuacion: number;
  Comentario: string | null;
  cliente: { Id: number; NombreCompleto: string };
  profesional: { Id: number; NombreCompleto: string };
}


export interface ResenaDetalle {
  Id: number;
  Puntuacion: number;
  Comentario: string | null;
  CreatedAt: string;
  cliente: { Id: number; NombreCompleto: string; Foto: string | null };
  profesional: { Id: number; NombreCompleto: string; Foto: string | null };
  cita: any;
  imagenes: any[];
}


export interface PromedioCalificacion {
  idProfesional: number;
  promedio: number;
  totalResenas: number;
}


export interface CrearResenaPayload {
  idcita: number;
  Comentario: string;
  Puntuacion: number;
}


export interface ResenaDeCita {
  Id: number;
  Puntuacion: number;
  Comentario: string | null;
  CreatedAt: string;
  cliente: { Id: number; NombreCompleto: string; Foto: string | null };
}