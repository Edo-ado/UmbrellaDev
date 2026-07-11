import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-usuario-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-lista.html',
  styleUrls: ['./usuario-lista.css'],
})
export class UsuarioLista implements OnInit {
  private http = inject(HttpClient);
private apiUrl = 'http://localhost:3000/usuarios';

  usuarios = signal<any[]>([]);
  loading = signal(false);
  error = signal('');
  termino = '';
  rolSeleccionado = '';
  mensaje = signal('');

  usuariosFiltrados = computed(() => {
    const termino = this.termino.trim().toLowerCase();
    const rol = this.rolSeleccionado;

    return this.usuarios().filter((u) => {
      const coincideNombre = !termino || u.NombreCompleto?.toLowerCase().includes(termino);
      const coincideRol = !rol || u.Role === rol;
      return coincideNombre && coincideRol;
    });
  });

  ngOnInit(): void {
    this.cargarUsuarios();
  }

 cargarUsuarios() {
  this.loading.set(true);
  this.error.set('');

  this.http.get<any[]>(`${this.apiUrl}/lista`).subscribe({
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

  this.http.get<any[]>(`${this.apiUrl}/buscar?nombre=${encodeURIComponent(termino)}`).subscribe({
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

  limpiar() {
    this.termino = '';
    this.rolSeleccionado = '';
  }

  toggleEstado(id: number) {
    const confirmar = confirm('¿Deseas cambiar el estado de este usuario?');
    if (!confirmar) return;

  this.http.patch(`${this.apiUrl}/CambioEstado/${id}`, {}).subscribe({
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