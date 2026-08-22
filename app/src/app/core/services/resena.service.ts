import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  ResenaListItem,
  ResenaResumen,
  ResenaDetalle,
  PromedioCalificacion,
  CrearResenaPayload,
  ResenaDeCita,
} from "../models/resena.model";

@Injectable({ providedIn: "root" })
export class ResenaService {
  private apiUrl = "http://localhost:3000/resenas";

  constructor(private http: HttpClient) {}

  getAllByProfesional(profesionalId: number): Observable<ResenaListItem[]> {
    return this.http.get<ResenaListItem[]>(
      `${this.apiUrl}/profesional/${profesionalId}`,
    );
  }

  getById(id: number): Observable<ResenaResumen> {
    return this.http.get<ResenaResumen>(`${this.apiUrl}/id/${id}`);
  }

  getDetailById(id: number): Observable<ResenaDetalle> {
    return this.http.get<ResenaDetalle>(`${this.apiUrl}/detalle/${id}`);
  }

  getPromedio(idProfesional: number): Observable<PromedioCalificacion> {
    return this.http.get<PromedioCalificacion>(
      `${this.apiUrl}/promedio/${idProfesional}`,
    );
  }

  dejarResena(payload: CrearResenaPayload): Observable<ResenaDetalle> {
    return this.http.post<ResenaDetalle>(
      `${this.apiUrl}/dejarResena`,
      payload,
    );
  }


existePorCita(citaId: number): Observable<{ existe: boolean }> {
  return this.http.get<{ existe: boolean }>(`${this.apiUrl}/existe/${citaId}`);
}


// resena.service.ts
obtenerPorCita(citaId: number): Observable<ResenaDeCita | null> {
  return this.http.get<ResenaDeCita | null>(`${this.apiUrl}/porCita/${citaId}`);
}

}