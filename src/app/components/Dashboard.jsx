"use client";

import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/Context";

const Dashboard = () => {
  const { user, API } = useContext(AppContext);

  const router = useRouter();

  const [latestNotes, setLatestNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------------
  // AUTH
  // -----------------------------------

  useEffect(() => {
    if (!user && !loading) {
      router.replace("/login");
    }
  }, [user, router]);

  // -----------------------------------
  // FETCH LATEST NOTES
  // -----------------------------------

  useEffect(() => {
    fetchLatestNotes();
  }, []);

  async function fetchLatestNotes() {
    try {
      const res = await fetch(`${API}/api/notes/latest`);

      const data = await res.json();

      setLatestNotes(data.notes || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------------
  // DOWNLOAD
  // -----------------------------------

  async function handleDownload(noteID) {
    try {
      const res = await fetch(`${API}/api/notes/download?id=${noteID}`);

      const data = await res.json();

      // Update downloads instantly
      setLatestNotes((prev) =>
        prev.map((note) =>
          note._id === noteID
            ? {
                ...note,
                downloads: data.downloads,
              }
            : note,
        ),
      );

      window.open(data.downloadLink, "_blank");
    } catch (err) {
      console.log(err);
    }
  }

  // -----------------------------------
  // STATS
  // -----------------------------------

  const totalDownloads = latestNotes.reduce(
    (acc, note) => acc + Number(note.downloads || 0),
    0,
  );

  // -----------------------------------
  // UI
  // -----------------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}

      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

            <p className="text-gray-500 mt-1">Welcome back, {user?.fullName}</p>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("user");

              router.replace("/login");
            }}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-2xl font-semibold transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN */}

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className=" flex justify-between items-center bg-white rounded-3xl border p-6 shadow-sm">
            <p className="text-gray-500 text-xl">Total Notes</p>

            <h2 className="text-5xl font-bold text-gray-900 mt-2">
              {latestNotes.length}
            </h2>
          </div>

          <div className="flex justify-between items-center bg-white rounded-3xl border p-6 shadow-sm">
            <p className="text-gray-500 text-2xl">Downloads</p>

            <h2 className="text-5xl font-bold text-gray-900 mt-2">
              {totalDownloads}
            </h2>
          </div>

          {/* <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-6 text-white shadow-sm">
            <p className="text-blue-100 text-sm">Current Semester</p>

            <h2 className="text-4xl font-bold mt-2">
              Sem {user?.semester || "-"}
            </h2>
          </div> */}
        </div>

        {/* SECTION HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Latest Notes</h2>

            <p className="text-gray-500 mt-1">
              Recently uploaded study material
            </p>
          </div>

          <button
            onClick={() => router.push("/notes")}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-semibold transition-all"
          >
            Browse All Notes
          </button>
        </div>

        {/* LOADING */}

        {loading ? (
          <div className="text-center py-24 text-gray-500">
            Loading latest notes...
          </div>
        ) : (
          <>
            {/* NOTES GRID */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {latestNotes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white rounded-3xl border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* BADGES */}

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

                    <h3 className="text-xl font-bold text-gray-900 leading-snug">
                      {note.title}
                    </h3>

                    {/* SUBJECT */}

                    <p className="text-sm text-gray-500 mt-2">{note.subject}</p>

                    {/* INFO */}

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

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Uploaded</span>

                        <span className="font-semibold text-gray-700">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-3 mt-8">
                    <a
                      href={note.viewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 border-2 border-blue-500 text-blue-600 text-center rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all"
                    >
                      View
                    </a>

                    <button
                      onClick={() => handleDownload(note._id)}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 active:scale-95 transition-all"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* EMPTY */}

            {latestNotes.length === 0 && (
              <div className="bg-white rounded-3xl border border-dashed py-24 text-center mt-8">
                <p className="text-gray-500">No notes uploaded yet.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
