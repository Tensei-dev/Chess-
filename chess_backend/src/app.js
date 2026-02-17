import express from "express";
import gameRoutes from "./modules/game/game.controller.js";

const app = express();

app.use(express.json());
app.use("/games", gameRoutes);

export default app;
