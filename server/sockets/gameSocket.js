// server/sockets/gameSocket.js
const pool = require('../db');

// In-memory lobby roster
let lobbyPlayers = [];

module.exports = function(io) {
  io.on('connection', (socket) => {
    // 1) Identify the player from handshake.auth
    const { userId, nickname } = socket.handshake.auth;
    if (!userId || !nickname) {
      console.warn('Socket connected without userId/nickname, disconnecting');
      return socket.disconnect();
    }

    // 2) Manage lobby roster
    if (!lobbyPlayers.some(p => p.userId === userId)) {
      lobbyPlayers.push({ userId, nickname });
    }
    socket.join('lobby');
    socket.emit('existingPlayers', lobbyPlayers);
    io.to('lobby').emit('playerJoined', { userId, nickname });
    console.log(`✅ userId=${userId} (${nickname}) joined lobby:`, lobbyPlayers);

    // 3) Handle Start Game
    socket.on('startGame', async ({ gameId }) => {
      console.log(`⚡ Received startGame (gameId=${gameId}) from userId=${userId}`);

      // Fetch round 1 card
      const cardRes = await pool.query(
        `SELECT * FROM cards WHERE game_id=$1 AND round=1`,
        [gameId]
      );
      const card = cardRes.rows[0];
      if (!card) {
        console.error(`No card found for gameId=${gameId}, round=1`);
        return;
      }

      // Emit gameStarted with first card & countdown
      io.to('lobby').emit('gameStarted', {
        gameId,
        round: 1,
        card,
        countdown: 120
      });
      console.log(`▶️ Emitted gameStarted for gameId=${gameId}, round=1:`, card);

      // Schedule resolution of round 1
      setTimeout(() => resolveRound(gameId, 1), 120 * 1000);
    });

    // 4) Core round logic
    async function resolveRound(gameId, round) {
      // 4a) Determine highest bid
      const bidsRes = await pool.query(
        `SELECT b.user_id, b.bid_amount
         FROM bids b
         WHERE b.game_id=$1 AND b.round=$2
         ORDER BY b.bid_amount DESC
         LIMIT 1`,
        [gameId, round]
      );

      if (bidsRes.rows.length === 0) {
        console.log(`⚪ No bids for gameId=${gameId}, round=${round}`);
        io.to('lobby').emit('roundResult', { round, winner: null, message: 'No bids placed.' });
      } else {
        const { user_id: winnerId, bid_amount } = bidsRes.rows[0];

        // 4b) Fetch card data to apply power/heal/extra_money
        const cardRes = await pool.query(
          `SELECT * FROM cards WHERE game_id=$1 AND round=$2`,
          [gameId, round]
        );
        const { power, heal, extra_money } = cardRes.rows[0];

        // 4c) Update user stats
        await pool.query(
          `UPDATE users
           SET coins = coins - $1 + $4,
               power_points = power_points + $2 + $3
           WHERE id = $5`,
          [bid_amount, power, heal, extra_money, winnerId]
        );

        // 4d) Record the result
        await pool.query(
          `INSERT INTO round_results (game_id, round, winner_id, card_id)
           VALUES ($1, $2, $3, $4)`,
          [gameId, round, winnerId, cardRes.rows[0].id]
        );

        console.log(`🏁 Emitting roundResult for gameId=${gameId}, round=${round}, winnerId=${winnerId}, bid=${bid_amount}`);
        io.to('lobby').emit('roundResult', { round, winner: { id: winnerId }, bid: bid_amount });
      }

      // 4e) Advance or end
      if (round < 10) {
        console.log(`➡️ Scheduling round ${round + 1} for gameId=${gameId}`);
        startNextRound(gameId, round + 1);
      } else {
        const winRes = await pool.query(
          `SELECT id, nickname, power_points
           FROM users
           ORDER BY power_points DESC
           LIMIT 1`
        );
        const champion = winRes.rows[0];
        console.log(`🎉 Game Over for gameId=${gameId}, champion=`, champion);
        io.to('lobby').emit('gameOver', { champion });
      }
    }

    // Helper to start subsequent rounds immediately
    function startNextRound(gameId, round) {
      startRound(gameId, round);
    }

    // Emit roundStarted and schedule its resolution
    async function startRound(gameId, round) {
      const cardRes = await pool.query(
        `SELECT * FROM cards WHERE game_id=$1 AND round=$2`,
        [gameId, round]
      );
      const card = cardRes.rows[0];
      console.log(`🃏 Emitting roundStarted (gameId=${gameId}, round=${round}):`, card);
      io.to('lobby').emit('roundStarted', { round, card, countdown: 120 });
      setTimeout(() => resolveRound(gameId, round), 120 * 1000);
    }

    // 5) Handle bids
    socket.on('bid', async ({ gameId, userId, round, amount }) => {
      try {
        await pool.query(
          `INSERT INTO bids (user_id, game_id, round, bid_amount)
           VALUES ($1,$2,$3,$4)
           ON CONFLICT (user_id, game_id, round) DO NOTHING`,
          [userId, gameId, round, amount]
        );
        console.log(`💸 Recorded bid: userId=${userId}, game=${gameId}, round=${round}, amount=${amount}`);
        socket.emit('bidAck', { round });
      } catch (err) {
        console.error('Bid error:', err);
        socket.emit('bidError', { message: 'Could not record bid.' });
      }
    });

    // 6) Cleanup
    socket.on('disconnect', () => {
      lobbyPlayers = lobbyPlayers.filter(p => p.userId !== userId);
      io.to('lobby').emit('playerLeft', { userId });
      console.log(`❌ userId=${userId} disconnected, lobbyPlayers:`, lobbyPlayers);
    });
  });
};
