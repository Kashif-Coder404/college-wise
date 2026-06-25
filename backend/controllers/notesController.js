import Notes from "../models/Notes.js";

export const downloadNote = async (req, res) => {
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
    // toDownload.downloads = Number(toDownload.downloads) + 1;

    // SAVE in database
    // await toDownload.save();
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
};

export const notes = async (req, res) => {
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
};

export const latestNotes = async (req, res) => {
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
};

export const filterNotes = async (req, res) => {
  try {
    const { subject, semester, unit, search } = req.body;
    let query = {};
    //Subject Filter - exact match to avoid regex escaping issues with parentheses
    if (subject) {
      query.subject = subject;
    }
    if (semester) {
      query.semester = semester.toString();
    }
    if (unit) {
      query.unit = unit.toString();
    }
    if (search) {
      query.$or = [
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
      ];
    }

    const filteredNotes = await Notes.find(query);

    res.status(200).json({ notes: filteredNotes });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};
