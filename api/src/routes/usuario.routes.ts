import { Router } from "express";
import { usuarioController } from "../controllers/usuario.controller";
<<<<<<< HEAD
=======
import { asyncHandler } from "../middlewares/async-handler.middleware";
>>>>>>> origin

//La api reconoce primero los que estan hasta arriba es decir que si hay alguna busqueda que tenga que ser con numero
// o se especifica como se hace abajo o se deja hasta el final

export class usuarioRoutes {
  static get routes(): Router {
    const router = Router();
    const usuariosController = new usuarioController();

    //Metodos para conseguir datos generales

    router.get("/", usuariosController.getAll);
    router.get("/rol/:rol", usuariosController.getByRol);
    router.get("/modalidad/:modalidad",usuariosController.getByModalidad)
    router.get('/disponibilidad/:disponibilidad', usuariosController.getByDisponibilidad)
    router.get('/buscar',usuariosController.searchByName)
<<<<<<< HEAD
=======
    router.post("/", asyncHandler(usuariosController.crear));
    router.put("/:id", asyncHandler(usuariosController.update));
    router.patch("/:id/toggle-status", asyncHandler(usuariosController.toggleStatus));
>>>>>>> origin

    //Metodos para conseguir datos especificos

    router.get("/Id/:id", usuariosController.getById);
    return router;
  }
}
