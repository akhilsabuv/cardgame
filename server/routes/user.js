const express = require('express');
const auth = require('../auth/middleware');
const { handleGetMe } = require('../controllers/userController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile
 */

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Get current user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User info (id, email, nickname, coins, power_points)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 nickname:
 *                   type: string
 *                 coins:
 *                   type: integer
 *                 power_points:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/me', auth, handleGetMe);

module.exports = router;
