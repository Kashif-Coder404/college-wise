"use client"; // Required for handling form state in Next.js

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { AppContext } from "../context/Context";
import { useRouter } from "next/navigation"; 
const Login = () => {
  const router = useRouter();
  const [alert, setAlert] = useState("");
  const [email, setEmail] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const { setUser, setToken, API, user } = useContext(AppContext);

  useEffect(() => {
    if (user) {
      router.replace("./dashboard");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAlert(data.message || "Login failed!");
      } else {
        setAlert(data.message || "Successfully Logined"); // clear error
        setUser(data.user.fullName);
        setToken(data.token);
        if (rememberMe) {
          localStorage.setItem("user", data.user.fullName);
          localStorage.setItem("token", data.token);
        }
        router.replace("./dashboard");
      }
    } catch (err) {
      setAlert("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        {/* Header */}
        {alert && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm">
            {alert}
          </div>
        )}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-lg shadow-blue-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Log in to access your college notes and schedules.
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>

              {/* 1. Wrapper specifically for the input and icon */}
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  /* 2. Removed 'relative' from here, added 'pr-12' to prevent text overlapping the icon */
                  className="appearance-none block w-full px-4 py-3 pr-12 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* 3. Replaced translate classes with standard vertical centering and right-alignment */}
                <div
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  <span className="material-symbols-outlined">
                    {showPass ? "visibility_off" : "visibility"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-gray-900">Remember me</label>
            </div>
            <Link
              href="/forgot-password"
              weight="medium"
              className="text-blue-600 hover:text-blue-500"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-95"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-bold text-blue-600 hover:text-blue-500"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
