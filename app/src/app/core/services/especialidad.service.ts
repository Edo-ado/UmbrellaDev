import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Especialidad } from '../models/profesional.model';

@Injectable({ providedIn: 'root' })
export class EspecialidadService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/especialidades';

  listar(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(`${this.apiUrl}`);
  }
}