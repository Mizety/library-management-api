const Book = require('../models/Book');
const { isValidISBN ,isValidDate} = require('../utils/regex');
exports.addBook = async (req, res) => {
  // Destructure required fields from request body
  const { title, author, ISBN, publicationDate, genre, copies } = req.body;

  // Validate ISBN format
  if (!isValidISBN.test(ISBN)) {
    return res.status(400).json({ error: 'Invalid ISBN format' });
  }

  // Check mandatory fields
  if (!title || !author || !ISBN) {
    return res.status(400).json({ error: 'Title, author, and ISBN are required fields' });
  }

  if (!isValidDate.test(publicationDate)) {
    return res.status(400).json({ error: 'Invalid publication date format. Must be YYYY-MM-DD' });
  }
  try {
    // Create new Book instance

    const existingBook = await Book.findOne({ title, author });
    if (existingBook) {
      return res.status(400).json({ error: 'Book with this title already exists for this author' });
    }
    const book = new Book({ title, author, ISBN, publicationDate, genre, copies });

    // Save book to database
    await book.save();

  
   return res.status(201).json(book);
  } catch (error) {
    // Handle database errors or other exceptions
  return  res.status(400).json({ error: error.message });
  }
};
exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, ISBN, publicationDate, genre, copies } = req.body;
  try {
    const book = await Book.findByIdAndUpdate(
      id,
      { title, author, ISBN, publicationDate, genre, copies },
      { new: true, runValidators: true }
    );
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
   return res.json(book);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    return res.json({ message: 'Book deleted' });
  } catch (error) {
   return  res.status(400).json({ error: error.message });
  }
};
exports.listBooks = async (req, res) => {
  const { genre, author, page = 1, limit = 10 } = req.query;

  try {
    // Pipeline stages for aggregation
    const pipeline = [];

    // Match stage for filtering based on genre and/or author
    const matchStage = {};
    if (genre) matchStage.genre = genre;
    if (author) matchStage.author = author;
    pipeline.push({ $match: matchStage });

    // Sort stage to ensure consistent pagination results
    pipeline.push({ $sort: { _id: 1 } });

    // Pagination: Skip and Limit stages
    const skip = (Number(page) - 1) * Number(limit);
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: Number(limit) });

    // Counting documents matching the query
    const countPipeline = [...pipeline]; // Clone pipeline for counting
    countPipeline.push({ $count: 'totalCount' });
    const countResult = await Book.aggregate(countPipeline);

    // Execute main aggregation pipeline to fetch books
    const books = await Book.aggregate(pipeline);

    // Extract totalCount from countResult or default to 0 if no books
    const totalCount = countResult.length > 0 ? countResult[0].totalCount : 0;

    // Return response with pagination and books data
   return  res.status(200).json({
      totalCount,
      page: Number(page),
      limit: Number(limit),
      books
    });
  } catch (error) {
   return res.status(400).json({ error: error.message });
  }
};
exports.getBookById = async (req, res) => {
  const { bookId } = req.params; // Assuming bookId is passed as a URL parameter

  try {
    const book = await Book.findById(bookId);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Return the book details
  return  res.json(book);
  } catch (error) {
   return res.status(400).json({ error: error.message });
  }
};