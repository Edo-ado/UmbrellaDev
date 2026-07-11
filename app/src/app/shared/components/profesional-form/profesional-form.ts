import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormField,
  form,
  required,
  minLength,
  maxLength,
  min,
  validate,
} from '@angular/forms/signals';
import {
  Profesional,
  ProfesionalFormModel,
  ProfesionalCreateDto,
  ProfesionalUpdateDto,
  Especialidad,
} from '../../../core/models/profesional.model';
import { ImageService } from '../../../core/services/imagen.service';

@Component({
  selector: 'app-profesional-form',
  standalone: true,
  imports: [CommonModule, FormField],
  templateUrl: './profesional-form.html',
  styleUrls: ['./profesional-form.css'],
})
export class ProfesionalForm {
  private readonly imageService = inject(ImageService);

  profesional = input<Profesional | null>(null);
  especialidades = input<Especialidad[]>([]);
  saving = input<boolean>(false);

  guardar = output<{ dto: ProfesionalCreateDto | ProfesionalUpdateDto; foto: File | null }>();
  cancelar = output<void>();

  isEdit = computed(() => this.profesional() !== null);
  isSubmitting = computed(() => this.saving());
  fotoActualUrl = computed(() => {
    const foto = this.profesional()?.Foto;
    return foto ? this.imageService.getUrl(foto) : null;
  });

  profesionalModel = signal<ProfesionalFormModel>(this.modeloVacio());
  foto = signal<File | null>(null);
  fotoPreview = signal<string | null>(null);

  profesionalForm = form(this.profesionalModel, (path) => {
    required(path.nombreCompleto, { message: 'El nombre es obligatorio' });
    minLength(path.nombreCompleto, 3, { message: 'Mínimo 3 caracteres' });
    maxLength(path.nombreCompleto, 150, { message: 'Máximo 150 caracteres' });

    required(path.email, { message: 'El correo es obligatorio' });
    validate(path.email, (ctx) => {
      const valor = ctx.value().trim();
      const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (valor.length > 0 && !patron.test(valor)) {
        return { kind: 'emailInvalido', message: 'Ingrese un correo válido' };
      }
      return undefined;
    });

    if (!this.isEdit()) {
      required(path.contrasena, { message: 'La contraseña es obligatoria' });
      minLength(path.contrasena, 8, { message: 'Mínimo 8 caracteres' });
    }

    required(path.pais, { message: 'El país es obligatorio' });

    required(path.tituloProfesional, { message: 'El título profesional es obligatorio' });
    maxLength(path.tituloProfesional, 150, { message: 'Máximo 150 caracteres' });

    required(path.modalidad, { message: 'Seleccione una modalidad' });

    required(path.tarifaBase, { message: 'La tarifa base es obligatoria' });
    min(path.tarifaBase, 1, { message: 'La tarifa debe ser mayor a 0' });

    min(path.anosExperiencia, 0, { message: 'Los años de experiencia no pueden ser negativos' });

    maxLength(path.descripcion, 500, { message: 'Máximo 500 caracteres' });
  });

  constructor() {
    effect(() => {
      const profesional = this.profesional();
      if (!profesional) {
        this.resetForm();
        return;
      }

      this.profesionalModel.set({
        nombreCompleto: profesional.NombreCompleto ?? '',
        email: profesional.Email ?? '',
        contrasena: '',
        pais: profesional.Pais ?? '',
        telefono: profesional.Telefono ?? '',
        modalidad: profesional.Modalidad ?? 'PRESENCIAL',
        descripcion: profesional.Descripcion ?? '',
        anosExperiencia: profesional.AnosExperiencia ?? 0,
        ubicacion: profesional.Ubicacion ?? '',
        tituloProfesional: profesional.TituloProfesional ?? '',
        tarifaBase: profesional.TarifaBase ?? 0,
        disponibilidad: profesional.Disponibilidad ?? true,
        universidad: profesional.Universidad ?? '',
        especialidadIds: profesional.especialidades?.map((item) => item.Id) ?? [],
      });
    });
  }

  private modeloVacio(): ProfesionalFormModel {
    return {
      nombreCompleto: '',
      email: '',
      contrasena: '',
      pais: '',
      telefono: '',
      modalidad: 'PRESENCIAL',
      descripcion: '',
      anosExperiencia: 0,
      ubicacion: '',
      tituloProfesional: '',
      tarifaBase: 0,
      disponibilidad: true,
      universidad: '',
      especialidadIds: [],
    };
  }

  private resetForm() {
    this.profesionalModel.set(this.modeloVacio());
  }

  toggleEspecialidad(id: number, checked: boolean) {
    this.profesionalModel.update((valor) => ({
      ...valor,
      especialidadIds: checked
        ? Array.from(new Set([...valor.especialidadIds, id]))
        : valor.especialidadIds.filter((item) => item !== id),
    }));
  }

  isEspecialidadSelected(id: number): boolean {
    return this.profesionalModel().especialidadIds.includes(id);
  }

  private marcarCamposComoTocados() {
    this.profesionalForm.nombreCompleto().markAsTouched();
    this.profesionalForm.email().markAsTouched();
    if (!this.isEdit()) {
      this.profesionalForm.contrasena().markAsTouched();
    }
    this.profesionalForm.pais().markAsTouched();
    this.profesionalForm.tituloProfesional().markAsTouched();
    this.profesionalForm.modalidad().markAsTouched();
    this.profesionalForm.tarifaBase().markAsTouched();
  }

  private formularioInvalido(): boolean {
    return (
      this.profesionalForm.nombreCompleto().invalid() ||
      this.profesionalForm.email().invalid() ||
      (!this.isEdit() && this.profesionalForm.contrasena().invalid()) ||
      this.profesionalForm.pais().invalid() ||
      this.profesionalForm.tituloProfesional().invalid() ||
      this.profesionalForm.modalidad().invalid() ||
      this.profesionalForm.tarifaBase().invalid()
    );
  }

  private buildDto(): ProfesionalCreateDto | ProfesionalUpdateDto {
    const valor = this.profesionalModel();

    const base = {
      NombreCompleto: valor.nombreCompleto.trim(),
      Email: valor.email.trim(),
      Pais: valor.pais.trim(),
      Telefono: valor.telefono.trim(),
      Modalidad: valor.modalidad,
      Descripcion: valor.descripcion.trim(),
      AnosExperiencia: Number(valor.anosExperiencia),
      Ubicacion: valor.ubicacion.trim(),
      TituloProfesional: valor.tituloProfesional.trim(),
      TarifaBase: Number(valor.tarifaBase),
      Disponibilidad: valor.disponibilidad,
      Universidad: valor.universidad.trim(),
      especialidadIds: valor.especialidadIds,
    };

    if (!this.isEdit()) {
      return {
        ...base,
        Contraseña: valor.contrasena,
        Role: 'DESARROLLADOR',
      } as ProfesionalCreateDto;
    }

    return base as ProfesionalUpdateDto;
  }

  seleccionarFoto(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.foto.set(file);
    this.fotoPreview.set(file ? URL.createObjectURL(file) : null);
  }

  submit() {
    if (this.isSubmitting()) return;
    this.marcarCamposComoTocados();
    if (this.formularioInvalido()) return;

    const dto = this.buildDto();
    this.guardar.emit({ dto, foto: this.foto() });
  }
}