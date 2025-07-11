const express = require('express');
const { handleSignup, handleLogin } = require('../controllers/authController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, nickname, password]
 *             properties:
 *               email:
 *                 type: string
 *               nickname:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created (returns id)
 *       400:
 *         description: User exists
 */
router.post('/signup', handleSignup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token returned
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', handleLogin);

module.exports = router;
