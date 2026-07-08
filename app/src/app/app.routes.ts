import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';
import { UsuarioLista } from './pages/usuario/usuario-lista/usuario-lista';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home },
      { path: 'usuarios', component: UsuarioLista },
    ],
  },
];