import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },

    subject: {
      type: String,
      required: true,
    },

    unit: {
      type: String,
      required: true,
    },

    semester: {
      type: String,
      required: true,
    },

    teacherName: {
      type: String,
      required: true,
    },

    downloadLink: {
      type: String,
      required: true,
    },
    downloads: {
      type: String,
      required: true,
      default: 0,
    },
    viewLink: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Notes", notesSchema);
