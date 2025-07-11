-- 1. Users table: stores registered players
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nickname TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  coins INT NOT NULL DEFAULT 1000,
  power_points INT NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Games table: one row per game session
CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Cards table: 10 cards generated per game (unique per round)
CREATE TABLE IF NOT EXISTS cards (
  id SERIAL PRIMARY KEY,
  game_id INT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  round INT NOT NULL,
  power INT NOT NULL,
  heal INT NOT NULL,
  extra_money INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT cards_game_round_unique UNIQUE (game_id, round)
);
CREATE INDEX IF NOT EXISTS idx_cards_game_round ON cards(game_id, round);

-- 4. Bids table: one row per player bid per round
CREATE TABLE IF NOT EXISTS bids (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id INT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  round INT NOT NULL,
  bid_amount INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT bids_unique_bid UNIQUE (user_id, game_id, round)
);
CREATE INDEX IF NOT EXISTS idx_bids_game_round ON bids(game_id, round);

-- 5. Round results: tracks which user won each round
CREATE TABLE IF NOT EXISTS round_results (
  id SERIAL PRIMARY KEY,
  game_id INT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  round INT NOT NULL,
  winner_id INT REFERENCES users(id) ON DELETE SET NULL,
  card_id INT REFERENCES cards(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT round_results_unique UNIQUE (game_id, round)
);
CREATE INDEX IF NOT EXISTS idx_results_game_round ON round_results(game_id, round);