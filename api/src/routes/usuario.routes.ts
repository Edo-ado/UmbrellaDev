import { Router } from "express";
import { usuarioController } from "../controllers/usuario.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

//La api reconoce primero los que estan hasta arriba es decir que si hay alguna busqueda que tenga que ser con numero
// o se especifica como se hace abajo o se deja hasta el final

export class usuarioRoutes {
  static get routes(): Router {
    const router = Router();
    const usuariosController = new usuarioController();

    //metodos de CRUD
    router.post("/crear", usuariosController.crear);
    router.put("/update/:id", usuariosController.update);
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
    router.get("/desarrolladores", usuariosController.getAllDesarrolladores);

    //toggle

    router.patch("/CambioDisponibilidad/:id", usuariosController.toggleDisponibilidadByProfesional);



router.get("/fechas", usuariosController.getByFechas);

router.post(
    "/login",
    usuariosController.login
)

router.post(
    "/register",
    usuariosController.register
)


router.get(
    "/perfil",
    authenticateToken,
    usuariosController.perfil
)

    return router;
  }
}
