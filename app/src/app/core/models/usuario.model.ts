export interface Profesional {
  Id: number;
  NombreCompleto: string;
  Email: string;
  Telefono?: string;
  Pais: string;
  Ubicacion?: string;
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