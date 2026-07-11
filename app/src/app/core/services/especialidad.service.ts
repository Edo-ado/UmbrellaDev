import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Especialidad } from '../models/especialidad.model';

@Injectable({ providedIn: 'root' })
export class EspecialidadService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/especialidades';

  listar(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(`${this.apiUrl}`);
  }

  obtenerPorId(id: number): Observable<Especialidad> {
    return this.http.get<Especialidad>(`${this.apiUrl}/id/${id}`);
  }

  buscarPorNombre(nombre: string): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(`${this.apiUrl}/buscar`, {
      params: { nombre }
    });
  }

  obtenerPorEstado(estado: 'ACTIVO' | 'INACTIVO'): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(`${this.apiUrl}/estado/${estado}`);
  }

  toggleEstado(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/CambioEstado/${id}`, {});
  }
}