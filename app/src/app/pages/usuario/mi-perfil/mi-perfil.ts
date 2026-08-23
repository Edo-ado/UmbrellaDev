import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ImageService } from '../../../core/services/imagen.service';
import { Profesional } from '../../../core/models/usuario.model';

const TIPOS_IMAGEN_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANO_MAXIMO_IMAGEN = 2 * 1024 * 1024; // 2 MB, igual que el backend

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfil {
  private readonly authService = inject(AuthService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly imageService = inject(ImageService);

  usuario = this.authService.profesional;

  esProfesional = computed(() => this.usuario()?.Role === 'DESARROLLADOR');
  esAdmin = computed(() => this.usuario()?.Role === 'ADMIN');

  editando = signal<boolean>(false);
  guardando = signal<boolean>(false);
  error = signal<string>('');
  mensaje = signal<string>('');

  // Campos base (editables para cualquier rol no-admin)
  nombreCompleto = signal<string>('');
  email = signal<string>('');
  telefono = signal<string>('');
  pais = signal<string>('');

  // Cambio de contraseña (opcional)
  nuevaContrasena = signal<string>('');
  confirmarContrasena = signal<string>('');
  errorContrasena = signal<string>('');

  // Campos exclusivos de profesional
  descripcion = signal<string>('');
  ubicacion = signal<string>('');
  tarifaBase = signal<number | null>(null);

  // Foto
  archivoFoto = signal<File | null>(null);
  previewFoto = signal<string | null>(null);
  errorFoto = signal<string>('');

  fotoActualUrl = computed(() => {
    const preview = this.previewFoto();
    if (preview) {
      return preview;
    }

    const foto = this.usuario()?.Foto;
    return foto ? this.imageService.getUrl(foto) : null;
  });

  constructor() {
    // Mantiene el formulario sincronizado con el usuario mientras NO se está editando,
    // por si el perfil se recarga (ej. al volver a esta pantalla).
    effect(() => {
      const usuarioActual = this.usuario();

      if (usuarioActual && !this.editando()) {
        this.cargarFormularioDesde(usuarioActual);
      }
    });
  }

  private cargarFormularioDesde(usuario: Profesional): void {
    this.nombreCompleto.set(usuario.NombreCompleto);
    this.email.set(usuario.Email);
    this.telefono.set(usuario.Telefono ?? '');
    this.pais.set(usuario.Pais);

    this.descripcion.set(usuario.Descripcion ?? '');
    this.ubicacion.set(usuario.Ubicacion ?? '');
    this.tarifaBase.set(usuario.TarifaBase ?? null);
  }

  iniciarEdicion(): void {
    const usuarioActual = this.usuario();
    if (!usuarioActual) {
      return;
    }

    this.cargarFormularioDesde(usuarioActual);
    this.nuevaContrasena.set('');
    this.confirmarContrasena.set('');
    this.errorContrasena.set('');
    this.error.set('');
    this.mensaje.set('');
    this.editando.set(true);
  }

  cancelarEdicion(): void {
    const usuarioActual = this.usuario();
    if (usuarioActual) {
      this.cargarFormularioDesde(usuarioActual);
    }

    this.limpiarSeleccionFoto();
    this.nuevaContrasena.set('');
    this.confirmarContrasena.set('');
    this.errorContrasena.set('');
    this.error.set('');
    this.editando.set(false);
  }

  onFotoSeleccionada(event: Event): void {
    this.errorFoto.set('');

    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];

    if (!archivo) {
      return;
    }

    if (!TIPOS_IMAGEN_PERMITIDOS.includes(archivo.type)) {
      this.errorFoto.set('Solo se permiten imágenes JPG, PNG o WEBP.');
      input.value = '';
      return;
    }

    if (archivo.size > TAMANO_MAXIMO_IMAGEN) {
      this.errorFoto.set('La imagen no debe superar los 2 MB.');
      input.value = '';
      return;
    }

    if (this.previewFoto()) {
      URL.revokeObjectURL(this.previewFoto()!);
    }

    this.archivoFoto.set(archivo);
    this.previewFoto.set(URL.createObjectURL(archivo));
  }

  private limpiarSeleccionFoto(): void {
    if (this.previewFoto()) {
      URL.revokeObjectURL(this.previewFoto()!);
    }

    this.archivoFoto.set(null);
    this.previewFoto.set(null);
    this.errorFoto.set('');
  }

  private contrasenaValida(): boolean {
    this.errorContrasena.set('');

    if (!this.nuevaContrasena() && !this.confirmarContrasena()) {
      return true; // No se está cambiando la contraseña
    }

    if (this.nuevaContrasena().length < 6) {
      this.errorContrasena.set(
        'La nueva contraseña debe tener al menos 6 caracteres.'
      );
      return false;
    }

    if (this.nuevaContrasena() !== this.confirmarContrasena()) {
      this.errorContrasena.set('Las contraseñas no coinciden.');
      return false;
    }

    return true;
  }

  guardar(): void {
    const usuarioActual = this.usuario();
    if (!usuarioActual) {
      return;
    }

    this.error.set('');
    this.mensaje.set('');

    if (!this.nombreCompleto().trim() || !this.email().trim() || !this.pais().trim()) {
      this.error.set('Nombre, correo y país son obligatorios.');
      return;
    }

    if (!this.contrasenaValida()) {
      return;
    }

    // NOTA: la forma exacta de ProfesionalUpdateDto no está confirmada en este
    // proyecto; se construye el objeto con las claves que el backend
    // (usuario.service.ts) realmente lee en actualizar(). Ojo con "Contraseña"
    // (con ñ), así se llama la clave que espera el backend.
    const datos: Record<string, unknown> = {
      NombreCompleto: this.nombreCompleto().trim(),
      Email: this.email().trim(),
      Telefono: this.telefono().trim(),
      Pais: this.pais().trim(),
    };

    if (this.nuevaContrasena()) {
      datos['Contraseña'] = this.nuevaContrasena();
    }

    if (this.esProfesional()) {
      datos['Descripcion'] = this.descripcion().trim();
      datos['Ubicacion'] = this.ubicacion().trim();
      datos['TarifaBase'] = this.tarifaBase();
    }

    this.guardando.set(true);

    this.usuarioService
      .actualizar(usuarioActual.Id, datos as any, this.archivoFoto() ?? undefined)
      .subscribe({
        next: () => {
          this.authService.refrescarPerfil().subscribe({
            next: () => {
              this.guardando.set(false);
              this.mensaje.set('Perfil actualizado correctamente.');
              this.limpiarSeleccionFoto();
              this.nuevaContrasena.set('');
              this.confirmarContrasena.set('');
              this.editando.set(false);
            },
            error: () => {
              this.guardando.set(false);
              this.mensaje.set(
                'Perfil actualizado, pero no se pudo refrescar la vista. Recargá la página.'
              );
              this.editando.set(false);
            },
          });
        },
        error: (err) => {
          this.guardando.set(false);
          this.error.set(
            err?.error?.message || 'No se pudo actualizar el perfil.'
          );
        },
      });
  }
}