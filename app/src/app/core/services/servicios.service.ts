import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Servicio {
  Id: number;
  Nombre: string;
  Descripcion: string | null;
  Precio: number;
  Duracion: number | null;
  Estado: string;
  Modalidad: string;
  idprofesional: number;
  idcategoria: number;
}

@Injectable({ providedIn: 'root' })
export class ServicioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/servicios';

  getAll(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}`);
  }

  getByProfesional(id: number): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/profesional/${id}`);
  }
}