import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Profesional } from '../../../core/models/profesional.model';

@Component({
  selector: 'app-usuario-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-lista.html',
  styleUrls: ['./usuario-lista.css'],
})
export class UsuarioLista implements OnInit {
  private usuarioService = inject(UsuarioService);

  usuarios = signal<Profesional[]>([]);
  loading = signal(false);
  error = signal('');
  termino = '';
  rolSeleccionado = '';
  mensaje = signal('');

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading.set(true);
    this.error.set('');

    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los usuarios.');
        this.loading.set(false);
      },
    });
  }

  buscar() {
    this.loading.set(true);
    this.error.set('');
    this.mensaje.set('');

    const termino = this.termino.trim();

    if (!termino) {
      this.cargarUsuarios();
      return;
    }

    this.usuarioService.buscarPorNombre(termino).subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.loading.set(false);

        if (data.length === 0) {
          this.mensaje.set(`No se encontró ningún usuario con el nombre "${termino}".`);
        }
      },
      error: () => {
        this.error.set('No se pudo realizar la búsqueda.');
        this.loading.set(false);
      },
    });
  }

  filtrarPorRol(rol: string) {
    this.rolSeleccionado = rol;

    if (!rol) {
      this.cargarUsuarios();
      return;
    }

    this.usuarioService.obtenerPorRol(rol).subscribe({
      next: (data) => this.usuarios.set(data),
      error: () => this.error.set('No se pudo filtrar por rol.'),
    });
  }

  limpiar() {
    this.termino = '';
    this.rolSeleccionado = '';
    this.mensaje.set('');
    this.error.set('');
    this.cargarUsuarios();
  }
ChangeUserRole(id: number, nuevoRol: string) {
  const confirmar = confirm(
    `¿Deseas cambiar el rol de este usuario a ${nuevoRol}?`,
  );

  if (!confirmar) {
    return;
  }

  this.usuarioService.ChangeRol(id, nuevoRol).subscribe({
    next: () => {
      this.mensaje.set('Rol actualizado correctamente.');
      this.cargarUsuarios();

      setTimeout(() => this.mensaje.set(''), 2500);
    },
    error: () => {
      this.error.set('No se pudo actualizar el rol del usuario.');
    },
  });
}

  toggleEstado(id: number) {
    const confirmar = confirm('¿Deseas cambiar el estado de este usuario?');
    if (!confirmar) return;

    this.usuarioService.toggleEstado(id).subscribe({
      next: () => {
        this.mensaje.set('Estado actualizado correctamente.');
        this.cargarUsuarios();
        setTimeout(() => this.mensaje.set(''), 2500);
      },
      error: () => {
        this.error.set('No se pudo actualizar el estado del usuario.');
      },
    });
  }
}