import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';
import { UsuarioLista } from './pages/usuario/usuario-lista/usuario-lista';
import { CategoriaLista } from './pages/categoria/categoria-lista/categoria-lista';
import { EspecialidadLista } from './pages/especialidad/lista-especialidad/lista-especialidad';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home },
      { path: 'usuarios', component: UsuarioLista },
     { path: 'categorias', component: CategoriaLista },
{ path: 'especialidades', component: EspecialidadLista }
    ],
  },
];