import express from "express";
import { borrowBook, returnBook, userBorrowHistory, allBorrows } from "../controllers/borrowController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js"; 

const router = express.Router();

router.post("/borrow", protect, borrowBook);
router.put("/return/:id", protect, returnBook);
router.get("/history", protect, userBorrowHistory);
router.get("/all", protect, allowRoles('admin', 'librarian'), allBorrows); 

export default router;
