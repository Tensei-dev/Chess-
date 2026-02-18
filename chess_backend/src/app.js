import express from "express";
import cors from "cors";
import gameRoutes from "./modules/game/game.controller.js";

const app = express();

app.use(cors()); //Habilitar cors para conexão com porta do frontend


app.use(express.json());
app.use("/game", gameRoutes);

export default app;
