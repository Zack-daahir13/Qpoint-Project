// controllers/bookController.js
const Book = require('../models/Books'); // Corrected import to match the model name
const path = require('path');
const fs = require('fs');

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const { title, author, category } = req.body;
    const bookFilePath = '/uploads/books/' + req.files['bookFile'][0].filename; // Ensure this matches your upload directory
    const coverImagePath = '/uploads/covers/' + req.files['coverImage'][0].filename; // Same here

    const book = new Book({
      title,
      author,
      category,
      bookFilePath,
      coverImagePath,
      userId: req.user._id // Ensure req.user is populated (e.g., via authentication middleware)
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Error fetching books' }); 
  }
};

// Get a single book
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Error fetching book' });
  }
};

// Download a book
exports.downloadBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const filePath = path.join(__dirname, '..', book.bookFilePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Book file not found' });
    }

    res.download(filePath, `${book.title}.pdf`);
  } catch (error) {
    console.error('Error downloading book:', error);
    res.status(500).json({ message: 'Error downloading book' });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req .params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user is authorized to update
    if (book.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      book[key] = updates[key];
    });

    await book.save();
    res.status(200).json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Error updating book' });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user is authorized to delete
    if (book.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete associated files
    if (book.bookFilePath) {
      fs.unlinkSync(path.join(__dirname, '..', book.bookFilePath));
    }
    if (book.coverImagePath) {
      fs.unlinkSync(path.join(__dirname, '..', book.coverImagePath));
    }

    await book.remove();
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Error deleting book' });
  }
};