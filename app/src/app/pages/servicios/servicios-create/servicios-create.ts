import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ServicioForm } from '../../../shared/components/servicio-form/servicio-form';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ServicioService } from '../../../core/services/servicio.service';

@Component({
  selector: 'app-servicios-create',
  standalone: true,
  imports: [CommonModule, ServicioForm],
  templateUrl: './servicios-create.html',
  styleUrls: ['./servicios-create.css']
})
export class ServiciosCreate implements OnInit {
  saving: boolean = false;
  error: string = '';

  profesionales: any[] = [];
  categorias: any[] = [];
  especialidades: any[] = [];

  private apiCategorias = 'http://localhost:3000/categorias';
  private apiEspecialidades = 'http://localhost:3000/especialidades';

  constructor(
    private http: HttpClient,
    private router: Router,
    private usuarioService: UsuarioService,
    private servicioService: ServicioService
  ) {}

  ngOnInit(): void {
    this.cargarProfesionales();
    this.cargarCategorias();
    this.cargarEspecialidades();
  }

  cargarProfesionales(): void {
    this.usuarioService.obtenerDesarrolladores().subscribe({
      next: (data) => {
        this.profesionales = data;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar los profesionales.';
      }
    });
  }

  cargarCategorias(): void {
    this.http.get<any[]>(this.apiCategorias).subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: () => {
        this.error = 'No se pudieron cargar las categorías.';
      }
    });
  }

  cargarEspecialidades(): void {
    this.http.get<any[]>(this.apiEspecialidades).subscribe({
      next: (data) => {
        this.especialidades = data;
      },
      error: () => {
        this.error = 'No se pudieron cargar las especialidades.';
      }
    });
  }

  guardar(data: any): void {
    this.saving = true;
    this.error = '';

    this.servicioService.crear(data).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/servicios']);
      },
      error: () => {
        this.saving = false;
        this.error = 'No se pudo registrar el servicio.';
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/servicios']);
  }
}