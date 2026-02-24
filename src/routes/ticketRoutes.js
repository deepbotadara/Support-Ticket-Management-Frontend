const router = require('express').Router();
const {
  createTicket,
  getTickets,
  assignTicket,
  updateTicketStatus,
  deleteTicket,
} = require('../controllers/ticketController');
const { addComment, getComments } = require('../controllers/commentController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize }    = require('../middleware/roleMiddleware');

/**
 * @openapi
 * /tickets:
 *   post:
 *     tags: [Tickets]
 *     summary: Create a ticket (USER, MANAGER)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title:       { type: string, minLength: 5 }
 *               description: { type: string, minLength: 10 }
 *               priority:    { type: string, enum: [LOW, MEDIUM, HIGH] }
 *     responses:
 *       201: { description: Ticket created }
 *       400: { description: Validation error }
 *   get:
 *     tags: [Tickets]
 *     summary: List tickets (scope depends on role)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Items per page (max 100)
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [OPEN, IN_PROGRESS, RESOLVED, CLOSED] }
 *         description: Filter by status
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [LOW, MEDIUM, HIGH] }
 *         description: Filter by priority
 *     responses:
 *       200: { description: Paginated array of tickets }
 *
 * /tickets/{id}/assign:
 *   patch:
 *     tags: [Tickets]
 *     summary: Assign ticket (MANAGER, SUPPORT)
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
 *             required: [userId]
 *             properties:
 *               userId: { type: integer }
 *     responses:
 *       200: { description: Ticket assigned }
 *       400: { description: Cannot assign to USER role }
 *       404: { description: Not found }
 *
 * /tickets/{id}/status:
 *   patch:
 *     tags: [Tickets]
 *     summary: Update ticket status (MANAGER, SUPPORT)
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
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [OPEN, IN_PROGRESS, RESOLVED, CLOSED] }
 *     responses:
 *       200: { description: Status updated }
 *       400: { description: Invalid transition }
 *
 * /tickets/{id}:
 *   delete:
 *     tags: [Tickets]
 *     summary: Delete a ticket (MANAGER only)
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
 *
 * /tickets/{id}/comments:
 *   post:
 *     tags: [Comments]
 *     summary: Add comment to ticket
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
 *       201: { description: Comment added }
 *   get:
 *     tags: [Comments]
 *     summary: Get comments for ticket
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Array of comments }
 */

router.post('/',                    authenticate, authorize('USER', 'MANAGER'), createTicket);
router.get('/',                     authenticate, getTickets);
router.patch('/:id/assign',         authenticate, authorize('MANAGER', 'SUPPORT'), assignTicket);
router.patch('/:id/status',         authenticate, authorize('MANAGER', 'SUPPORT'), updateTicketStatus);
router.delete('/:id',               authenticate, authorize('MANAGER'), deleteTicket);
router.post('/:id/comments',        authenticate, addComment);
router.get('/:id/comments',         authenticate, getComments);

module.exports = router;
