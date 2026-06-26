"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppContext } from "../context/Context";

const Signup = () => {
  const router = useRouter();
  const { setUser, setToken, API } = useContext(AppContext);
  const [alertClr, setAlertClr] = useState("red");
  const [aler, setAlert] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    course: "",
    semester: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [signupToken, setSignupToken] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setAlertClr("red");
        setAlert(data.message || "Signup failed!");
      } else {
        setAlertClr("green");
        setAlert("Verification OTP sent to your email!");
        setSignupToken(data.signupToken);
        setOtpSent(true);
      }
    } catch (err) {
      setAlert("Server error. Please try again.");
      setAlertClr("red");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setAlert("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ signupToken, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAlertClr("red");
        setAlert(data.message || "OTP Verification failed!");
      } else {
        setAlertClr("green");
        setAlert("Account verified successfully! Redirecting...");
        setUser(data.user.fullName);
        setToken(data.token);
        localStorage.setItem("user", data.user.fullName);
        localStorage.setItem("token", data.token);
        router.replace("./dashboard");
      }
    } catch (err) {
      setAlert("Server error. Please try again.");
      setAlertClr("red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        {aler && (
          <div
            className={`bg-${alertClr}-100 border border-${alertClr}-400 text-${alertClr}-700 px-4 py-2 rounded-lg text-sm`}
          >
            {aler}
          </div>
        )}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {otpSent ? "Verify Email" : "Create Account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {otpSent ? "Enter verification code below" : "Join your college community hub."}
          </p>
        </div>

        {!otpSent ? (
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  name="fullName"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Kashif ahmead"
                  onChange={handleChange}
                />
              </div>
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="name@hnbgu.ac.in"
                  onChange={handleChange}
                />
              </div>
              {/* Selection Grid for Course & Semester */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Course
                  </label>
                  <select
                    name="course"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="BCA">BCA</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="BSC">B.Sc</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Semester
                  </label>
                  <select
                    name="semester"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5, 6].map((sem) => (
                      <option key={sem} value={sem}>
                        Sem {sem}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-200 transition-all active:scale-95 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Sending OTP..." : "Create Account"}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
            <div className="text-left space-y-4">
              <p className="text-sm text-gray-600">
                Please enter the 6-digit verification code sent to <strong className="text-gray-900">{formData.email}</strong>.
              </p>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Enter verification code (OTP)
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  disabled={loading}
                  className="w-full text-center tracking-widest text-2xl font-bold py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-100"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify & Create Account"}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors bg-transparent border-none outline-none cursor-pointer"
              >
                Resend verification code
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-blue-600 hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
