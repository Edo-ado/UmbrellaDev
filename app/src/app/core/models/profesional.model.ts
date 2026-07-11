export interface Especialidad {
  Id: number;
  Nombre: string;
}

export interface Profesional {
  Id: number;
  NombreCompleto: string;
  Email: string;
  Pais: string;
  Telefono?: string | null;
  Foto?: string;
  Modalidad: string;
  Descripcion?: string | null;
  AnosExperiencia?: number | null;
  Ubicacion?: string | null;
  TituloProfesional?: string | null;
  TarifaBase?: number | null;
  Disponibilidad?: boolean | null;
  Universidad?: string | null;
  especialidades?: Especialidad[];
}

export interface ProfesionalFormModel {
  nombreCompleto: string;
  email: string;
  contrasena: string;
  pais: string;
  telefono: string;
  modalidad: string;
  Foto?: string;
  descripcion: string;
  anosExperiencia: number;
  ubicacion: string;
  tituloProfesional: string;
  tarifaBase: number;
  disponibilidad: boolean;
  universidad: string;
  especialidadIds: number[];
}

export interface ProfesionalCreateDto {
  NombreCompleto: string;
  Email: string;
  Contraseña: string;
  Pais: string;
  Telefono?: string;
  Modalidad: string;
  Descripcion?: string;
  AnosExperiencia?: number;
  Foto?: string;
  Ubicacion?: string;
  TituloProfesional: string;
  TarifaBase: number;
  Disponibilidad: boolean;
  Universidad?: string;
  Role: 'DESARROLLADOR';
  especialidadIds: number[];
}

export interface ProfesionalUpdateDto {
  NombreCompleto: string;
  Email: string;
  Pais: string;
  Telefono?: string;
  Modalidad: string;
  Descripcion?: string;
  AnosExperiencia?: number;
  Foto?: string;
  Ubicacion?: string;
  TituloProfesional: string;
  TarifaBase: number;
  Disponibilidad: boolean;
  Universidad?: string;
  especialidadIds: number[];
}