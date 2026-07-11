export enum Estado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  BANEADO = 'BANEADO'
}

export enum MODALIDAD {
  PRESENCIAL = 'PRESENCIAL',
  VIRTUAL = 'VIRTUAL',
  HIBRIDA = 'HIBRIDA',
  NOCAP = 'NOCAP'
}

export interface CategoriaServicio {
  Id: number;
  Nombre: string;
  Descripcion?: string;
  Estado?: Estado;
}

export interface EspecialidadServicio {
  Id: number;
  Nombre: string;
  Descripcion?: string;
  Estado?: Estado;
}

export interface ProfesionalServicio {
  Id: number;
  NombreCompleto: string;
  Email: string;
  Pais?: string;
  Telefono?: string;
  Role?: string;
  Estado?: Estado;
  Modalidad?: MODALIDAD;
}

export interface Servicio {
  Id: number;
  Nombre: string;
  Descripcion?: string;
  Precio: number;
  Duracion?: number;
  Estado: Estado;
  Modalidad: MODALIDAD;
  CreatedAt?: string;
  UpdatedAt?: string;

  idprofesional: number;
  idcategoria: number;

  profesional?: ProfesionalServicio;
  categoria?: CategoriaServicio;
  servicioEspecialidades?: EspecialidadServicio[];
}

export interface CreateServicioDto {
  Nombre: string;
  Descripcion?: string;
  Precio: number;
  Duracion?: number;
  Estado?: Estado;
  Modalidad: MODALIDAD;
  idprofesional: number;
  idcategoria: number;
}

export interface UpdateServicioDto {
  Nombre?: string;
  Descripcion?: string;
  Precio?: number;
  Duracion?: number;
  Estado?: Estado;
  Modalidad?: MODALIDAD;
  idprofesional?: number;
  idcategoria?: number;
}