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

import { CitasListadoComponent } from './pages/citas/listado/listado';
import { CitasCrear } from './pages/citas/registro/registro';
import { CitasDetalle } from './pages/citas/detalle/detalle';

import { Graficos } from './pages/panel-control/graficos/graficos';
import { LoginComponent } from './pages/auth/login/login';
import { RegisterComponent } from './pages/auth/register/register';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

import { Role } from '../app/core/models/usuario.model';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home, canActivate: [authGuard] },
      {
        path: 'usuarios',
        component: UsuarioLista,
        canActivate: [authGuard, roleGuard],
        data: { roles: [Role.ADMIN] },
      },
      {
        path: 'categorias',
        component: CategoriaLista,
        canActivate: [authGuard, roleGuard],
        data: { roles: [Role.ADMIN] },
      },
      {
        path: 'especialidades',
        component: EspecialidadLista,
        canActivate: [authGuard, roleGuard],
        data: { roles: [Role.ADMIN] },
      },

      //profesionales
      { path: 'profesionales', component: ProfesionalLista, canActivate: [authGuard] },
      {
        path: 'profesionalescrear',
        component: ProfesionalesCrear,
        canActivate: [authGuard, roleGuard],
        data: { roles: [Role.ADMIN] },
      },
      {
        path: 'profesionalesEditar/:id',
        component: ProfesionalesEditar,
        canActivate: [authGuard, roleGuard],
        data: { roles: [Role.ADMIN, Role.DESARROLLADOR] },
      },
      {
        path: 'profesionalesDetalle/:id',
        component: ProfesionalesDetalle,
        canActivate: [authGuard],
      },

      //servicios
      { path: 'servicios', component: ServiciosLista, canActivate: [authGuard] },
      { path: 'servicios/detail/:id', component: ServiciosDetail, canActivate: [authGuard] },
      {
        path: 'servicios/create',
        component: ServiciosCreate,
        canActivate: [authGuard, roleGuard],
        data: { roles: [Role.DESARROLLADOR] },
      },
      {
        path: 'servicios/edit/:id',
        component: ServiciosEdit,
        canActivate: [authGuard, roleGuard],
        data: { roles: [Role.DESARROLLADOR] },
      },

      //citas
      {
        path: 'citas',
        component: CitasListadoComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: [Role.USUARIO, Role.ADMIN, Role.DESARROLLADOR] },
      },
      { path: 'citas/crear', component: CitasCrear },
      { path: 'citas/detalle/:id', component: CitasDetalle , canActivate: [authGuard] },

      // panel de control
      { path: 'panel-control', component: Graficos ,
        canActivate: [authGuard, roleGuard],
        data: { roles: [Role.ADMIN] }, },


        
      //login
      { path: 'login', component: LoginComponent },

      //register
      { path: 'register', component: RegisterComponent },
    ],
  },
];
