const express = require('express');
const router = express.Router();
const { loginUser, registerUser, updateProfile } = require('../controllers/authController');
const { protect, librarian } = require('../middleware/auth');

router.post('/login', loginUser);
router.post('/register', protect, librarian, registerUser);
router.put('/profile', protect, updateProfile);

module.exports = router;