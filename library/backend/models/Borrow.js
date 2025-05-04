import mongoose from "mongoose";

const borrowSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  borrowDate: { type: Date, default: Date.now },
  returnDate: { type: Date },
  dueDate: { type: Date },
  fine: { type: Number, default: 0 },
  returned: { type: Boolean, default: false },
});

const Borrow = mongoose.model("Borrow", borrowSchema);
export default Borrow;
