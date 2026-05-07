"use client";

import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { useRouter } from "next/navigation";
import { AppContext } from "../context/Context";

const AdminPanel = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { subjects, API } = useContext(AppContext);
  const [notes, setNotes] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    unit: "",
    semester: "",
    type: "",
    teacherName: "",
    downloadLink: "",
    viewLink: "",
  });

  // -----------------------------------
  // CHECK ADMIN AUTH
  // -----------------------------------
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.replace("/admin/login");
    }
    setMounted(true);
    fetchNotes();
  }, []);

  // -----------------------------------
  // FETCH NOTES
  // -----------------------------------
  async function fetchNotes() {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`${API}/admin/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setNotes(data.notes);
    } catch (err) {
      console.log(err);
    }
  }

  // -----------------------------------
  // HANDLE INPUTS
  // -----------------------------------
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  // -----------------------------------
  // UPLOAD NOTE
  // -----------------------------------
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`${API}/admin/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.message);
      }

      alert("Uploaded Successfully!");

      setFormData({
        title: "",
        subject: "",
        unit: "",
        semester: "",
        type: "",
        teacherName: "",
        downloadLink: "",
        viewLink: "",
      });

      fetchNotes();
    } catch (err) {
      console.log(err);
    }
  }

  // -----------------------------------
  // DELETE NOTE
  // -----------------------------------
  async function handleDelete(id) {
    try {
      const token = localStorage.getItem("adminToken");

      await fetch(`${API}/admin/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchNotes();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>

        <p className="text-gray-500 mt-1">Upload and manage notes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORM */}
        <div className="bg-white rounded-3xl border p-6 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Upload Note</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* TITLE */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Note Title
              </label>

              <input
                type="text"
                name="title"
                placeholder="Example: Unit 1 Notes"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* SUBJECT */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Subject
              </label>

              {mounted && (
                <Select
                  options={subjects.map((subject) => ({
                    label: subject,
                    value: subject,
                  }))}
                  placeholder="Search Subject..."
                  isSearchable
                  value={
                    formData.subject
                      ? {
                          label: formData.subject,
                          value: formData.subject,
                        }
                      : null
                  }
                  onChange={(selected) =>
                    setFormData({
                      ...formData,
                      subject: selected.value,
                    })
                  }
                />
              )}
            </div>

            {/* UNIT + SEM */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Unit
                </label>

                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none"
                  required
                >
                  <option value="">Select</option>
                  <option value="1">Unit 1</option>
                  <option value="2">Unit 2</option>
                  <option value="3">Unit 3</option>
                  <option value="4">Unit 4</option>
                  <option value="5">Unit 5</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Semester
                </label>

                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none"
                  required
                >
                  <option value="">Select</option>
                  <option value="1">Sem 1</option>
                  <option value="2">Sem 2</option>
                  <option value="3">Sem 3</option>
                  <option value="4">Sem 4</option>
                  <option value="5">Sem 5</option>
                  <option value="6">Sem 6</option>
                  <option value="7">Sem 7</option>
                  <option value="8">Sem 8</option>
                </select>
              </div>
            </div>

            {/* TYPE + TEACHER */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  File Type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none"
                  required
                >
                  <option value="">Select</option>
                  <option value="PDF">PDF</option>
                  <option value="DOCX">DOCX</option>
                  <option value="PPT">PPT</option>
                  <option value="TXT">TXT</option>
                  <option value="ZIP">ZIP</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Teacher Name
                </label>

                <input
                  type="text"
                  name="teacherName"
                  placeholder="Example: Sandhya Ma'am"
                  value={formData.teacherName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* DOWNLOAD LINK */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Download Link
              </label>

              <textarea
                name="downloadLink"
                placeholder="Paste download link..."
                value={formData.downloadLink}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* VIEW LINK */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                View Link
              </label>

              <textarea
                name="viewLink"
                placeholder="Paste preview/view link..."
                value={formData.viewLink}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all text-white font-bold py-3 rounded-2xl"
            >
              Upload Note
            </button>
          </form>
        </div>

        {/* NOTES */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-white border rounded-3xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                    UNIT {note.unit}
                  </span>

                  <span className="text-sm text-gray-500">
                    SEM {note.semester}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  {note.title}
                </h3>

                <p className="text-gray-500 text-sm mt-1 mb-6">
                  {note.subject}
                </p>

                <div className="flex gap-3">
                  <a
                    href={note.viewLink}
                    target="_blank"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl font-semibold"
                  >
                    View
                  </a>

                  <a
                    href={note.downloadLink}
                    target="_blank"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-xl font-semibold"
                  >
                    Download
                  </a>

                  <button
                    onClick={() => handleDelete(note._id)}
                    className="px-4 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {notes.length === 0 && (
            <div className="bg-white rounded-3xl border border-dashed py-20 text-center mt-6">
              <p className="text-gray-500">No notes uploaded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
