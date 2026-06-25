import React from "react";

const NoteCard = ({
  notes,
  isDownloading,
  isView,
  setView,
  handleDownload,
}) => {
  return (
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
                onClick={() => {
                  setView(note._id);
                  setTimeout(() => {
                    setView("");
                  }, 2000);
                }}
                className="flex-1 py-3 border-2 border-blue-500 text-blue-600 text-center rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
              >
                {isView === note._id ? "opening..." : "📂 View"}
              </a>

              <button
                onClick={() => handleDownload(note._id)}
                className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isDownloading === note._id ? "Downloading..." : "⬇️ Download"}
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
  );
};

export default NoteCard;
