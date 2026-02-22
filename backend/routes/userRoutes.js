const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUser } = require('../controllers/userController');
const { protect, librarian } = require('../middleware/auth');

router.get('/', protect, librarian, getUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);

module.exports = router;