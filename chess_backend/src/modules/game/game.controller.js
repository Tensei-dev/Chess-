import express from "express";
import * as service from "./game.service.js";

const router = express.Router();


/**
 * Criar novo jogo
 */
router.post("/", async (req, res) => {

  try {

    const game = await service.createNewGame();

    res.status(201).json(game);

  } catch (err) {

    console.error("Error creating game:", err);

    res.status(500).json({
      error: err.message
    });

  }

});


/**
 * Buscar jogo
 */
router.get("/:id", async (req, res) => {

  try {

    const game = await service.getGame(req.params.id);

    if (!game)
      return res.status(404).json({
        error: "Game not found"
      });

    res.json(game);

  } catch (err) {

    console.error("Error fetching game:", err);

    res.status(500).json({
      error: err.message
    });

  }

});


/**
 * Movimento humano
 */
router.post("/:id/move", async (req, res) => {

  try {

    const result = await service.makeMove(
      req.params.id,
      req.body
    );

    if (!result)
      return res.status(400).json({
        error: "Invalid move"
      });

    res.json(result);

  } catch (err) {

    console.error("Error making move:", err);

    res.status(500).json({
      error: err.message
    });

  }

});


/**
 * Movimento robô
 */
router.post("/:id/robot", async (req, res) => {

  try {

    const result =
      await service.makeRobotMove(req.params.id);

    if (!result)
      return res.status(400).json({
        error: "Robot move failed"
      });

    res.json(result);

  } catch (err) {

    console.error("Robot move error:", err);

    res.status(500).json({
      error: err.message
    });

  }

});


export default router;
