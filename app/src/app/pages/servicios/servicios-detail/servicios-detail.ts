import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-servicio-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios-detail.html',
  styleUrls: ['./servicios-detail.css']
})
export class ServiciosDetail implements OnInit {
  apiUrl = 'http://localhost:3000/servicios';

  servicio = signal<any>(null);
  loading = signal<boolean>(false);
  error = signal<string>('');

  private servicioId!: number;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.servicioId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarServicio();
  }

 cargarServicio(): void {
  this.loading.set(true);
  this.error.set('');

  this.http.get<any>(`${this.apiUrl}/id/${this.servicioId}`).subscribe({
    next: (data) => {
      this.servicio.set(data);
      this.loading.set(false);
    },
    error: () => {
      this.error.set('No se pudo cargar la información del servicio.');
      this.loading.set(false);
    }
  });
}
  volver(): void {
    this.router.navigate(['/servicios']);
  }


}