import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainLayout],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {}