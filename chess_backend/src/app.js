import express from "express";
import gameRoutes from "./modules/game/game.controller.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/games", gameRoutes);

export default app;
