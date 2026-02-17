import pool from "../../config/db.js";

// Criar novo jogo
export const createGame = async (fen) => {
  const result = await pool.query(
    `
    INSERT INTO games (fen, status, current_turn)
    VALUES ($1, 'ONGOING', 'WHITE')
    RETURNING *
    `,
    [fen],
  );

  return result.rows[0];
};

// Buscar jogo por ID
export const getGameById = async (id) => {
  const result = await pool.query(
    `
    SELECT * FROM games
    WHERE id = $1
    `,
    [id],
  );

  return result.rows[0];
};

// Atualizar jogo após movimento
export const updateGame = async (id, fen, status, turn) => {
  await pool.query(
    `
    UPDATE games
    SET fen = $1,
        status = $2,
        current_turn = $3
    WHERE id = $4
    `,
    [fen, status, turn, id],
  );
};

export const insertMove = async (gameId, move) => {
  await pool.query(
    `
    INSERT INTO moves (game_id, move)
    VALUES ($1, $2)
    `,
    [gameId, move],
  );
};
