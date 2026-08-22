import {
  Component,
  OnInit,
  signal,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule
} from '@angular/forms';

import { Profesional } from '../../../core/models/usuario.model';
// ajustá el import al service real que lista profesionales


@Component({
  selector: 'app-profesionales-catalogo',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './profesionales-catalogo.html',
  styleUrls: ['./profesionales-catalogo.css']
})
export class ProfesionalesCatalogo implements OnInit {
  private formBuilder = inject(FormBuilder);

  cargando = signal(false);
  error = signal('');

  profesionales = signal<Profesional[]>([]);

  filtrosForm = this.formBuilder.group({
    categoriaId: [null as number | null],
    especialidadId: [null as number | null],
    modalidad: [''],
    // más filtros combinables acá según lo que necesites
  });

  ngOnInit(): void {
    this.cargarProfesionales();
  }

  cargarProfesionales(): void {
    // acá va la llamada al service, filtrando por Disponibilidad: true
    // y opcionalmente por los criterios del filtrosForm
  }
}