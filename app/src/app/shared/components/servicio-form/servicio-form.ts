import { Component, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormField,
  form,
  required,
  minLength,
  maxLength,
  min,
} from '@angular/forms/signals';
import {
  Servicio,
  ServicioFormModel,
  ServicioCreateDto,
  ServicioUpdateDto,
} from '../../../core/models/servicio.model';
import { Profesional } from '../../../core/models/profesional.model';
import { Categoria } from '../../../core/models/categoria.model';
import { Especialidad } from '../../../core/models/especialidad.model';

@Component({
  selector: 'app-servicio-form',
  standalone: true,
  imports: [CommonModule, FormField],
  templateUrl: './servicio-form.html',
  styleUrls: ['./servicio-form.css'],
})
export class ServicioForm {
  servicio = input<Servicio | null>(null);
  profesionales = input<Profesional[]>([]);
  categorias = input<Categoria[]>([]);
  especialidades = input<Especialidad[]>([]);
  saving = input<boolean>(false);

  guardar = output<ServicioCreateDto | ServicioUpdateDto>();
  cancelar = output<void>();

  servicioModel = signal<ServicioFormModel>(this.modeloVacio());

  servicioForm = form(this.servicioModel, (path) => {
    required(path.nombre, { message: 'El nombre es obligatorio' });
    minLength(path.nombre, 3, { message: 'Mínimo 3 caracteres' });
    maxLength(path.nombre, 150, { message: 'Máximo 150 caracteres' });

    maxLength(path.descripcion, 500, { message: 'Máximo 500 caracteres' });

    required(path.idprofesional, { message: 'Seleccione un profesional' });
    required(path.idcategoria, { message: 'Seleccione una categoría' });

    required(path.modalidad, { message: 'Seleccione una modalidad' });

    required(path.precio, { message: 'El precio es obligatorio' });
    min(path.precio, 1, { message: 'El precio debe ser mayor a 0' });

    required(path.duracion, { message: 'La duración es obligatoria' });
    min(path.duracion, 1, { message: 'La duración debe ser mayor a 0' });

    required(path.estado, { message: 'Seleccione un estado' });
  });

  constructor() {
    effect(() => {
      const servicio = this.servicio();

      if (!servicio) {
        this.resetForm();
        return;
      }

      this.servicioModel.set({
        idprofesional: String(servicio.idprofesional ?? ''),
        idcategoria: String(servicio.idcategoria ?? ''),
        nombre: servicio.Nombre ?? '',
        descripcion: servicio.Descripcion ?? '',
        precio: servicio.Precio ?? 0,
        duracion: servicio.Duracion ?? 0,
        modalidad: servicio.Modalidad ?? 'PRESENCIAL',
        estado: servicio.Estado ?? 'ACTIVO',
        especialidadIds: servicio.servicioEspecialidades?.map((item: any) => item.Id) ?? [],
      });
    });
  }

  private modeloVacio(): ServicioFormModel {
    return {
      idprofesional: '',
      idcategoria: '',
      nombre: '',
      descripcion: '',
      precio: 0,
      duracion: 0,
      modalidad: 'PRESENCIAL',
      estado: 'ACTIVO',
      especialidadIds: [],
    };
  }

  private resetForm() {
    this.servicioModel.set(this.modeloVacio());
  }

 toggleEspecialidad(id: number, checked: boolean) {
  const valorActual = this.servicioModel();
  let nuevasEspecialidades = [...valorActual.especialidadIds];

  if (checked) {
    if (!nuevasEspecialidades.includes(id)) {
      nuevasEspecialidades.push(id);
    }
  } else {
    nuevasEspecialidades = nuevasEspecialidades.filter(function(item) {
      return item !== id;
    });
  }

  this.servicioModel.set({
    ...valorActual,
    especialidadIds: nuevasEspecialidades,
  });
}

  isEspecialidadSelected(id: number): boolean {
    return this.servicioModel().especialidadIds.includes(id);
  }

  private marcarCamposComoTocados() {
    this.servicioForm.nombre().markAsTouched();
    this.servicioForm.idprofesional().markAsTouched();
    this.servicioForm.idcategoria().markAsTouched();
    this.servicioForm.modalidad().markAsTouched();
    this.servicioForm.precio().markAsTouched();
    this.servicioForm.duracion().markAsTouched();
    this.servicioForm.estado().markAsTouched();
  }

  private formularioInvalido(): boolean {
    return (
      this.servicioForm.nombre().invalid() ||
      this.servicioForm.idprofesional().invalid() ||
      this.servicioForm.idcategoria().invalid() ||
      this.servicioForm.modalidad().invalid() ||
      this.servicioForm.precio().invalid() ||
      this.servicioForm.duracion().invalid() ||
      this.servicioForm.estado().invalid()
    );
  }

  private buildDto(): ServicioCreateDto | ServicioUpdateDto {
    const valor = this.servicioModel();

    return {
      idprofesional: Number(valor.idprofesional),
      idcategoria: Number(valor.idcategoria),
      Nombre: valor.nombre.trim(),
      Descripcion: valor.descripcion.trim(),
      Precio: Number(valor.precio),
      Duracion: Number(valor.duracion),
      Modalidad: valor.modalidad,
      Estado: valor.estado,
      especialidadIds: valor.especialidadIds,
    };
  }

  submit() {
    if (this.saving()) return;

    this.marcarCamposComoTocados();

    if (this.formularioInvalido()) return;

    const dto = this.buildDto();
    this.guardar.emit(dto);
  }
}