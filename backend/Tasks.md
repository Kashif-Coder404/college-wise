# CollegeWise Task Tracker

## 🔒 Security Upgrades (Pending)

- `[ ]` Restrict CORS policy in `server.js` to only allow the Netlify domain (prevent unauthorized API access).
- `[ ]` Install and configure `express-rate-limit` to prevent spam on `/api/auth/signup` and `/api/auth/forgot-password`.
- `[ ]` Add `helmet` middleware for standard HTTP security headers.

## 🚀 Future Features (Ideas)

- `[ ]` **Smart Notes Filtering:** Since users sign up with a `course` and `semester`, automatically show them notes relevant to their specific classes on their dashboard.
- `[ ]` **PDF / Image Uploads:** Integrate Cloudinary or AWS S3 so students can upload actual PDF files and photos of their handwritten notes, rather than just text.
- `[ ]` **Upvote System:** Add a Reddit-style upvote/downvote system for notes so the highest-quality study materials rise to the top.
- `[ ]` **Study Groups:** Create real-time chat rooms (using Socket.io) for students in the same course/semester to discuss topics and exams.
- `[ ]` **Admin Dashboard:** Since you have an `ADMIN_USER` in your `.env`, build a hidden dashboard where you can delete inappropriate notes, manage users, and view app statistics.
