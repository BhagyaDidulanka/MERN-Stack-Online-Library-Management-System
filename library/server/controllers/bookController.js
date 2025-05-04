import Book from "../models/Book.js";
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const addBook = async (req, res) => {
  const { title, author, category, description, availableCopies } = req.body;
  const coverImage = req.file?.path;

  const book = new Book({ title, author, category, description, availableCopies, coverImage });

  const createdBook = await book.save();
  res.status(201).json(createdBook);
};

export const getBooks = async (req, res) => {
  const { search, category } = req.query;
  let query = {};

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }
  if (category) {
    query.category = category;
  }

  const books = await Book.find(query);
  res.json(books);
};

export const getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) res.json(book);
  else {
    res.status(404);
    throw new Error('Book not found');
  }
};

export const updateBook = async (req, res) => {
  const { title, author, category, description, availableCopies } = req.body;
  const book = await Book.findById(req.params.id);

  if (book) {
    book.title = title || book.title;
    book.author = author || book.author;
    book.category = category || book.category;
    book.description = description || book.description;
    book.availableCopies = availableCopies || book.availableCopies;
    if (req.file) {
      book.coverImage = req.file.path;
    }

    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    
    if (book.coverImage) {
      const filePath = path.resolve(__dirname, '..', 'uploads', path.basename(book.coverImage));
      try {
        await fs.promises.unlink(filePath);
      } catch (err) {
        console.error("Error deleting cover image:", err);
        
      }
    }

    
    await Book.findByIdAndDelete(id);

    res.json({ message: "Book removed successfully" });

  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

