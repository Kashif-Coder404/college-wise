import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import { signupUser, loginUser, forgotPassword, resetPassword, verifySignupOTP } from "../controllers/authController.js";

const router = express.Router();

// Signup Route
router.post("/signup", signupUser);

// Verify OTP Route
router.post("/verify-otp", verifySignupOTP);

// Login Route
router.post("/login", loginUser);

// Forgot Password Route
router.post("/forgot-password", forgotPassword);

// Reset Password Route
router.post("/reset-password", resetPassword);

//Profile
router.get("/profile", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected route accessed",
    user: req.user,
  });
});
export default router;
