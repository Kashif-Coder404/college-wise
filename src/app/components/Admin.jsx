"use client";

import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { useRouter } from "next/navigation";
import { AppContext } from "../context/Context";

const AdminPanel = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { subjects, API } = useContext(AppContext);
  
  const [activeTab, setActiveTab] = useState("notes");
  const [notes, setNotes] = useState([]);
  const [users, setUsers] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

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
  // CHECK ADMIN AUTH & INIT
  // -----------------------------------
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    setMounted(true);
    fetchNotes();
    fetchUsers();
  }, []);

  // -----------------------------------
  // FETCH NOTES
  // -----------------------------------
  async function fetchNotes() {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API}/api/admin/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setNotes(data.notes || data);
    } catch (err) {
      console.error(err);
    }
  }

  // -----------------------------------
  // FETCH USERS
  // -----------------------------------
  async function fetchUsers() {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    }
  }

  // -----------------------------------
  // HANDLE INPUTS
  // -----------------------------------
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // -----------------------------------
  // UPLOAD NOTE
  // -----------------------------------
  async function handleSubmit(e) {
    e.preventDefault();
    setIsUploading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API}/api/admin/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setIsUploading(false);

      if (!res.ok) return alert(data.message);

      alert("Uploaded Successfully!");
      setFormData({
        title: "", subject: "", unit: "", semester: "", type: "", teacherName: "", downloadLink: "", viewLink: "",
      });
      fetchNotes();
    } catch (err) {
      setIsUploading(false);
      console.error(err);
    }
  }

  // -----------------------------------
  // DELETE NOTE
  // -----------------------------------
  async function handleDeleteNote(id) {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`${API}/api/admin/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  }

  // -----------------------------------
  // DELETE USER
  // -----------------------------------
  async function handleDeleteUser(id) {
    if (!confirm("Are you sure you want to delete this student account? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`${API}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  }

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full shadow-2xl z-20">
        <div className="p-6">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Admin Panel
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-medium">Dashboard & Management</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button
            onClick={() => setActiveTab("notes")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === "notes" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            Notes
          </button>
          
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === "users" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            Users
          </button>
        </nav>

        <div className="p-4">
          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              router.replace("/admin/login");
            }}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-300 py-3 rounded-xl transition-all font-semibold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-64 flex-1 p-8 lg:p-12 overflow-y-auto">
        
        {/* HEADER */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              {activeTab === "notes" ? "Notes Management" : "User Management"}
            </h2>
            <p className="text-slate-500 mt-1">
              {activeTab === "notes" ? "Upload and manage course materials." : "Manage registered student accounts."}
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-full border shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-semibold text-slate-700">Admin Active</span>
          </div>
        </div>

        {/* --- NOTES TAB --- */}
        {activeTab === "notes" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* UPLOAD FORM */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm h-fit xl:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Upload Note</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Title</label>
                  <input type="text" name="title" placeholder="Unit 1 Notes" value={formData.title} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-800" required />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Subject</label>
                  <Select
                    options={subjects.map(s => ({ label: s, value: s }))}
                    placeholder="Search Subject..."
                    value={formData.subject ? { label: formData.subject, value: formData.subject } : null}
                    onChange={s => setFormData({ ...formData, subject: s.value })}
                    className="text-slate-800"
                    styles={{
                      control: (base) => ({ ...base, borderRadius: '0.75rem', borderColor: '#e2e8f0', padding: '0.15rem', backgroundColor: '#f8fafc', boxShadow: 'none', '&:hover': { borderColor: '#cbd5e1' } })
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Unit</label>
                    <select name="unit" value={formData.unit} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800" required>
                      <option value="">Select</option>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>Unit {n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Sem</label>
                    <select name="semester" value={formData.semester} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800" required>
                      <option value="">Select</option>
                      {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Sem {n}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800" required>
                      <option value="">Select</option>
                      <option value="PDF">PDF</option>
                      <option value="DOCX">DOCX</option>
                      <option value="PPT">PPT</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Teacher</label>
                    <input type="text" name="teacherName" placeholder="Name" value={formData.teacherName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800" required />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Download Link</label>
                  <input type="text" name="downloadLink" placeholder="URL" value={formData.downloadLink} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800" required />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">View Link</label>
                  <input type="text" name="viewLink" placeholder="URL" value={formData.viewLink} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800" required />
                </div>

                <button disabled={isUploading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 mt-4 flex justify-center items-center gap-2">
                  {isUploading ? "Uploading..." : "Upload Note"}
                </button>
              </form>
            </div>

            {/* LIST NOTES */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Uploaded Notes ({notes.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notes.map(note => (
                    <div key={note._id} className="group border border-slate-100 bg-slate-50 rounded-2xl p-5 hover:shadow-md hover:border-slate-300 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider">UNIT {note.unit}</span>
                        <span className="text-slate-400 text-xs font-bold">SEM {note.semester}</span>
                      </div>
                      <h4 className="text-md font-bold text-slate-900 leading-tight mb-1">{note.title}</h4>
                      <p className="text-slate-500 text-xs mb-4 line-clamp-1">{note.subject}</p>
                      
                      <div className="flex gap-2">
                        <a href={note.viewLink} target="_blank" className="flex-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs text-center py-2 rounded-lg font-semibold transition-colors">View</a>
                        <button onClick={() => handleDeleteNote(note._id)} className="px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  {notes.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                      <p className="text-slate-400 font-medium">No notes available.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- USERS TAB --- */}
        {activeTab === "users" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900">Registered Students</h3>
              <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">{users.length} Total</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold border-b">Name</th>
                    <th className="p-4 font-semibold border-b">Email</th>
                    <th className="p-4 font-semibold border-b">Course</th>
                    <th className="p-4 font-semibold border-b">Sem</th>
                    <th className="p-4 font-semibold border-b text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(user => (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-800">{user.fullName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 text-sm">{user.email}</td>
                      <td className="p-4 text-slate-600 text-sm font-medium">{user.course}</td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-bold">Sem {user.semester}</span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex items-center gap-1 text-sm font-semibold"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-slate-400 font-medium">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminPanel;
