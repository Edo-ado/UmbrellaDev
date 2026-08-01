import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})

export class Header {
  menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.update(value => !value);
  }
}