import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

 
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

 
 getUsuariosPorRol(fechaInicial: string, fechaFinal: string): Observable<{ rol: string; total: number }[]> {
  const params = new HttpParams()
    .set('fechaInicial', fechaInicial)
    .set('fechaFinal', fechaFinal);

  return this.http.get<any[]>(`${this.baseUrl}/usuarios/fechas`, { params }).pipe(
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

  getCategorias(): Observable<{ categoria: string; total: number }[]> {
    return this.http.get<any[]>(`${this.baseUrl}/citas/categorias`).pipe(
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