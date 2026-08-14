export interface Profesional {
  Id: number;
  NombreCompleto: string;
  Email: string;
  Telefono?: string;
  Pais: string;
  Ubicacion?: string;
  Contrasena: string;
  TituloProfesional: string;
  Descripcion?: string;
  Modalidad: 'PRESENCIAL' | 'VIRTUAL' | 'HIBRIDA';
  TarifaBase: number;
  AnosExperiencia?: number;
  Universidad?: string;
  Disponibilidad: boolean;
  Estado: 'ACTIVO' | 'INACTIVO';
  Role: 'DESARROLLADOR' | 'ADMIN' | string; 
  especialidades?: Especialidad[];
}

export interface Especialidad {
  Id: number;
  Nombre: string;
}


export interface LoginRequest {
    Email: string;
    Contrasena: string;
}
export interface LoginResult {
    token: string;
}

export interface RegisterRequest {
    NombreCompleto: string;
    Email: string;
    Contrasena: string;
}

export enum Role {
    ADMIN = 'ADMIN',
    USUARIO = 'USUARIO',
    DESARROLLADOR = 'DESARROLLADOR',
}