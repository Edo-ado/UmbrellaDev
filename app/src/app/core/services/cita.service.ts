import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita, EstadoCita } from '../models/cita.model';

@Injectable({
  providedIn: 'root',
})
export class CitaService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/citas';

  getAll(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.baseUrl);
  }

  getById(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.baseUrl}/id/${id}`);
  }

  getByProfesional(id: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.baseUrl}/Profesional/${id}`);
  }

  getByStatus(estado: EstadoCita): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.baseUrl}/estado/${estado}`);
  }

  getByFechas(fechaInicial: string, fechaFinal: string): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.baseUrl}/fechas`, {
      params: { fechaInicial, fechaFinal },
    });
  }

  create(data: Partial<Cita>): Observable<Cita> {
    return this.http.post<Cita>(`${this.baseUrl}/crear`, data);
  }

  toggleStatus(id: number): Observable<Cita> {
    return this.http.patch<Cita>(`${this.baseUrl}/CambioEstado/${id}`, {});
  }
}