export interface Servicio {
  Id: number;
  Nombre: string;
  Descripcion: string;
  Precio: number;
  Duracion: number;
  Estado: 'ACTIVO' | 'INACTIVO';
  Modalidad: 'REMOTO' | 'PRESENCIAL' | 'HIBRIDO';
  idprofesional: number;
  idcategoria: number;
  profesional?: any;
  categoria?: any;
  servicioEspecialidades?: any[];
}
export interface ServicioCreateDto {
  idprofesional: number;
  idcategoria: number;
  Nombre: string;
  Descripcion: string;
  Precio: number;
  Duracion: number;
  Modalidad: string;
  Estado: string;
  especialidadIds: number[];  
}

export interface ServicioUpdateDto {
  idprofesional: number;
  idcategoria: number;
  Nombre: string;
  Descripcion: string;
  Precio: number;
  Duracion: number;
  Modalidad: string;
  Estado: string;
  especialidadIds: number[];
}

export interface ServicioFormModel {
  idprofesional: string;
  idcategoria: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number;
  modalidad: string;
  estado: string;
  especialidadIds: number[];
}
