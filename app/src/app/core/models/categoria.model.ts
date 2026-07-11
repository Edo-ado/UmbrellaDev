export interface Categoria {
  Id: number;
  Nombre: string;
  Descripcion: string;
  Estado: 'ACTIVO' | 'INACTIVO';
  especialidad?: Especialidad[];
}

export interface Especialidad {
  Id: number;
  Nombre: string;
}