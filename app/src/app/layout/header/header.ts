import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  protected readonly authService = inject(AuthService);

  menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.update(value => !value);
  }

  cerrarSesion(): void {
    this.authService.logout();
  }
}