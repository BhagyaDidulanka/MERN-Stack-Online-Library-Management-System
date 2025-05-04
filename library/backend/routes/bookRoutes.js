import express from "express";
import multer from "multer";
import { protect, librarian } from "../middlewares/authMiddleware.js";
import { addBook, getBooks, getBookById, updateBook, deleteBook } from "../controllers/bookController.js";

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.route("/")
  .get(getBooks)
  .post(protect, librarian, upload.single('coverImage'), addBook);

router.route("/:id")
  .get(getBookById)
  .put(protect, librarian, upload.single('coverImage'), updateBook)
  .delete(protect, librarian, deleteBook);

export default router;

