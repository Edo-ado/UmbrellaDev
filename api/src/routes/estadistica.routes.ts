import { Router } from "express";
import { EstadisticaController } from "../controllers/estadistica.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

export class EstadisticaRoutes {
  static get routes() {
    const router = Router();
    const estadisticaController = new EstadisticaController();
    router.get("/citas-por-estado", estadisticaController.getCitasPorEstado);
   
router.get(
  "/reporte-profesional",
  authenticateToken,
  estadisticaController.getReportePorProfesional,
);
    return router;
  }
}