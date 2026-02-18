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

// Atrasar movimento do robô
const delay = (ms) =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Faz o movimento do robô automaticamente
 */

export const makeRobotMove = async (gameId) => {

  await delay(800);
  const game = await repo.getGameById(gameId);

  if (!game)
    throw new Error("Game not found");

  // carrega tabuleiro atual
  const chess = new Chess(game.fen);

  /**
   * gera todos movimentos possíveis
   * ex:
   * [ 'e4', 'd4', 'Nf3', ... ]
   */
  const moves = chess.moves({ verbose: true });

  // nenhum movimento possível
  if (moves.length === 0)
    return null;

  /**
   * escolhe movimento aleatório
   */
  const randomMove =
    moves[Math.floor(Math.random() * moves.length)];

  /**
   * aplica movimento
   */
  const moveResult =
    chess.move(randomMove);

  /**
   * salva no banco
   */
  await repo.insertMove(
    gameId,
    moveResult.san
  );

  /**
   * define status
   */
  let status = "ONGOING";

  if (chess.isCheckmate())
    status = "FINISHED";

  else if (chess.isDraw())
    status = "DRAW";

  /**
   * atualiza estado do jogo
   */
  await repo.updateGame(

    gameId,

    chess.fen(),

    status,

    chess.turn() === "w"
      ? "WHITE"
      : "BLACK"
  );



  /**
   * retorna movimento
   */
  return {

    from: moveResult.from,

    to: moveResult.to,

    san: moveResult.san,

    fen: chess.fen(),

    status,

    turn: chess.turn()

  };

};
