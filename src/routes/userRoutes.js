const router = require('express').Router();
const { createUser, getUsers } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize }    = require('../middleware/roleMiddleware');

/**
 * @openapi
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user (MANAGER only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name:     { type: string }
 *               email:    { type: string }
 *               password: { type: string }
 *               role:     { type: string, enum: [MANAGER, SUPPORT, USER] }
 *     responses:
 *       201: { description: User created }
 *       400: { description: Validation error }
 *       403: { description: Forbidden }
 *   get:
 *     tags: [Users]
 *     summary: List all users (MANAGER only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Array of users }
 *       403: { description: Forbidden }
 */
router.post('/',  authenticate, authorize('MANAGER'), createUser);
router.get('/',   authenticate, authorize('MANAGER'), getUsers);

module.exports = router;
