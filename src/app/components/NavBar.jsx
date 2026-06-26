"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { AppContext } from "../context/Context";
import Sidebar from "./Sidebar";
import { usePathname, useRouter } from "next/navigation";

const NavBar = ({ collegeName }) => {
  const { user, setUser, logout } = useContext(AppContext);
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 bg-white border-b-2 border-blue-600 shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle Button (Mobile Only) */}
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            aria-label="Toggle Menu"
          >
            {isSidebarOpen ? (
              <span className="text-xl font-bold">✕</span> // Simple text X icon
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>

          {/* Logo Icon */}
          <div className="hidden sm:block bg-blue-600 p-2 rounded-md">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>

          <div className="flex flex-col leading-tight">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 tracking-tight"
            >
              CollegeWise
            </Link>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
              {collegeName || "Main Campus"}
            </span>
          </div>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-full transition-all"
              >
                <span className="hidden sm:inline text-sm font-semibold text-blue-900">
                  {user}
                </span>

                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                  {user.charAt(0).toUpperCase()}
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="block w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors border-b"
                  >
                    My Profile
                  </Link>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/signup"
                className="px-6 py-2 text-black text-sm font-bold rounded-full hover:bg-blue-700 hover:text-white transition-all  active:scale-95"
              >
                Signup
              </Link>
              <Link
                href="/login"
                className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-700 transition-all shadow-md active:scale-95"
              >
                LOGIN
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavBar;
