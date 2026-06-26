import express from "express";
import authMiddleware, { requireAdmin } from "../middleware/authMiddleware.js";
import { adminLogin, getAllUsers, deleteUser as deleteAdminUser } from "../controllers/adminController.js";
import { uploadNote, deleteNote, latestNotes } from "../controllers/notesController.js";

const router = express.Router();


// Admin Login Route
router.post("/login", adminLogin);

// Admin Notes Routes (Protected by both auth and admin check)
router.get("/notes", authMiddleware, requireAdmin, latestNotes);
router.post("/notes", authMiddleware, requireAdmin, uploadNote);
router.delete("/notes/:id", authMiddleware, requireAdmin, deleteNote);

// Admin User Management Routes (Protected)
router.get("/users", authMiddleware, requireAdmin, getAllUsers);
router.delete("/users/:id", authMiddleware, requireAdmin, deleteAdminUser);

export default router;
