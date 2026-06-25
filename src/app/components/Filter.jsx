import React from "react";

const Filter = ({ setFilter, filters, notes }) => {
  const sortedSubjects = [...new Set(notes.map((n) => n.subject))];
  const sortedSem = [...new Set(notes.map((n) => n.semester))];
  const sortedUnit = ["1", "2", "3", "4", "5"];
  return (
    <aside className="w-full lg:w-64 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>🔍</span> Filters
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Semester
            </label>
            <select
              value={filters.semester}
              onChange={(e) => {
                setFilter((prev) => ({
                  ...prev,
                  semester: e.target.value,
                }));
              }}
              className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
            >
              <option value={""}>All Semesters</option>
              {sortedSem.map((sem) => {
                return (
                  <option key={sem} value={sem}>
                    Sem {sem}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Subject
            </label>
            <select
              value={filters.subject}
              onChange={(e) => {
                setFilter((prev) => ({
                  ...prev,
                  subject: e.target.value,
                }));
              }}
              className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
            >
              <option value={""}>All Subjects</option>
              {sortedSubjects.map((subject) => {
                return (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Unit
            </label>
            <select
              value={filters.unit}
              onChange={(e) => {
                setFilter((prev) => ({
                  ...prev,
                  unit: e.target.value,
                }));
              }}
              className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
            >
              <option value={""}>All Unit</option>
              {sortedUnit.map((unit) => {
                return (
                  <option key={unit} value={unit}>
                    {" "}
                    {unit}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Filter;
