import { Router } from "express";

//aqui van los imports
import { CategoriaRoutes } from "./categoria.routes";
import { usuarioRoutes } from "./usuario.routes";        
import { especialidadRoutes } from "./especialidad.routes"; 
import { ServicioRoutes } from "./servicio.routes";
import { citasRoutes } from "./cita.routes";
import { ImageRoutes } from "./image.routes";


import { EstadisticaRoutes } from "./estadistica.routes";




export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // aqui van las rutas  ej: router.use('/nombre', nombrearchivo.routes)

    router.use("/categorias", CategoriaRoutes.routes);
    router.use("/usuarios", usuarioRoutes.routes);
    router.use("/especialidades", especialidadRoutes.routes);
    router.use("/servicios", ServicioRoutes.routes);
    router.use("/citas", citasRoutes.routes);
    router.use("/images", ImageRoutes.routes)
  router.use("/estadisticas", EstadisticaRoutes.routes);


    return router;
  }
}
