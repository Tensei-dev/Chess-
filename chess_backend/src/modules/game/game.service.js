import { Chess } from "chess.js";
import * as repo from "./game.repository.js";

export const createNewGame = async () => {
  const chess = new Chess();
  return await repo.createGame(chess.fen());
};

export const getGame = async (id) => {
  return await repo.getGameById(id);
};

export const makeMove = async (gameId, moveData) => {
  const game = await repo.getGameById(gameId);

  if (!game) throw new Error("Game not found");

  const chess = new Chess(game.fen);

  const move = chess.move(moveData);

  if (!move) return null;

  await repo.insertMove(gameId, move.san);

  let status = "ONGOING";

  if (chess.isCheckmate()) status = "FINISHED";
  else if (chess.isDraw()) status = "DRAW";

  await repo.updateGame(
    gameId,
    chess.fen(),
    status,
    chess.turn() === "w" ? "WHITE" : "BLACK",
  );

  return {
    fen: chess.fen(),
    status,
    turn: chess.turn(),
  };
};
