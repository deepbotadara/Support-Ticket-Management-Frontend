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

router.post('/',                    authenticate, authorize('USER', 'MANAGER'), createTicket);
router.get('/',                     authenticate, getTickets);
router.patch('/:id/assign',         authenticate, authorize('MANAGER', 'SUPPORT'), assignTicket);
router.patch('/:id/status',         authenticate, authorize('MANAGER', 'SUPPORT'), updateTicketStatus);
router.delete('/:id',               authenticate, authorize('MANAGER'), deleteTicket);
router.post('/:id/comments',        authenticate, addComment);
router.get('/:id/comments',         authenticate, getComments);

module.exports = router;
