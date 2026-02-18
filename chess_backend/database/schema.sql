CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE color AS ENUM ('WHITE', 'BLACK');

CREATE TYPE game_status AS ENUM (
    'WAITING',
    'ONGOING',
    'FINISHED',
    'DRAW'
);

CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fen TEXT NOT NULL,
    status game_status NOT NULL DEFAULT 'WAITING', 
    current_turn color NOT NULL DEFAULT 'WHITE',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE game_players(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    color color NOT NULL,
    UNIQUE(game_id, color)
);

CREATE TABLE moves(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    move VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
