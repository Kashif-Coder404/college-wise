import express from "express";
import cors from "cors";
import User from "./models/User.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import mongoose from "mongoose";
import Notes from "./models/Notes.js";
const mongouri = process.env.MONGO_DB;
const admin = process.env.ADMIN_USER;
const adminPass = process.env.ADMIN_PASS;

mongoose
  .connect(mongouri)
  .then(() => {
    console.log("DB CONNCETED SUCCESSFULLY 😊");
  })
  .catch((err) => {
    console.error("DB NOT CONNECTED! 🫠", err);
  });
const app = express();
const PORT = process.env.PORT || 8000;

// --- Middleware ---

// 1. CORS Configuration: Allows your Next.js frontend to talk to this API
app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.31.116:3000"], // Replace with your Next.js URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// 2. Body Parser: Allows Express to read JSON data from requests
app.use(express.json());

// --- Routes ---

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to CollegeHelp API" });
});
app.get("/notes/download", async (req, res) => {
  try {
    const id = req.query.id || "";
    const toDownload = await Notes.findOne({ _id: id });

    if (!toDownload) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Increase downloads
    toDownload.downloads = Number(toDownload.downloads) + 1;

    // SAVE in database
    await toDownload.save();
    console.log(toDownload.downloads);
    res.status(200).json({
      success: true,
      downloadLink: toDownload.downloadLink,
      downloads: toDownload.downloads,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
app.get("/notes", async (req, res) => {
  try {
    const search = req.query.search || "";

    const notes = await Notes.find({
      $or: [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          unit: {
            $regex: search,
            $options: "i",
          },
        },
        {
          subject: {
            $regex: search,
            $options: "i",
          },
        },
        {
          semester: {
            $regex: search,
            $options: "i",
          },
        },
        {
          teacherName: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    });

    res.status(200).json({
      success: true,
      notes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
app.post("/notes/filter", async (req, res) => {
  try {
    const filters = req.body;
    let query = {};
    //Subject Filter
    if (filters.subject) {
      query.subject = {
        $regex: filters.subject,
        $options: "i",
      };
    }
    if (filters.semester) {
      query.semester = Number(filters.semester);
    }
    if (filters.unit) {
      query.unit = Number(filters.unit);
    }

    const filteredNotes = await Notes.find(query);

    res.status(200).json({ notes: filteredNotes });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});
app.get("/notes/latest", async (req, res) => {
  try {
    const notes = await Notes.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notes,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === admin && password === adminPass) {
    return res.json({
      token: "admin-token",
    });
  }

  res.status(401).json({
    message: "Invalid credentials",
  });
});
app.post("/admin/notes", async (req, res) => {
  const noteData = req.body;
  try {
    const isExist = await Notes.findOne({
      downloadLink: noteData.downloadLink,
    });
    if (isExist) {
      return res.status(400).json({ message: "Note Already Exists" });
    }
    const newNote = await Notes.create(noteData);

    console.log("Note has been created: ", newNote);
    res.status(200).json({ createdNote: newNote });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
app.get("/admin/notes", async (req, res) => {
  const noteData = await Notes.find();
  try {
    console.log(noteData);
    res.status(200).json({ notes: noteData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
app.delete("/admin/notes/:id", async (req, res) => {
  try {
    const noteID = req.params.id;
    console.log("NoteID", noteID);
    if (!noteID) {
      return res.status(500).json({ message: "ID Error" });
    }
    const doc = await Notes.deleteOne({ _id: noteID });
    console.log(doc);
    res.status(200).json({ message: "Deletion Successfull" });
  } catch (error) {
    console.log("Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});
// Example Route: Handle Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found! Please signup first." });
    }

    // 2. Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    // 3. Success response
    res.status(200).json({
      success: true,
      message: "Login successful!",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (err) {
    console.log("Error while login:", err);
    res.status(500).json({
      message: "Server error during login",
    });
  }
});

//Handle Signup

app.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password, course, semester } = req.body;
    console.log(`Sign up for : `, email);
    const isExist = await User.findOne({ email });
    if (isExist)
      return res
        .status(400)
        .json({ message: "User already existed! Try Login!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      course,
      semester,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "Student registered successfully!", name: fullName });
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ message: `Error during Signup: ${err}` });
  }
});

// --- Server Start ---

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running port: ${PORT}`);
});
