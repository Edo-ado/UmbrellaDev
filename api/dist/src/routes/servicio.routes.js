import { Router } from "express";
import { ServicioController } from "../controllers/servicio.controller";
export class ServicioRoutes {
    static get routes() {
        const router = Router();
        console.log("Construyendo ServicioRoutes");
        const ServiciosController = new ServicioController();
        router.get("/", ServiciosController.getAll);
        router.get("/id/:id", ServiciosController.getById);
        router.get("/profesional/:id", ServiciosController.getByProfesional);
        router.get("/categoria/:id", ServiciosController.getByCategories);
        router.get("/buscar", ServiciosController.getByName);
        router.get("/modalidad/:modalidad", ServiciosController.getByModalidad);
        router.get("/rango-precio", ServiciosController.getByRangoPrecio);
        //CRUD
        router.post("/crear", ServiciosController.create);
        router.put("/update/:id", ServiciosController.update);
        router.patch("/CambioEstado/:id", ServiciosController.toggleStatus);
        //por usuario(servicios de un profesional)
        router.get("/profesional-activo/:id", ServiciosController.getByProfesionalActivo);
        return router;
    }
}
