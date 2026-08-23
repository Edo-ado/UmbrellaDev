import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { AppRoutes } from "./routes/routes";
import chalk from "chalk";
import figlet from "figlet";
import path from "node:path";
const app = express();
// Acceder a la configuracion del archivo .env
dotenv.config();
// Puerto que escucha por defecto 300 o definido .env
const port = process.env.PORT || 3000;
// Middleware CORS para aceptar llamadas en el servido
app.use(cors());
// Middleware para loggear las llamadas al servidor
app.use(morgan("dev"));
// Middleware para gestionar Requests y Response json
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
//---- Definir rutas ----
app.use(AppRoutes.routes);
app.use((err, req, res, next) => {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({
        success: false,
        message: err.message || "Error interno del servidor",
    });
});
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Umbrella Corporation API",
        routes: {
            categorias: [
                "GET /categorias",
                "GET /categorias/id/:id",
                "GET /categorias/buscar?nombre=Desarrollo",
                "GET /categorias/estado/:estado",
            ],
            especialidades: [
                "GET /especialidades",
                "GET /especialidades/id/:id",
                "GET /especialidades/buscar?nombre=Html",
                "GET /especialidades/estado/:estado",
            ],
            usuarios: [
                "GET /usuarios",
                "GET /usuarios/desarrolladores",
                "GET /usuarios/id/:id",
                "GET /usuarios/rol/:rol",
                "GET /usuarios/buscar?nombre=Carlos",
            ],
            servicios: [
                "GET /servicios",
                "GET /servicios/id/:id",
                "GET /servicios/profesional/:id",
                "GET /servicios/categoria/:id",
                "GET /servicios/buscar?nombre=Desarrollo de API REST",
                "GET /servicios/modalidad/:modalidad",
                "GET /servicios/rango-precio?precioMin=80000&precioMax=100000",
            ],
            citas: [
                "GET /citas",
                "GET /citas/id/:id",
                "GET /citas/Profesional/:id",
                "GET /citas/fechas?fechaInicial=2026-06-01T00:00:00&fechaFinal=2026-06-30T23:59:59",
                "GET /citas/estado/:estado",
            ],
        },
    });
});
// Handle errors middleware
//Acceso a las imágenes
app.use("/images", express.static(path.join(path.resolve(), "assets/uploads")));
process.on("SIGINT", () => {
    console.clear();
    process.exit();
});
app.listen(port, () => {
    // Logo ASCII grande
    console.log(chalk.red(figlet.textSync("UMBRELLA", {
        font: "Big",
        horizontalLayout: "full",
    })));
    console.log(chalk.red("  ╔══════════════════════════════════════════╗"));
    console.log(chalk.red("  ║") +
        chalk.white("   UMBRELLA CORPORATION API              ") +
        chalk.red("║"));
    console.log(chalk.red("  ║") +
        chalk.gray("   Obedience  ·  Breeds  ·  Prosperity   ") +
        chalk.red("║"));
    console.log(chalk.red("  ╚══════════════════════════════════════════╝"));
    console.log("");
    console.log(chalk.gray("  [ SYS ] ") +
        chalk.white("Raccoon City Data Center — Node 01"));
    console.log(chalk.gray("  [ API ] ") + chalk.white(`http://localhost:${port}`));
    console.log(chalk.gray("  [ ENV ] ") +
        chalk.white(process.env.NODE_ENV ?? "development"));
    console.log(chalk.gray("  [ STA ] ") + chalk.red("● OPERATIONAL"));
    console.log("");
    console.log(chalk.dim("  // All access is monitored and recorded."));
    console.log(chalk.dim("  // Press CTRL-C to terminate the connection.\n"));
});
