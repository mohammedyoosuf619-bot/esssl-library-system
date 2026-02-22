const express = require('express');
const router = express.Router();
const { addBook, getBooks, getBookById, updateBook, deleteBook } = require('../controllers/bookController');
const { protect, librarian } = require('../middleware/auth');

router.route('/')
    .get(protect, getBooks)
    .post(protect, librarian, addBook);

router.route('/:id')
    .get(protect, getBookById)
    .put(protect, librarian, updateBook)
    .delete(protect, librarian, deleteBook);

module.exports = router;