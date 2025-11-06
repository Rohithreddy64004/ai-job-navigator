// src/components/ResumeGenerator.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ResumeGenerator() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-10">
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">
        🧾 AI Resume Generator
      </h1>
      <p className="text-gray-600 mb-10 text-center max-w-xl">
        Choose between AI-powered resume generation or customizable templates.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div
          onClick={() => navigate("/ai-resume")}
          className="cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl p-10 border-t-4 border-indigo-600 text-center transition-all duration-300"
        >
          <h2 className="text-2xl font-semibold mb-4">🤖 AI Resume</h2>
          <p className="text-gray-600">
            Let AI build your professional resume automatically.
          </p>
        </div>

        <div
          onClick={() => navigate("/resume-templates")}
          className="cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl p-10 border-t-4 border-purple-600 text-center transition-all duration-300"
        >
          <h2 className="text-2xl font-semibold mb-4">🎨 AI Resume Templates</h2>
          <p className="text-gray-600">
            Pick from ATS-friendly templates like Minimal, Modern, or Elegant.
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate("/dashboard")}
        className="mt-10 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}
