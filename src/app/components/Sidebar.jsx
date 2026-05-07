"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppContext } from "../context/Context";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useContext(AppContext);
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", emoji: "🏠" },
    { name: "All Notes", href: "/notes", emoji: "📚" },
    { name: "Practicals", href: "/practicals", emoji: "💻" },
    { name: "Date Sheet", href: "/events", emoji: "📅" },
  ];

  return (
    <>
      {/* Sidebar Container */}
      <aside
        className={`
        fixed top-18.5 left-0 h-[calc(100vh-74px)] bg-white border-r-2 border-gray-100 w-64 z-40 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full "}
      `}
      >
        <div className="flex flex-col h-full p-6">
          <nav className="flex-1 space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-3 mb-4">
              Main Menu
            </p>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)} // Close on mobile after click
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                        : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                    }
                  `}
                >
                  <span className="text-lg">{link.emoji}</span>
                  <span className="text-sm">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* component: Support Card */}
          <div className="bg-gray-900 p-5 rounded-2xl text-white">
            <p className="text-xs font-bold mb-2">BCA Portal 2026</p>
            <p className="text-[10px] opacity-70 mb-4 text-blue-100 leading-relaxed">
              Managed for HNBGU Students.
            </p>
            <button className="w-full py-2 bg-blue-600 rounded-lg text-[10px] font-bold">
              GET SUPPORT
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
