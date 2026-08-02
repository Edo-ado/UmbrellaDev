import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class EstadisticaService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Trae las citas del rango de fechas y las agrupa por estado
  getCitasPorEstado(fechaInicial: string, fechaFinal: string): Observable<{ estado: string; total: number }[]> {
    const params = new HttpParams()
      .set('fechaInicial', fechaInicial)
      .set('fechaFinal', fechaFinal);

    return this.http.get<any[]>(`${this.baseUrl}/citas/fechas`, { params }).pipe(
      map(citas => {
        const conteo: Record<string, number> = {};
        citas.forEach(c => { conteo[c.Estado] = (conteo[c.Estado] || 0) + 1; });
        return Object.entries(conteo).map(([estado, total]) => ({ estado, total }));
      })
    );
  }

  // Trae todos los usuarios y filtra por fecha en el frontend
  // (mientras no exista un endpoint /usuarios/fechas en el backend)
  getUsuariosPorRol(fechaInicial: string, fechaFinal: string): Observable<{ rol: string; total: number }[]> {
    return this.http.get<any[]>(`${this.baseUrl}/usuarios`).pipe(
      map(usuarios => {
        const min = new Date(fechaInicial);
        const max = new Date(fechaFinal);

        const filtrados = usuarios.filter(u => {
          const fecha = new Date(u.CreatedAt);
          return fecha >= min && fecha <= max;
        });

        const conteo: Record<string, number> = {};
        filtrados.forEach(u => { conteo[u.Role] = (conteo[u.Role] || 0) + 1; });

        return Object.entries(conteo).map(([rol, total]) => ({
          rol: this.etiquetaRol(rol),
          total
        }));
      })
    );
  }

  // Trae todas las citas y las agrupa por categoría del servicio
  getCategorias(): Observable<{ categoria: string; total: number }[]> {
    return this.http.get<any[]>(`${this.baseUrl}/citas`).pipe(
      map(citas => {
        const conteo: Record<string, number> = {};
        citas.forEach(c => {
          const nombreCategoria = c.servicio?.categoria?.Nombre ?? 'Sin categoría';
          conteo[nombreCategoria] = (conteo[nombreCategoria] || 0) + 1;
        });
        return Object.entries(conteo)
          .map(([categoria, total]) => ({ categoria, total }))
          .sort((a, b) => b.total - a.total);
      })
    );
  }

  private etiquetaRol(rol: string): string {
    const mapa: Record<string, string> = {
      ADMIN: 'Administradores',
      USUARIO: 'Clientes',
      DESARROLLADOR: 'Profesionales'
    };
    return mapa[rol] ?? rol;
  }
}