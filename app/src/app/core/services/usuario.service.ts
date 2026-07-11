import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profesional, ProfesionalCreateDto, ProfesionalUpdateDto } from '../models/profesional.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/usuarios';

  listar(): Observable<Profesional[]> {
    return this.http.get<Profesional[]>(`${this.apiUrl}/lista`);
  }

  obtenerPorId(id: number): Observable<Profesional> {
    return this.http.get<Profesional>(`${this.apiUrl}/Id/${id}`);
  }

  crear(data: ProfesionalCreateDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, data);
  }

  obtenerDesarrolladores(): Observable<Profesional[]> {
    return this.http.get<Profesional[]>(`${this.apiUrl}/rol/DESARROLLADOR`);
  }

  buscarPorNombre(nombre: string): Observable<Profesional[]> {
    return this.http.get<Profesional[]>(`${this.apiUrl}/buscar`, {
      params: { nombre }
    });
  }

  actualizar(id: number, data: ProfesionalUpdateDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, data);
  }

  toggleEstado(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/CambioEstado/${id}`, {});
  }

  toggleDisponibilidad(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/CambioDisponibilidad/${id}`, {});
  }
}