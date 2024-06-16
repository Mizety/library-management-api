const express = require('express');
const { borrowBook, returnBook, borrowHistory, mostBorrowedBooks, activeMembers, bookAvailability } = require('../controllers/borrowController');
const { protect, member } = require('../middlewares/auth');

const router = express.Router();

// POST /api/borrows - Borrow a book
router.post('/', protect, member, borrowBook);

// PUT /api/borrows/:id - Return a borrowed book
router.put('/:id', protect, member, returnBook);

// GET /api/borrows/history - Get borrow history
router.get('/history', protect, member, borrowHistory);

// GET /api/borrows/most-borrowed-books - Get most borrowed books
router.get('/most-borrowed-books', protect, member, mostBorrowedBooks);

// GET /api/borrows/active-members - Get active members based on borrowing history
router.get('/active-members', protect, member, activeMembers);

// GET /api/borrows/book-availability - Get summary report of book availability
router.get('/book-availability', protect, member, bookAvailability);

module.exports = router;
