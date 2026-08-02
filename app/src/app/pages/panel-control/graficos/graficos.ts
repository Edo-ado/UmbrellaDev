import { Component, OnInit, signal, inject } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { forkJoin } from 'rxjs';
import { EstadisticasService } from '../../../core/services/estadistica.service';

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './graficos.html',
  styleUrls: ['./graficos.css']
})
export class Graficos implements OnInit {
  private estadisticasService = inject(EstadisticasService);

  cargando = signal(false);
  error = signal('');

  citasEstadoData = signal<{ estado: string; total: number }[]>([]);
  usuariosRolData = signal<{ rol: string; total: number }[]>([]);

  citasEstadoChart: any = {
    series: [],
    chart: { type: 'donut', height: 350 },
    labels: [],
    colors: ['#ff4b4b', '#b00017', '#ff8a8a', '#7a0010', '#ffd0d0'],
    legend: { position: 'bottom' },
    dataLabels: { enabled: true }
  };

  usuariosRolChart: any = {
    series: [{ name: 'Usuarios', data: [] }],
    chart: { type: 'bar', height: 350 },
    xaxis: { categories: [] },
    colors: ['#c3001a'],
    plotOptions: { bar: { borderRadius: 8, columnWidth: '45%' } },
    dataLabels: { enabled: false }
  };

  ngOnInit(): void {
    this.cargarGraficas();
  }

  cargarGraficas(): void {
    this.cargando.set(true);
    this.error.set('');

    forkJoin({
      citasEstado: this.estadisticasService.getCitasPorEstado(),
      usuariosRol: this.estadisticasService.getUsuariosPorRol()
    }).subscribe({
      next: ({ citasEstado, usuariosRol }) => {
        this.citasEstadoData.set(citasEstado);
        this.usuariosRolData.set(usuariosRol);

        this.citasEstadoChart.series = citasEstado.map(item => item.total);
        this.citasEstadoChart.labels = citasEstado.map(item => item.estado);

        this.usuariosRolChart.series = [{ name: 'Usuarios', data: usuariosRol.map(item => item.total) }];
        this.usuariosRolChart.xaxis = { categories: usuariosRol.map(item => item.rol) };

        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las estadísticas.');
        this.cargando.set(false);
      }
    });
  }
}