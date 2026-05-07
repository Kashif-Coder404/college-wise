"use client";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { AppContext } from "../context/Context";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const { user } = useContext(AppContext);
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  });

  return (
    <div className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-6">
              Exclusive for HNBGU Students
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
              Your College Resources, <br />
              <span className="text-blue-600">Perfectly Organized.</span>
            </h1>
            <p className="max-w-2xl text-lg text-gray-600 mb-10">
              Access the best hand-written notes, previous year questions, and
              practical manuals—all in one place. Built by students, for
              students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
              >
                Get Started for Free
              </Link>
              <Link
                href="/notes"
                className="px-8 py-4 bg-gray-100 text-gray-800 rounded-xl font-bold hover:bg-gray-200 transition-all"
              >
                Browse Notes
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative background blur */}
        <div className="absolute top-0 -left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute top-0 -right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Everything you need to score higher
            </h2>
            <p className="text-gray-500">
              No more searching through disorganized WhatsApp groups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              {/* Icon Placeholder */}
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 font-bold text-blue-600">
                ↓
              </div>
              <h3 className="text-xl font-bold mb-3">One-Click Downloads</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Download PDF notes and question banks instantly. No annoying ads
                or redirects.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              {/* Icon Placeholder */}
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 font-bold text-orange-600">
                📱
              </div>
              <h3 className="text-xl font-bold mb-3">Mobile Friendly</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Access your study material on the go. Perfectly optimized for
                your smartphone.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              {/* Icon Placeholder */}
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 font-bold text-green-600">
                ✓
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Content</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Resources are reviewed by senior students and faculty to ensure
                accuracy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-blue-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Ace your BCA Exams?
            </h2>
            <p className="text-blue-100 mb-10 max-w-xl mx-auto">
              Join hundreds of students already using CollegeHelp to simplify
              their studies.
            </p>
            <Link
              href="/signup"
              className="px-10 py-4 bg-white text-blue-600 rounded-full font-black hover:bg-gray-100 transition-all inline-block"
            >
              Join Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 text-center">
        <p className="text-gray-400 text-sm">
          © 2026 CollegeHelp. Designed by Kashif ahmead.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
