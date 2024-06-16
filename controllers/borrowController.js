const Book = require("../models/Book");

const Borrow = require("../models/Borrow");

exports.borrowBook = async (req, res) => {
  const userId = req.user._id;
  const { bookId } = req.body;
  try {
    const book = await Book.findById(bookId);
    if (!book || book.copies <= 0) {
      return res.status(400).json({ error: "Book not available" });
    }

    const borrow = new Borrow({ user: userId, book: bookId });
    await borrow.save();
    book.copies -= 1;
    await book.save();

    return res.status(201).json(borrow);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
exports.returnBook = async (req, res) => {
  const { id } = req.params;
  try {
    const borrow = await Borrow.findById(id).populate("book");
    if (!borrow || borrow.returnDate) {
      return res.status(400).json({ error: "Invalid borrow record" });
    }

    borrow.returnDate = new Date();
    await borrow.save();
    borrow.book.copies += 1;
    await borrow.book.save();

    return res.json(borrow);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.borrowHistory = async (req, res) => {
  const userId = req.user._id;
  try {
    const history = await Borrow.aggregate([
      { $match: { user: userId } }, // Filter by user
      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $group: {
          _id: "$user",
          totalBorrows: { $sum: 1 }, // Count total borrows
          booksBorrowed: { $addToSet: "$bookDetails._id" }, // Collect unique book IDs
          history: {
            $push: {
              _id: "$_id",
              borrowDate: "$borrowDate",
              bookDetails: {
                _id: "$bookDetails._id",
                copies: "$bookDetails.copies",
                title: "$bookDetails.title",
                author: "$bookDetails.author",
                ISBN: "$bookDetails.ISBN",
                publicationDate: "$bookDetails.publicationDate",
                genre: "$bookDetails.genre",
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalBorrows: 1,
          count: { $size: "$booksBorrowed" }, // Count unique books borrowed
          history: 1,
        },
      },
    ]);

    // Extract the history array from the result
    const userHistory = history.length > 0 ? history[0] : null;

    return res.json(userHistory);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


exports.mostBorrowedBooks = async (req, res) => {
  try {
    const mostBorrowedBooks = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          borrowCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $project: {
          _id: "$bookDetails._id",
          title: "$bookDetails.title",
          author: "$bookDetails.author",
          ISBN: "$bookDetails.ISBN",
          genre: "$bookDetails.genre",
          borrowCount: 1,
        },
      },
      { $sort: { borrowCount: -1 } },
    ]);

    return res.json(mostBorrowedBooks);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


exports.activeMembers = async (req, res) => {
  try {
    const activeMembers = await Borrow.aggregate([
      {
        $group: {
          _id: "$user",
          borrowCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: "$userDetails._id",
          username: "$userDetails.username",
          email: "$userDetails.email",
          borrowCount: 1,
        },
      },
      { $sort: { borrowCount: -1 } },
    ]);

    return res.json(activeMembers);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


exports.bookAvailability = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const borrowedBooks = await Borrow.countDocuments({ returnDate: null });
    const availableBooks = totalBooks - borrowedBooks;

    return res.json({
      totalBooks,
      borrowedBooks,
      availableBooks,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
