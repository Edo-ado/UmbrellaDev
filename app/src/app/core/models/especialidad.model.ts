export interface Especialidad {
  Id: number;
  Nombre: string;
  Descripcion: string;
  Estado: 'ACTIVO' | 'INACTIVO';
  CategoriaAsociada?: {
    Id: number;
    Nombre: string;
  };
}