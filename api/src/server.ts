import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { AppRoutes } from "./routes/routes";
import chalk from "chalk";
import figlet from "figlet";


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
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.get("/", (req, res) => {
  res.json({
    message: [
      "Welcome to the Umbrella Corporation API",
      'Routes'
     

    ],
  });
});

//---- Definir rutas ----
app.use(AppRoutes.routes)

// Handle errors middleware

//Acceso a las imágenes

process.on("SIGINT", () => {
  console.clear();
  process.exit();
});




app.listen(port, () => {

  // Logo ASCII grande
  console.log(
    chalk.red(
      figlet.textSync("UMBRELLA", {
        font: "Big",
        horizontalLayout: "full",
      })
    )
  );


  console.log(chalk.red("  ╔══════════════════════════════════════════╗"));
  console.log(chalk.red("  ║") + chalk.white("   UMBRELLA CORPORATION API              ") + chalk.red("║"));
  console.log(chalk.red("  ║") + chalk.gray("   Obedience  ·  Breeds  ·  Prosperity   ") + chalk.red("║"));
  console.log(chalk.red("  ╚══════════════════════════════════════════╝"));

  console.log("");
  console.log(chalk.gray("  [ SYS ] ") + chalk.white("Raccoon City Data Center — Node 01"));
  console.log(chalk.gray("  [ API ] ") + chalk.white(`http://localhost:${port}`));
  console.log(chalk.gray("  [ ENV ] ") + chalk.white(process.env.NODE_ENV ?? "development"));
  console.log(chalk.gray("  [ STA ] ") + chalk.red("● OPERATIONAL"));
  console.log("");
  console.log(chalk.dim("  // All access is monitored and recorded."));
  console.log(chalk.dim("  // Press CTRL-C to terminate the connection.\n"));
});
