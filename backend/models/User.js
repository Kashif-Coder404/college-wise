import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  course: { type: String, required: true },
  semester: { type: String, requireed: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
