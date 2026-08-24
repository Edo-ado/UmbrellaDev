import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio, ServicioCreateDto, ServicioUpdateDto } from '../models/servicio.model';

@Injectable({ providedIn: 'root' })
export class ServicioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/servicios';

  listar(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}`);
  }

  obtenerPorId(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.apiUrl}/id/${id}`);
  }

  obtenerPorProfesional(id: number): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/profesional/${id}`);
  }

  obtenerPorCategoria(id: number): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/categoria/${id}`);
  }

  buscarPorNombre(nombre: string): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/buscar`, {
      params: { nombre }
    });
  }

  obtenerPorModalidad(modalidad: string): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/modalidad/${modalidad}`);
  }

  obtenerPorRangoPrecio(precioMin: number, precioMax: number): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/rango-precio`, {
      params: { precioMin, precioMax }
    });
  }

  crear(data: ServicioCreateDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, data);
  }

  actualizar(id: number, data: ServicioUpdateDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, data);
  }

  toggleEstado(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/CambioEstado/${id}`, {});
  }

obtenerPorProfesionalActivo(id: number): Observable<Servicio[]> {
  return this.http.get<Servicio[]>(
    `${this.apiUrl}/profesional-activo/${id}`,
  );
}


obtenerServiciosFiltrados(
  profesionalId: number,
  categoriaId?: number,
  modalidad?: string,
  precioMin?: number | null,
  precioMax?: number | null,
  nombre?: string,
): Observable<Servicio[]> {
  let params = new HttpParams()
    .set('profesionalId', profesionalId.toString())
    .set('soloActivos', 'true')
    .set('soloProfesionalActivoYDisponible', 'true');

  if (categoriaId) {
    params = params.set('categoriaId', categoriaId.toString());
  }

  if (modalidad) {
    params = params.set('modalidad', modalidad);
  }

  if (precioMin !== undefined && precioMin !== null) {
    params = params.set('precioMin', precioMin.toString());
  }

  if (precioMax !== undefined && precioMax !== null) {
    params = params.set('precioMax', precioMax.toString());
  }

  if (nombre?.trim()) {
    params = params.set('nombre', nombre.trim());
  }

  return this.http.get<Servicio[]>(
    `${this.apiUrl}/filtrados`,
    { params },
  );
}



}