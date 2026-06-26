"use client";

import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/Context";
import Filter from "./Filter";
import NoteCard from "./NoteCard";

const NotesPage = () => {
  const router = useRouter();
  const { user, authLoading, API } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [downloading, setDownloading] = useState("");
  const [isView, setViewing] = useState("");
  const [filters, setFilter] = useState({
    semester: "",
    unit: "",
    subject: "",
  });
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);
  useEffect(() => {
    if (user) {
      fetchAllNotes();
    }
  }, [user]);

  async function fetchAllNotes() {
    try {
      const res = await fetch(`${API}/api/notes/getNotes`);
      const data = await res.json();
      setAllNotes(data.notes || []);
    } catch (err) {
      console.log("error fetching all notes: ", err);
    }
  }
  async function handleDownload(noteID) {
    setDownloading(noteID);
    const res = await fetch(`${API}/api/notes/download?id=${noteID}`);
    const data = await res.json();
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === noteID ? { ...note, downloads: data.downloads } : note,
      ),
    );
    setDownloading("");
    window.location.href = data.downloadLink;
  }
  useEffect(() => {
    handleFilter();
  }, [filters]);
  async function handleFilter(searchVal = searchQuery) {
    try {
      const res = await fetch(`${API}/api/notes/filter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...filters, search: searchVal }),
      });
      const data = await res.json();
      setNotes(data.notes || []);
    } catch (err) {
      console.log("error while filtering: ", err.message);
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
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

                handleFilter(value);
              }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 flex flex-col lg:flex-row gap-8">
        <Filter setFilter={setFilter} filters={filters} notes={allNotes} />
        <NoteCard
          notes={notes}
          isDownloading={downloading}
          isView={isView}
          setView={setViewing}
          handleDownload={handleDownload}
        />
      </div>
    </div>
  );
};

export default NotesPage;
