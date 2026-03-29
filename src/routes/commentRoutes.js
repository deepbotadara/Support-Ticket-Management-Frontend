const router = require('express').Router();
const { updateComment, deleteComment } = require('../controllers/commentController');
const { authenticate } = require('../middleware/authMiddleware');

router.patch('/:id',  authenticate, updateComment);
router.delete('/:id', authenticate, deleteComment);

module.exports = router;
