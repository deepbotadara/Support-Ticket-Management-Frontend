const router = require('express').Router();
const { createUser, getUsers } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize }    = require('../middleware/roleMiddleware');
router.post('/',  authenticate, authorize('MANAGER'), createUser);
router.get('/',   authenticate, authorize('MANAGER'), getUsers);

module.exports = router;
