"use client";

import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/Context";
import Filter from "./Filter";

const NotesPage = () => {
  const router = useRouter();
  const { user, loading, subjects } = useContext(AppContext);
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, []);
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilter] = useState({
    semester: "",
    unit: "",
    subject: "",
  });
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes(search = "") {
    const res = await fetch(
      `http://192.168.31.116:8000/notes?search=${search}`,
    );
    const data = await res.json();
    setNotes(data.notes);
  }
  async function handleDownload(noteID) {
    const res = await fetch(
      `http://192.168.31.116:8000/notes/download?id=${noteID}`,
    );
    const data = await res.json();
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === noteID ? { ...note, downloads: data.downloads } : note,
      ),
    );
    window.location.href = data.downloadLink;
  }
  useEffect(() => {
    handleFilter();
  }, [filters]);
  async function handleFilter() {
    try {
      const res = await fetch(`http://192.168.31.116:8000/notes/filter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });
      const data = await res.json();
      setNotes(data.notes);
    } catch (err) {
      console.log("error while filtering: ", err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* component: SearchHeader */}
      <div className="bg-white border-b sticky top-0 z-10 px-4 py-6 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Study Material</h1>
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search by subject or topic..."
              className="w-full pl-4 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;

                setSearchQuery(value);

                fetchNotes(value);
              }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 flex flex-col lg:flex-row gap-8">
        <Filter setFilter={setFilter} filters={filters} notes={notes} />

        {/* component: NotesGrid */}
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-white rounded-3xl border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* TOP BADGES */}
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase">
                        Unit {note.unit}
                      </span>

                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full uppercase">
                        {note.type}
                      </span>
                    </div>

                    <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">
                      Sem {note.semester}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h3 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
                    {note.title}
                  </h3>

                  {/* SUBJECT */}
                  <p className="text-sm text-gray-500 mt-2">{note.subject}</p>

                  {/* META INFO */}
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Teacher</span>

                      <span className="font-semibold text-gray-700">
                        {note.teacherName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Downloads</span>

                      <span className="font-semibold text-gray-700">
                        {note.downloads || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="flex gap-3 mt-8">
                  <a
                    href={note.viewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 border-2 border-blue-500 text-blue-600 text-center rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                  >
                    <span>📂</span>
                    View
                  </a>

                  <button
                    onClick={() => handleDownload(note._id)}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>⬇️</span>
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State placeholder */}
          {notes.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500">No notes found for this filter.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default NotesPage;
