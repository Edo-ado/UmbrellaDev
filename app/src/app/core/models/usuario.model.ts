export interface LoginResult {
    token: string;
    Id: number;
    Email: string;
    Role: string;
}

export interface Profesional {
  Id: number;
  NombreCompleto: string;
  Email: string;
  Telefono?: string;
  Pais: string;
  Edad?: number;
  Ubicacion?: string;
  TituloProfesional?: string;
  Descripcion?: string;
  Modalidad?: 'PRESENCIAL' | 'VIRTUAL' | 'HIBRIDA';
  TarifaBase?: number;
  AnosExperiencia?: number;
  Universidad?: string;
  Disponibilidad?: boolean;
  Estado: 'ACTIVO' | 'INACTIVO';
  Role: Role;
  Foto?: string | null;
  especialidades?: Especialidad[];
  calificacion?: {
    promedio: number;
    totalResenas: number;
  };
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
    Pais: string;
    Edad?: number;
    Telefono?: string;
}

export enum Role {
    ADMIN = 'ADMIN',
    USUARIO = 'USUARIO',
    DESARROLLADOR = 'DESARROLLADOR',
}
