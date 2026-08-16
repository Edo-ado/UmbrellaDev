import {
  Component,
  OnInit,
  signal,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  NgApexchartsModule
} from 'ng-apexcharts';

import {
  forkJoin
} from 'rxjs';

import {
  EstadisticasService
} from '../../../core/services/estadistica.service';


interface Profesional {
  id: number;
  nombre: string;
}


interface Categoria {
  id: number;
  nombre: string;
}


@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [
    NgApexchartsModule,
    ReactiveFormsModule
  ],
  templateUrl: './graficos.html',
  styleUrls: ['./graficos.css']
})
export class Graficos implements OnInit {
  private estadisticasService =
    inject(EstadisticasService);

  private formBuilder =
    inject(FormBuilder);


  cargando = signal(false);

  error = signal('');


  profesionales =
    signal<Profesional[]>([]);

  categorias =
    signal<Categoria[]>([]);


  citasEstadoData =
    signal<{ estado: string; total: number }[]>([]);

  usuariosRolData =
    signal<{ rol: string; total: number }[]>([]);


  filtrosForm =
    this.formBuilder.group({
      fechaInicio: [
        '',
        Validators.required
      ],

      fechaFin: [
        '',
        Validators.required
      ],

      profesionalId: [
        null as number | null
      ],

      categoriaId: [
        null as number | null
      ]
    });


  citasEstadoChart: any = {
    series: [],

    chart: {
      type: 'donut',
      height: 350
    },

    labels: [],

    colors: [
      '#ff4b4b',
      '#b00017',
      '#ff8a8a',
      '#7a0010',
      '#ffd0d0'
    ],

    legend: {
      position: 'bottom'
    },

    dataLabels: {
      enabled: true
    }
  };


  usuariosRolChart: any = {
    series: [
      {
        name: 'Usuarios',
        data: []
      }
    ],

    chart: {
      type: 'bar',
      height: 350
    },

    xaxis: {
      categories: []
    },

    colors: [
      '#c3001a'
    ],

    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '45%'
      }
    },

    dataLabels: {
      enabled: false
    }
  };


  ngOnInit(): void {
    this.cargarCatalogos();
  }


  cargarCatalogos(): void {
    forkJoin({
      profesionales:
        this.estadisticasService
          .getProfesionales(),

      categorias:
        this.estadisticasService
          .getCategorias()
    }).subscribe({
      next: ({
        profesionales,
        categorias
      }) => {
        const profesionalesNormalizados = profesionales.map(
          (profesional) => ({
            id: profesional.Id,
            nombre: profesional.NombreCompleto
          })
        );

        this.profesionales.set(
          profesionalesNormalizados
        );

        const categoriasNormalizadas = categorias.map(
          (categoria) => ({
            id: categoria.Id,
            nombre: categoria.Nombre
          })
        );

        this.categorias.set(
          categoriasNormalizadas
        );

        this.cargarGraficas();
      },

      error: (err) => {
        console.error(
          'Error al cargar filtros:',
          err
        );

        this.error.set(
          'No se pudieron cargar los filtros.'
        );
      }
    });
  }


  cargarGraficas(): void {
    this.error.set('');


    const {
      fechaInicio,
      fechaFin,
      profesionalId,
      categoriaId
    } = this.filtrosForm.getRawValue();


    if (!fechaInicio || !fechaFin) {
      this.filtrosForm.markAllAsTouched();

      this.error.set(
        'Debes seleccionar la fecha inicial y la fecha final.'
      );

      return;
    }


    if (fechaInicio > fechaFin) {
      this.error.set(
        'La fecha inicial no puede ser posterior a la fecha final.'
      );

      return;
    }


    this.cargando.set(true);


    console.log(
      'Filtros enviados:',
      {
        fechaInicio,
        fechaFin,
        profesionalId,
        categoriaId
      }
    );


    forkJoin({
      citasEstado:
        this.estadisticasService
          .getCitasPorEstado(
            fechaInicio,
            fechaFin,
            profesionalId,
            categoriaId
          ),

      usuariosRol:
        this.estadisticasService
          .getUsuariosPorRol()
    }).subscribe({
      next: ({
        citasEstado,
        usuariosRol
      }) => {
        console.log(
          'Citas recibidas:',
          citasEstado
        );

        console.log(
          'Usuarios recibidos:',
          usuariosRol
        );


        this.citasEstadoData.set([
          ...citasEstado
        ]);

        this.usuariosRolData.set([
          ...usuariosRol
        ]);


        const seriesCitas =
          citasEstado.map(
            item => item.total
          );

        const labelsCitas =
          citasEstado.map(
            item => item.estado
          );


        this.citasEstadoChart = {
          ...this.citasEstadoChart,

          series: [
            ...seriesCitas
          ],

          labels: [
            ...labelsCitas
          ]
        };


        const seriesUsuarios =
          usuariosRol.map(
            item => item.total
          );

        const categoriasUsuarios =
          usuariosRol.map(
            item => item.rol
          );


        this.usuariosRolChart = {
          ...this.usuariosRolChart,

          series: [
            {
              name: 'Usuarios',

              data: [
                ...seriesUsuarios
              ]
            }
          ],

          xaxis: {
            ...this.usuariosRolChart.xaxis,

            categories: [
              ...categoriasUsuarios
            ]
          }
        };


        this.cargando.set(false);
      },

      error: (err) => {
        console.error(
          'Error al cargar estadísticas:',
          err
        );

        this.error.set(
          'No se pudieron cargar las estadísticas.'
        );

        this.cargando.set(false);
      }
    });
  }
}