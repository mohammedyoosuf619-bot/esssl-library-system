const express = require('express');
const router = express.Router();
const { issueBook, returnBook, getBorrowings, getBorrowingStats } = require('../controllers/borrowingController');
const { protect, librarian } = require('../middleware/auth');

router.get('/stats', protect, librarian, getBorrowingStats);
router.get('/', protect, getBorrowings);
router.post('/issue', protect, librarian, issueBook);
router.put('/return/:id', protect, librarian, returnBook);

module.exports = router;