import { Router } from "express";
import { usuarioController } from "../controllers/usuario.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { uploadImage } from "../middlewares/image-config.middleware";
export class usuarioRoutes {
    static get routes() {
        const router = Router();
        const usuariosController = new usuarioController();
        router.post("/crear", usuariosController.crear);
        router.put("/update/:id", uploadImage, usuariosController.update);
        router.patch("/CambioEstado/:id", usuariosController.toggleStatus);
        //Metodos para conseguir datos generales
        router.get("/lista", usuariosController.getAll);
        router.get("/rol/:rol", usuariosController.getByRol);
        router.get("/modalidad/:modalidad", usuariosController.getByModalidad);
        router.get("/disponibilidad/:disponibilidad", usuariosController.getByDisponibilidad);
        router.get("/buscar", usuariosController.searchByName);
        //Metodos para conseguir datos especificos
        router.get("/Id/:id", usuariosController.getById);
        router.get("/desarrolladores", usuariosController.getAllDesarrolladores);
        //toggle
        router.patch("/CambioDisponibilidad/:id", usuariosController.toggleDisponibilidadByProfesional);
        router.get("/fechas", usuariosController.getByFechas);
        router.post("/login", usuariosController.login);
        router.post("/register", usuariosController.register);
        router.get("/perfil", authenticateToken, usuariosController.perfil);
        router.get("/perfil/:id", usuariosController.perfil);
        //change user role
  router.patch("/cambiar-rol/:id", usuariosController.changeUserRole);
        return router;
    }
}
