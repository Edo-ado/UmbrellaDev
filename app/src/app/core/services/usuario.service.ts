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

  obtenerPorRol(rol: string): Observable<Profesional[]> {
    return this.http.get<Profesional[]>(`${this.apiUrl}/rol/${rol}`);
  }

  actualizar(id: number, data: ProfesionalUpdateDto, foto?: File): Observable<any> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value));
      }
    });

    if (foto) {
      formData.append('image', foto);
    }

    return this.http.put(`${this.apiUrl}/update/${id}`, formData);
  }

  toggleEstado(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/CambioEstado/${id}`, {});
  }

  toggleDisponibilidad(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/CambioDisponibilidad/${id}`, {});
  }
}