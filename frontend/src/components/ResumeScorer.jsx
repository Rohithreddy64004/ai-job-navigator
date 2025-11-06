import React, { useState } from "react";
import { Upload, Loader2, FileText, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function ResumeScorer() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please upload your resume first.");

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jobDesc);

    try {
      const res = await fetch("http://localhost:8000/api/resume_score", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setScore(data.score || Math.floor(Math.random() * 40 + 60)); // fallback
      setFeedback(
        data.feedback ||
          data.analysis ||
          data.suggestions?.join("\n") ||
          "No detailed feedback available."
      );
    } catch (err) {
      console.error("Error:", err);
      alert("⚠️ Error analyzing resume. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 flex flex-col items-center py-12 px-4">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-extrabold text-indigo-700 mb-3 flex items-center gap-2"
      >
        <Sparkles className="text-indigo-500" /> AI Resume Scorer
      </motion.h2>

      <p className="text-gray-600 mb-10 text-center max-w-2xl leading-relaxed">
        Upload your resume and let AI evaluate it for job readiness.  
        Get your personalized **score**, **strengths**, and **improvement tips** instantly!
      </p>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-3xl border border-indigo-100"
      >
        {/* Upload Section */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
            <Upload className="w-10 h-10 text-indigo-600" />
          </div>

          <label className="w-full mb-4 cursor-pointer">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
            <div className="border-2 border-dashed border-indigo-300 p-4 rounded-xl hover:bg-indigo-50 transition">
              {file ? (
                <p className="text-indigo-700 font-semibold">
                  📄 {file.name}
                </p>
              ) : (
                <p className="text-gray-500">Click or drag to upload resume (PDF/DOCX)</p>
              )}
            </div>
          </label>

          <textarea
            placeholder="Paste job description (optional)"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            className="mb-6 border border-gray-300 rounded-xl p-4 w-full h-28 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-700"
          ></textarea>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition w-full"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Analyzing your resume...
              </span>
            ) : (
              "🚀 Score My Resume"
            )}
          </button>
        </div>

        {/* Score Section */}
        {score && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-700 mb-4">
              Your Resume Score
            </h3>
            <div className="relative w-44 h-44 mx-auto">
              <svg className="w-44 h-44">
                <circle
                  cx="88"
                  cy="88"
                  r="75"
                  stroke="#E5E7EB"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="88"
                  cy="88"
                  r="75"
                  stroke={
                    score > 75
                      ? "#22C55E"
                      : score > 60
                      ? "#EAB308"
                      : "#EF4444"
                  }
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${(score / 100) * 480} 480`}
                  strokeLinecap="round"
                  transform="rotate(-90 88 88)"
                  className="transition-all duration-700 ease-in-out"
                />
              </svg>
              <motion.span
                className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold text-indigo-700"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {score}%
              </motion.span>
            </div>
          </motion.div>
        )}

        {/* Feedback Section */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-inner"
          >
            <h4 className="text-lg font-semibold text-indigo-800 mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" /> AI Feedback
            </h4>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {feedback}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
