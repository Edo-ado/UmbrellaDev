import { Router } from "express";
import { CategoriaController } from "../controllers/categoria.controller";
export class CategoriaRoutes {
    static get routes() {
        const router = Router();
        const categoriaController = new CategoriaController();
        router.get("/", categoriaController.getAll);
        router.get("/id/:id", categoriaController.getById);
        router.get("/buscar", categoriaController.getByName);
        router.get("/estado/:estado", categoriaController.getByEstado);
        router.get("/activos", categoriaController.getAllActivos);
        router.patch("/CambioEstado/:id", categoriaController.toggleStatus);
        return router;

    }
}
