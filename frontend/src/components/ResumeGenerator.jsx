import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function ResumeGenerator() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-10 space-y-12">
      <button
        onClick={() => navigate("/dashboard")}
        className="self-start flex items-center gap-2 text-indigo-700 hover:text-indigo-900 transition"
        aria-label="Back to Dashboard"
      >
        <FiArrowLeft size={20} />
        <span className="font-semibold text-lg"></span>
      </button>

      <h1 className="text-5xl font-extrabold text-indigo-700 text-center">
        🧾 AI Resume Generator
      </h1>
      
      <p className="max-w-xl text-center text-gray-600 text-lg">
        Choose between AI-powered resume generation or customizable templates.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
        <div
          onClick={() => navigate("/ai-resume")}
          className="cursor-pointer bg-white rounded-3xl shadow-lg hover:shadow-2xl p-12 border-t-8 border-indigo-600 text-center transition-all duration-300 flex flex-col items-center justify-center"
          aria-label="Go to AI Resume Generator"
        >
          <h2 className="text-3xl font-semibold mb-5">🤖 AI Resume</h2>
          <p className="text-gray-700 max-w-xs">
            Let AI build your professional resume automatically.
          </p>
        </div>

        <div
          onClick={() => navigate("/resume-templates")}
          className="cursor-pointer bg-white rounded-3xl shadow-lg hover:shadow-2xl p-12 border-t-8 border-purple-600 text-center transition-all duration-300 flex flex-col items-center justify-center"
          aria-label="Go to AI Resume Templates"
        >
          <h2 className="text-3xl font-semibold mb-5">🎨 AI Resume Templates</h2>
          <p className="text-gray-700 max-w-xs">
            Pick from ATS-friendly templates like Minimal, Modern, or Elegant.
          </p>
        </div>
      </div>
    </div>
  );
}
