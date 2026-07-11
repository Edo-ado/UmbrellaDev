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

import { CitasListadoComponent } from './pages/citas/listado/listado';
import { CitasCrear } from './pages/citas/registro/registro';
import { CitasDetalle } from './pages/citas/detalle/detalle';


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


      //citas
      {path: 'citas', component: CitasListadoComponent},
     {path: 'citas/crear', component: CitasCrear},
      {path: 'citas/detalle/:id', component: CitasDetalle},
    ],
  },
];
