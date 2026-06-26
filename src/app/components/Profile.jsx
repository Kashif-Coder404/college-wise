"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "../context/Context";

const Profile = () => {
  const router = useRouter();
  const { API } = useContext(AppContext);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    course: "",
    semester: "",
    bio: "",
    github: "",
    linkedin: "",
    skills: "", 
  });

  useEffect(() => {
    const token = localStorage.getItem("token"); 
    if (!token) {
      router.replace("/login");
      return;
    }
    setMounted(true);
    fetchProfile(token);
  }, []);

  async function fetchProfile(token) {
    try {
      const res = await fetch(`${API}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setFormData({
          fullName: data.user.fullName || "",
          course: data.user.course || "",
          semester: data.user.semester || "",
          bio: data.user.bio || "",
          github: data.user.github || "",
          linkedin: data.user.linkedin || "",
          skills: data.user.skills ? data.user.skills.join(", ") : "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        skills: formData.skills.split(",").map(s => s.trim()).filter(s => s),
      };

      const res = await fetch(`${API}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setSaving(false);

      if (!res.ok) return alert(data.message);
      
      if (data.user.fullName) {
        localStorage.setItem("user", data.user.fullName);
      }
      
      alert("Profile updated successfully!");
    } catch (err) {
      setSaving(false);
      console.error(err);
    }
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center shadow-md">
                 <span className="text-3xl font-bold text-blue-600">
                    {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : "U"}
                 </span>
              </div>
            </div>
          </div>
          
          <div className="pt-16 pb-8 px-8">
            <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
            <p className="text-slate-500 text-sm mt-1">Update your personal information and add links to your portfolio.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Full Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800" required />
                </div>
                <div>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="text-sm font-semibold text-slate-700 block mb-2">Course</label>
                       <input type="text" name="course" value={formData.course} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800" required />
                     </div>
                     <div>
                       <label className="text-sm font-semibold text-slate-700 block mb-2">Semester</label>
                       <select name="semester" value={formData.semester} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800" required>
                         <option value="">Select</option>
                         {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Sem {n}</option>)}
                       </select>
                     </div>
                   </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">Bio</label>
                <textarea name="bio" rows={3} placeholder="Tell us a little about yourself..." value={formData.bio} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 resize-none"></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">GitHub URL</label>
                  <input type="url" name="github" placeholder="https://github.com/..." value={formData.github} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">LinkedIn URL</label>
                  <input type="url" name="linkedin" placeholder="https://linkedin.com/in/..." value={formData.linkedin} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800" />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">Skills (comma-separated)</label>
                <input type="text" name="skills" placeholder="React, Node.js, Python..." value={formData.skills} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800" />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-70">
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
