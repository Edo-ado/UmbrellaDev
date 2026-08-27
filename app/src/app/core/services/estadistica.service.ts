import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import { Observable, map } from 'rxjs';

export interface Profesional {
  Id: number;
  NombreCompleto: string;
}

export interface ReporteProfesional {
  nombreProfesional: string;
  totalCitas: number;
  citasCompletadas: number;
  porcentajeFinalizacion: number;
}

export interface ReporteCalificaciones {
  nombreProfesional: string;
  promedioCalificacion: number;
  cantidadResenas: number;
  mejorServicioCalificado: string | null;
  serviciosBajaCalificacion: string[];
}

export interface Categoria {
  Id: number;
  Nombre: string;
}

export interface CitasPorEstado {
  estado: string;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}


  getCitasPorEstado(
    fechaInicio: string,
    fechaFin: string,
    profesionalId?: number | null,
    categoriaId?: number | null
  ): Observable<CitasPorEstado[]> {
    let params =
      new HttpParams()
        .set(
          'fechaInicio',
          fechaInicio
        )
        .set(
          'fechaFin',
          fechaFin
        );


    if (
      profesionalId !== null &&
      profesionalId !== undefined
    ) {
      params = params.set(
        'profesionalId',
        profesionalId.toString()
      );
    }


    if (
      categoriaId !== null &&
      categoriaId !== undefined
    ) {
      params = params.set(
        'categoriaId',
        categoriaId.toString()
      );
    }


    return this.http.get<CitasPorEstado[]>(
      `${this.baseUrl}/estadisticas/citas-por-estado`,
      {
        params
      }
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

getProfesionales(): Observable<Profesional[]> {
  return this.http.get<Profesional[]>(`${this.baseUrl}/usuarios/rol/DESARROLLADOR`);
}


getCategorias(): Observable<Categoria[]> {
  return this.http.get<Categoria[]>(
    `${this.baseUrl}/categorias`
  );
}

getReportePorProfesional(): Observable<ReporteProfesional[]> {
  return this.http.get<ReporteProfesional[]>(
    `${this.baseUrl}/estadisticas/reporte-profesional`
  );
}


getReporteCalificaciones(): Observable<ReporteCalificaciones[]> {
  return this.http.get<ReporteCalificaciones[]>(
    `${this.baseUrl}/estadisticas/reporte-calificaciones`
  );
}


}