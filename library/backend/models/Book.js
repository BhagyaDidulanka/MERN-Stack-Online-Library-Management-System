import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  category: { type: String },
  description: { type: String },
  coverImage: { type: String }, // Path to uploaded image
  availableCopies: { type: Number, default: 1 },
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
export default Book;
