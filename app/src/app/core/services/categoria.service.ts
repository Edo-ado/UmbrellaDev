import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/categorias';

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}`);
  }

  obtenerPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/id/${id}`);
  }

  buscarPorNombre(nombre: string): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/buscar`, {
      params: { nombre }
    });
  }

  getAllActivos(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/activos`);
  }

  obtenerPorEstado(estado: 'ACTIVO' | 'INACTIVO'): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/estado/${estado}`);
  }

  toggleEstado(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/CambioEstado/${id}`, {});
  }
}