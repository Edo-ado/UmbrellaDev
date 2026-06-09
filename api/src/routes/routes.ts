import { Router } from 'express';




//aqui van los imports
import { CategoriaRoutes } from './categoria.routes';
import { usuarioRoutes } from './usuario.routes';
import { especialidadRoutes } from './especialidad.routes';



export class AppRoutes {
static get routes(): Router {
const router = Router();




// aqui van las rutas  ej: router.use('/nombre', nombrearchivo.routes)

router.use('/categorias', CategoriaRoutes.routes)
router.use('/usuarios', usuarioRoutes.routes)
router.use('/especialidades', especialidadRoutes.routes)




return router;
}
}