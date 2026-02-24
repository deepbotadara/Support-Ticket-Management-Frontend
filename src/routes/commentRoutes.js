const router = require('express').Router();
const { updateComment, deleteComment } = require('../controllers/commentController');
const { authenticate } = require('../middleware/authMiddleware');

/**
 * @openapi
 * /comments/{id}:
 *   patch:
 *     tags: [Comments]
 *     summary: Edit a comment (MANAGER or author)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [comment]
 *             properties:
 *               comment: { type: string }
 *     responses:
 *       200: { description: Updated comment }
 *       403: { description: Forbidden }
 *       404: { description: Not found }
 *   delete:
 *     tags: [Comments]
 *     summary: Delete a comment (MANAGER or author)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Deleted }
 *       403: { description: Forbidden }
 *       404: { description: Not found }
 */

router.patch('/:id',  authenticate, updateComment);
router.delete('/:id', authenticate, deleteComment);

module.exports = router;
