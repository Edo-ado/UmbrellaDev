import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Trae todas las citas y las agrupa por estado
  getCitasPorEstado(): Observable<{ estado: string; total: number }[]> {
    return this.http.get<any[]>(`${this.baseUrl}/citas`).pipe(
      map(citas => {
        const conteo: Record<string, number> = {};
        citas.forEach(c => { conteo[c.Estado] = (conteo[c.Estado] || 0) + 1; });
        return Object.entries(conteo).map(([estado, total]) => ({ estado, total }));
      })
    );
  }

  // rae todos los usuarios y los agrupa por rol
  getUsuariosPorRol(): Observable<{ rol: string; total: number }[]> {
    return this.http.get<any[]>(`${this.baseUrl}/usuarios/lista`).pipe(
      map(usuarios => {
        const conteo: Record<string, number> = {};
        usuarios.forEach(u => { conteo[u.Role] = (conteo[u.Role] || 0) + 1; });
        return Object.entries(conteo).map(([rol, total]) => ({
          rol: this.etiquetaRol(rol),
          total
        }));
      })
    );
  }

  // Trae todos los usuarios y los agrupa por estado
  private etiquetaRol(rol: string): string {
    const mapa: Record<string, string> = {
      ADMIN: 'Administradores',
      USUARIO: 'Clientes',
      DESARROLLADOR: 'Profesionales'
    };
    return mapa[rol] ?? rol;
  }
}