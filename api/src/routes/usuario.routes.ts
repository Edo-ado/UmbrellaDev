import { Router } from "express";
import { usuarioController } from "../controllers/usuario.controller";

//La api reconoce primero los que estan hasta arriba es decir que si hay alguna busqueda que tenga que ser con numero
// o se especifica como se hace abajo o se deja hasta el final

export class usuarioRoutes {
  static get routes(): Router {
    const router = Router();
    const usuariosController = new usuarioController();

    //metodos de CRUD
    router.post("/", usuariosController.crear);
    router.put("/:id", usuariosController.update);
    router.patch("/CambioEstado/:id", usuariosController.toggleStatus);

    //Metodos para conseguir datos generales

    router.get("/lista", usuariosController.getAll);
    router.get("/rol/:rol", usuariosController.getByRol);
    router.get("/modalidad/:modalidad", usuariosController.getByModalidad);
    router.get(
      "/disponibilidad/:disponibilidad",
      usuariosController.getByDisponibilidad,
    );
    router.get("/buscar", usuariosController.searchByName);

    //Metodos para conseguir datos especificos

    router.get("/Id/:id", usuariosController.getById);

    return router;
  }
}
