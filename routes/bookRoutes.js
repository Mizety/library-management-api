const express = require('express');
const { addBook, updateBook, deleteBook, listBooks,getBookById } = require('../controllers/bookController');
const { protect, admin, member } = require('../middlewares/auth');
const router = express.Router();

router.post('/', protect, admin, addBook);
router.put('/:id', protect, admin, updateBook);
router.delete('/:id', protect, admin, deleteBook);
router.get('/', protect, listBooks); // Protected route for listing books

router.get('/:bookId', protect,member,admin, getBookById);

module.exports = router;
