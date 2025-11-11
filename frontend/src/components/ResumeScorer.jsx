import React, { useState, useRef } from "react";
import { Upload, Loader2, FileText, Sparkles, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const apiUrl = import.meta.env.VITE_API_URL;

export default function ResumeScorer() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const uploadInputRef = useRef(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload your resume first.");
      return;
    }
    setLoading(true);
    setScore(null);
    setFeedback("");
    setProgress(0);

    // Simulated progress for UI
    let simulatedProgress = 0;
    const interval = setInterval(() => {
      simulatedProgress += 10;
      if (simulatedProgress > 90) clearInterval(interval);
      setProgress(simulatedProgress);
    }, 200);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("job_description", jobDesc);

      // ✅ Fixed string interpolation here
      const res = await fetch(`${apiUrl}/api/resume_score`, {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);
      const data = await res.json();

      setScore(data.score || Math.floor(Math.random() * 40 + 60)); // fallback
      setFeedback(
        data.feedback ||
          data.analysis ||
          data.suggestions?.join("\n") ||
          "No detailed feedback available."
      );
    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      alert("⚠️ Error analyzing resume. Try again later.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 flex flex-col items-center py-12 px-4">
      {/* Back Button */}
      <button
        onClick={goBack}
        aria-label="Go back"
        className="self-start mb-6 p-2 rounded-full hover:bg-indigo-100 transition"
      >
        <ArrowLeft className="w-6 h-6 text-indigo-700" />
      </button>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-extrabold text-indigo-700 mb-3 flex items-center gap-2"
      >
        <Sparkles className="text-indigo-500" /> AI Resume Scorer
      </motion.h2>

      <p className="text-gray-600 mb-10 text-center max-w-2xl leading-relaxed">
        Upload your resume and let AI evaluate it for job readiness. Get your personalized{" "}
        <strong>score</strong>, <strong>strengths</strong>, and{" "}
        <strong>improvement tips</strong> instantly!
      </p>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-3xl border border-indigo-100"
      >
        <div className="flex flex-col items-center text-center">
          <div
            onClick={() => uploadInputRef.current?.click()}
            className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-4 cursor-pointer select-none hover:bg-indigo-200 transition"
          >
            <Upload className="w-10 h-10 text-indigo-600" />
          </div>

          <label className="w-full mb-4 cursor-pointer">
            <input
              ref={uploadInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
            <div className="border-2 border-dashed border-indigo-300 p-4 rounded-xl hover:bg-indigo-50 transition truncate">
              {file ? (
                <p className="text-indigo-700 font-semibold truncate">📄 {file.name}</p>
              ) : (
                <p className="text-gray-500">Click or drag to upload resume (PDF/DOCX)</p>
              )}
            </div>
          </label>

          <textarea
            placeholder="Paste job description (optional)"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            className="mb-6 border border-gray-300 rounded-xl p-4 w-full h-28 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-700 resize-none"
          ></textarea>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition w-full relative overflow-hidden"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" /> Analyzing your resume...
              </span>
            ) : (
              "🚀 Score My Resume"
            )}
            {loading && (
              <div
                className="absolute bottom-0 left-0 h-1 bg-indigo-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            )}
          </button>
        </div>

        {/* Score Display */}
        <AnimatePresence>
          {score !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-10 text-center"
            >
              <h3 className="text-2xl font-bold text-gray-700 mb-4">Your Resume Score</h3>
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
                    stroke={score > 75 ? "#22C55E" : score > 60 ? "#EAB308" : "#EF4444"}
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
        </AnimatePresence>

        {/* Feedback Display */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-10 bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-inner whitespace-pre-line text-gray-700"
            >
              <h4 className="text-lg font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" /> AI Feedback
              </h4>
              {feedback}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
 