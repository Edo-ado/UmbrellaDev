import { Router } from "express";
import { CategoriaController } from "../controllers/categoria.controller";


export class CategoriaRoutes {
    static  get routes(): Router {
        const router = Router();
        const categoriaController = new CategoriaController();

        router.get('/', categoriaController.getAll)

        router.get('/:id', categoriaController.getById)
        return router;
    }
}