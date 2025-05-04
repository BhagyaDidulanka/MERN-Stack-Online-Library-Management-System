import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";

export const borrowBook = async (req, res) => {
  const { bookId } = req.body;

  const book = await Book.findById(bookId);

  if (!book || book.availableCopies < 1) {
    res.status(400);
    throw new Error("Book not available");
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14); // 2 weeks

  const borrow = new Borrow({
    user: req.user._id,
    book: bookId,
    dueDate,
  });

  await borrow.save();
  book.availableCopies -= 1;
  await book.save();

  res.status(201).json(borrow);
};

export const returnBook = async (req, res) => {
  const borrow = await Borrow.findById(req.params.id).populate('book');

  if (!borrow || borrow.returned) {
    res.status(400);
    throw new Error("Invalid borrow ID");
  }

  const now = new Date();
  let fine = 0;
  if (now > borrow.dueDate) {
    const lateDays = Math.ceil((now - borrow.dueDate) / (1000 * 60 * 60 * 24));
    fine = lateDays * 10; // 10 units per day late
  }

  borrow.returnDate = now;
  borrow.returned = true;
  borrow.fine = fine;

  await borrow.save();

  const book = await Book.findById(borrow.book._id);
  book.availableCopies += 1;
  await book.save();

  res.json(borrow);
};

export const userBorrowHistory = async (req, res) => {
  const history = await Borrow.find({ user: req.user._id }).populate('book');
  res.json(history);
};

export const allBorrows = async (req, res) => {
  const borrows = await Borrow.find().populate('user').populate('book');
  res.json(borrows);
};
