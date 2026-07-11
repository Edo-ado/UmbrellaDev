import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-servicio-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicio-form.html',
  styleUrls: ['./servicio-form.css']
})
export class ServicioForm {
  @Input() saving: boolean = false; 
  @Input() profesionales: any[] = [];
  @Input() categorias: any[] = [];
  @Input() especialidades: any[] = [];

  @Output() guardar = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<void>();

  formError: string = '';

  form = {
    idprofesional: null as number | null,
    idcategoria: null as number | null,
    Nombre: '',
    Descripcion: '',
    Precio: null as number | null,
    Duracion: null as number | null,
    Modalidad: 'PRESENCIAL',
    Estado: 'ACTIVO',
    especialidadesIds: [] as number[]
  };

  toggleEspecialidad(id: number, checked: boolean): void {
    if (checked) {
      if (!this.form.especialidadesIds.includes(id)) {
        this.form.especialidadesIds.push(id);
      }
    } else {
      this.form.especialidadesIds = this.form.especialidadesIds.filter(
        especialidadId => especialidadId !== id
      );
    }
  }

  enviarFormulario(formulario: NgForm): void {
    this.formError = '';

    if (!this.form.Nombre.trim()) {
      this.formError = 'El nombre es obligatorio.';
      return;
    }

    if (this.form.Precio === null || this.form.Precio <= 0) {
      this.formError = 'El precio debe ser mayor a cero.';
      return;
    }

    if (this.form.Duracion === null || this.form.Duracion <= 0) {
      this.formError = 'La duración debe ser mayor a cero.';
      return;
    }

    if (formulario.invalid) {
      this.formError = 'Completa los campos obligatorios.';
      return;
    }

    this.guardar.emit({
      idprofesional: this.form.idprofesional,
      idcategoria: this.form.idcategoria,
      Nombre: this.form.Nombre.trim(),
      Descripcion: this.form.Descripcion?.trim() || '',
      Precio: Number(this.form.Precio),
      Duracion: Number(this.form.Duracion),
      Modalidad: this.form.Modalidad,
      Estado: this.form.Estado,
      especialidadesIds: this.form.especialidadesIds
    });
  }
}