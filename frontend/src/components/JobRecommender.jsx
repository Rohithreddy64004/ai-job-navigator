// src/components/JobRecommender.jsx
import React, { useState } from "react";
import { Upload, Loader2, XCircle, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

export default function JobRecommender() {
  const navigate = useNavigate();
  const [pdf, setPdf] = useState(null);
  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showJobsPopup, setShowJobsPopup] = useState(false);

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${apiUrl}/api/upload_resume/`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
      const data = await res.json();
      setPdf(file);
      setSkills(data.skills || []);
      setJobs(data.jobs || []);
      setShowJobsPopup(true);
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("Error analyzing resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplyClick = (url) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex flex-col items-center justify-center p-10 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-[-150px] left-[-100px] w-[300px] h-[300px] bg-indigo-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-[-150px] right-[-100px] w-[300px] h-[300px] bg-pink-200 rounded-full blur-3xl opacity-40"></div>

      {/* Back Arrow */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-indigo-700 transition"
      >
        <ArrowLeft className="w-6 h-6" />
        <span className="hidden sm:inline font-medium">Back</span>
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-5xl font-extrabold text-indigo-700 mb-3 drop-shadow-sm">
          💼 AI Job Recommender
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Upload your resume — let AI analyze your skills and match you with the
          best opportunities tailored for you.
        </p>
      </motion.div>

      {/* Upload Section */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-2xl p-12 rounded-2xl border-4 border-dashed text-center transition-all duration-300 shadow-2xl ${
          dragActive
            ? "border-indigo-600 bg-indigo-50"
            : "border-gray-300 bg-white"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handlePdfUpload({ target: { files: e.dataTransfer.files } });
        }}
      >
        {isUploading ? (
          <>
            <Loader2 className="w-14 h-14 text-indigo-600 animate-spin mb-4 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-700">
              Analyzing your resume with AI...
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              Extracting skills and matching relevant jobs.
            </p>
          </>
        ) : (
          <>
            <Upload className="w-16 h-16 text-indigo-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Drag & drop your resume here
            </h3>
            <p className="text-gray-500 mb-4">or choose a file manually</p>
            <label className="bg-indigo-600 text-white px-6 py-3 rounded-full cursor-pointer hover:bg-indigo-700 transition font-medium shadow-md">
              Upload Resume
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                className="hidden"
              />
            </label>
            {pdf && (
              <p className="mt-4 text-green-600 font-medium animate-pulse">
                ✅ Uploaded: {pdf.name}
              </p>
            )}
          </>
        )}
      </motion.div>

      {/* Skills Display */}
      {skills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-10 bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl border border-gray-200"
        >
          <h3 className="text-2xl font-semibold mb-5 text-indigo-700">
            🧠 Extracted Skills
          </h3>
          <div className="flex flex-wrap gap-3">
            {skills.map((s, i) => (
              <span
                key={i}
                className="bg-indigo-100 text-indigo-800 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm hover:bg-indigo-200 transition"
              >
                {s}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Job Recommendations Popup */}
      <AnimatePresence>
        {showJobsPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white w-[90%] max-w-5xl rounded-2xl shadow-2xl p-8 overflow-y-auto max-h-[85vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-indigo-700">
                  🎯 AI-Recommended Jobs
                </h2>
                <button
                  onClick={() => setShowJobsPopup(false)}
                  className="text-gray-500 hover:text-red-600 transition"
                >
                  <XCircle size={28} />
                </button>
              </div>

              {jobs.length === 0 ? (
                <p className="text-gray-600 text-center">
                  No matching jobs found. Try improving your resume keywords.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {jobs.map((job, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.03 }}
                      className="border p-5 rounded-xl bg-gradient-to-br from-indigo-50 to-white hover:shadow-lg transition flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-indigo-700 mb-1">
                          {job.job_title}
                        </h3>
                        <p className="text-gray-700">{job.company_name}</p>
                        <p className="text-gray-500 text-sm mb-2">
                          📍 {job.location}
                        </p>
                        <p className="text-xs text-gray-400">
                          🕒{" "}
                          {job.posted_date
                            ? new Date(job.posted_date).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleApplyClick(job.job_link)}
                        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm w-full transition font-medium shadow"
                      >
                        Apply Now
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setShowJobsPopup(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-2 rounded-lg text-lg transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
