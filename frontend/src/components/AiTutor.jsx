import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiBookOpen, FiPlayCircle, FiArrowLeft } from "react-icons/fi";
const apiUrl = import.meta.env.VITE_API_URL;

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
        const res = await fetch(`${apiUrl}/api/recommended_videos`);
        const data = await res.json();
        setRecommended(data.videos || []);

        const courseRes = await fetch(`${apiUrl}/api/recommended_courses`);
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
      const videoRes = await fetch(`${apiUrl}/api/youtube_videos?q=${query}`);
      const videoData = await videoRes.json();
      setVideos(videoData.videos || []);

      const courseRes = await fetch(`${apiUrl}/api/recommended_courses?q=${query}`);
      const courseData = await courseRes.json();
      setCourses(courseData.courses || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    window.history.back(); // Navigate back or customize
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-8 md:p-12 relative">
      {/* Back arrow */}
      <button
        onClick={goBack}
        aria-label="Go back"
        className="absolute top-6 left-6 p-2 rounded-full bg-white/70 shadow-md hover:bg-white transition"
      >
        <FiArrowLeft size={24} className="text-indigo-700" />
      </button>

      <motion.h1
        className="text-5xl font-bold text-blue-700 text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🤖 AI Tutor Dashboard
      </motion.h1>
      <p className="text-center text-gray-700 mb-12 max-w-3xl mx-auto text-lg">
        Learn smarter with AI-curated videos, personalized courses, and topic recommendations.
      </p>

      {/* Search Bar */}
      <motion.div
        className="flex justify-center mb-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex w-full max-w-3xl bg-white/80 backdrop-blur-md rounded-full shadow-md overflow-hidden border border-gray-200">
          <input
            type="text"
            placeholder="Search for a topic (e.g., Python, Machine Learning)..."
            className="flex-grow px-6 py-3 text-gray-800 bg-transparent focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 flex items-center justify-center hover:bg-blue-700 transition-all"
            aria-label="Search"
          >
            <FiSearch size={20} />
          </button>
        </div>
      </motion.div>

      {/* Popular Topics */}
      <div className="flex flex-wrap justify-center gap-4 mb-14 max-w-4xl mx-auto">
        {popularTopics.map((topic) => (
          <motion.button
            key={topic}
            className="bg-blue-100 text-blue-700 px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-600 hover:text-white transition shadow-sm"
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

      {/* Loading */}
      {loading && (
        <motion.div
          className="flex justify-center items-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-4 text-blue-700 font-semibold text-lg">Fetching results...</span>
        </motion.div>
      )}

      {/* Search Results */}
      {!loading && videos.length > 0 && (
        <>
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-3 max-w-4xl mx-auto">
            <FiPlayCircle /> Search Results for “{query}”
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mb-16 max-w-6xl mx-auto">
            {videos.map((video) => (
              <motion.div
                key={video.id}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <iframe
                  width="100%"
                  height="220"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  className="rounded-t-2xl"
                  allowFullScreen
                ></iframe>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800">{video.title}</h3>
                  <p className="text-sm text-gray-600">📺 {video.channel}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Courses */}
      {!loading && courses.length > 0 && (
        <>
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-3 max-w-4xl mx-auto">
            <FiBookOpen /> Related Courses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mb-16 max-w-6xl mx-auto">
            {courses.map((course, idx) => (
              <motion.div
                key={idx}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 hover:shadow-xl transition transform cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-lg font-semibold mb-3 text-gray-800">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
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

      {/* Recommended Section */}
      {!loading && recommended.length > 0 && (
        <>
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-3 max-w-4xl mx-auto">
            🌟 Recommended For You
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 max-w-6xl mx-auto">
            {recommended.map((video) => (
              <motion.div
                key={video.id}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <iframe
                  width="100%"
                  height="220"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  className="rounded-t-2xl"
                  allowFullScreen
                ></iframe>
                <div className="p-5">
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
