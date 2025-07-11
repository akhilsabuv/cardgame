/**
 * @swagger
 * tags:
 *   name: Sockets
 *   description: Real-time WebSocket events
 */

/**
 * @swagger
 * /socket/joinLobby:
 *   post:
 *     summary: Client emits `joinLobby`
 *     description: Player joins the game lobby room.
 *     tags: [Sockets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user joining.
 *     responses:
 *       200:
 *         description: Broadcasts `playerJoined` to lobby.
 */

/**
 * @swagger
 * /socket/startGame:
 *   post:
 *     summary: Client emits `startGame`
 *     description: Admin (or first player) starts the 10-round game.
 *     tags: [Sockets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gameId
 *             properties:
 *               gameId:
 *                 type: integer
 *                 description: The ID of the game session.
 *     responses:
 *       200:
 *         description: Emits `gameStarted`, then begins round 1 with `roundStarted` events.
 */

/**
 * @swagger
 * /socket/roundStarted:
 *   post:
 *     summary: Server emits `roundStarted`
 *     description: Announces the start of a round, shows the card and timer.
 *     tags: [Sockets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               round:
 *                 type: integer
 *               card:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   power:
 *                     type: integer
 *                   heal:
 *                     type: integer
 *                   extra_money:
 *                     type: integer
 *               countdown:
 *                 type: integer
 *                 description: Seconds remaining.
 *     responses:
 *       200:
 *         description: Clients display the card and timer.
 */

/**
 * @swagger
 * /socket/bid:
 *   post:
 *     summary: Client emits `bid`
 *     description: Player submits a hidden bid for the current round.
 *     tags: [Sockets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gameId
 *               - userId
 *               - round
 *               - amount
 *             properties:
 *               gameId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *               round:
 *                 type: integer
 *               amount:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Acknowledges with `bidAck`.
 */

/**
 * @swagger
 * /socket/roundResult:
 *   post:
 *     summary: Server emits `roundResult`
 *     description: Announces winner of the round or void if no bids.
 *     tags: [Sockets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               round:
 *                 type: integer
 *               winner:
 *                 type: object
 *                 nullable: true
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *               bid:
 *                 type: integer
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Clients update UI with round outcome.
 */

/**
 * @swagger
 * /socket/gameOver:
 *   post:
 *     summary: Server emits `gameOver`
 *     description: Announces final champion after round 10.
 *     tags: [Sockets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               champion:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   power_points:
 *                     type: integer
 *     responses:
 *       200:
 *         description: Clients display final leaderboard.
 */
