import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;
const JWT_KEY = process.env.JWT_SECRET;

// Middleware
app.use(express.json());
app.use(cors());
// DB Connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    message: "Testing Server Running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
