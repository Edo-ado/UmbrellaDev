import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';
import { UsuarioLista } from './pages/usuario/usuario-lista/usuario-lista';
import { CategoriaLista } from './pages/categoria/categoria-lista/categoria-lista';
import { EspecialidadLista } from './pages/especialidad/lista-especialidad/lista-especialidad';

import { ProfesionalLista } from './pages/profesionales/profesionales-lista/profesionales-lista';
import { ProfesionalesDetalle } from './pages/profesionales/profesionales-detalle/profesionales-detalle';
import { ProfesionalesCrear } from './pages/profesionales/profesionales-crear/profesionales-crear';
import { ProfesionalesEditar } from './pages/profesionales/profesionales-editar/profesionales-editar';
import { ServiciosLista } from './pages/servicios/servicios-lista/servicios-lista';
import { ServiciosDetail } from './pages/servicios/servicios-detail/servicios-detail';
import { ServiciosEdit } from './pages/servicios/servicios-edit/servicios-edit';
import { ServiciosCreate } from './pages/servicios/servicios-create/servicios-create';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home },
      { path: 'usuarios', component: UsuarioLista },
      { path: 'categorias', component: CategoriaLista },
      { path: 'especialidades', component: EspecialidadLista },

      //profesionales
      { path: 'profesionales', component: ProfesionalLista },
      { path: 'profesionalescrear', component: ProfesionalesCrear },
      { path: 'profesionalesEditar/:id', component: ProfesionalesEditar },
      { path: 'profesionalesDetalle/:id', component: ProfesionalesDetalle },

      //servicios
      { path: 'servicios', component: ServiciosLista },
   { path: 'servicios/detail/:id', component: ServiciosDetail },
  { path: 'servicios/create', component: ServiciosCreate },
  { path: 'servicios/edit/:id', component: ServiciosEdit },
    ],
  },
];
