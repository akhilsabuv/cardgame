-- 1) Ensure a game row exists (game_id = 1)
INSERT INTO games (id, started_at)
VALUES (1, NOW())
ON CONFLICT (id) DO NOTHING;

-- 2) Populate 10 cards for that game
INSERT INTO cards (game_id, round, power, heal, extra_money) VALUES
  (1, 1, 5,  2, 3),
  (1, 2, 3,  5, 1),
  (1, 3, 4,  4, 2),
  (1, 4, 6,  1, 4),
  (1, 5, 2,  6, 0),
  (1, 6, 7,  3, 2),
  (1, 7, 4,  2, 5),
  (1, 8, 3,  3, 3),
  (1, 9, 8,  1, 1),
  (1, 10,5,  5, 5)
ON CONFLICT (game_id, round) DO NOTHING;
