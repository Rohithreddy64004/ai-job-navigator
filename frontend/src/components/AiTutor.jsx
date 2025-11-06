import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiBookOpen, FiPlayCircle } from "react-icons/fi";

export default function AiTutor() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [courses, setCourses] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(false);

  const popularTopics = [
    "Python",
    "Machine Learning",
    "Data Science",
    "AI Basics",
    "Web Development",
    "React.js",
  ];

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/recommended_videos");
        const data = await res.json();
        setRecommended(data.videos || []);

        const courseRes = await fetch("http://localhost:8000/api/recommended_courses");
        const courseData = await courseRes.json();
        setCourses(courseData.courses || []);
      } catch (error) {
        console.error("Error fetching recommended data:", error);
      }
    };
    fetchRecommended();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const videoRes = await fetch(`http://localhost:8000/api/youtube_videos?q=${query}`);
      const videoData = await videoRes.json();
      setVideos(videoData.videos || []);

      const courseRes = await fetch(`http://localhost:8000/api/recommended_courses?q=${query}`);
      const courseData = await courseRes.json();
      setCourses(courseData.courses || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-10">
      <motion.h1
        className="text-5xl font-bold text-blue-700 text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🤖 AI Tutor Dashboard
      </motion.h1>
      <p className="text-center text-gray-700 mb-8 text-lg">
        Learn smarter with AI-curated videos, personalized courses, and topic recommendations.
      </p>

      {/* 🔍 Search Bar */}
      <motion.div
        className="flex justify-center items-center mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex bg-white/80 backdrop-blur-md shadow-md rounded-full overflow-hidden w-full max-w-2xl border border-gray-200">
          <input
            type="text"
            placeholder="Search for a topic (e.g., Python, Machine Learning)..."
            className="flex-grow px-6 py-3 outline-none text-gray-800 bg-transparent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-5 py-3 flex items-center justify-center hover:bg-blue-700 transition-all"
          >
            <FiSearch size={20} />
          </button>
        </div>
      </motion.div>

      {/* 💡 Popular Topics */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {popularTopics.map((topic) => (
          <motion.button
            key={topic}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 hover:text-white transition-all"
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setQuery(topic);
              handleSearch();
            }}
          >
            {topic}
          </motion.button>
        ))}
      </div>

      {/* 🌀 Loading */}
      {loading && (
        <motion.div
          className="flex justify-center items-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-blue-700 font-medium">Fetching results...</span>
        </motion.div>
      )}

      {/* 🎥 Search Results */}
      {!loading && videos.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center justify-center gap-2">
            <FiPlayCircle /> Search Results for “{query}”
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {videos.map((video) => (
              <motion.div
                key={video.id}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <iframe
                  width="100%"
                  height="250"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  className="rounded-t-2xl"
                  allowFullScreen
                ></iframe>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{video.title}</h3>
                  <p className="text-sm text-gray-600">📺 {video.channel}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* 📚 Courses */}
      {!loading && courses.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center justify-center gap-2">
            <FiBookOpen /> Related Courses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {courses.map((course, idx) => (
              <motion.div
                key={idx}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-5 text-left hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{course.title}</h3>
                <p className="text-gray-600 mb-3">{course.description}</p>
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  View Course →
                </a>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* 🌟 Recommended Section */}
      {!loading && recommended.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center justify-center">
            🌟 Recommended For You
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map((video) => (
              <motion.div
                key={video.id}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
              >
                <iframe
                  width="100%"
                  height="250"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  className="rounded-t-2xl"
                  allowFullScreen
                ></iframe>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{video.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
