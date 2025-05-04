import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js"; 
import { getAllUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/", protect, allowRoles('admin', 'librarian'), getAllUsers); 

export default router;
