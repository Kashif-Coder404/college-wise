import express from "express";

import {
  downloadNote,
  filterNotes,
  latestNotes,
  notes,
} from "../controllers/notesController.js";

const router = express.Router();

router.get("/download", downloadNote);
router.get("/getNotes", notes);
router.post("/filter", filterNotes);
router.get("/latest", latestNotes);
export default router;
