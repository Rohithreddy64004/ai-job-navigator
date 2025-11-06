import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiBriefcase,
  FiBook,
  FiMessageSquare,
  FiActivity,
  FiSettings,
  FiBell,
  FiSun,
  FiMoon,
  FiTrendingUp,
  FiHome,
  FiClock, // New icon for recent activity
  FiCheckCircle, // New icon for a success feature
} from "react-icons/fi";
import { motion } from "framer-motion";

// --- Main Dashboard Component ---
export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  // Initial fake data for recent activity
  const [recent, setRecent] = useState([
    { name: "Resume Builder", time: "1 hour ago", icon: <FiFileText /> },
    { name: "Job Recommender", time: "2 days ago", icon: <FiBriefcase /> },
    { name: "AI Tutor", time: "4 days ago", icon: <FiBook /> },
  ]); 
  const [activeUsers, setActiveUsers] = useState(5);
  const [darkMode, setDarkMode] = useState(false);
  const [section, setSection] = useState("home");

  // Load user
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) setUser(userData);
    // You might want a better auth flow, but this keeps the original logic
    // else navigate("/auth"); 
  }, [navigate]);

  // Fake activity
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers((prev) =>
        Math.max(3, Math.min(12, prev + (Math.random() > 0.5 ? 1 : -1)))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning 🌅";
    if (hour < 18) return "Good Afternoon 🌞";
    return "Good Evening 🌙";
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const goTo = (name) => setSection(name);
  const handleResumeScoreRedirect = () => navigate("/resumescore");

  return (
    <div
      className={`flex min-h-screen ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-50 via-white to-blue-100"
      } transition-all duration-500`}
    >
      {/* Sidebar */}
      <aside
        className={`${
          darkMode ? "bg-gray-800" : "bg-indigo-700"
        } text-white ${collapsed ? "w-20" : "w-64"} transition-all duration-300 flex flex-col p-4 relative shadow-2xl z-20`}
      >
        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-5 right-[-14px] z-30 p-1 rounded-full bg-indigo-500 hover:bg-indigo-600 transition shadow-lg"
        >
          {collapsed ? <FiChevronRight size={22} /> : <FiChevronLeft size={22} />}
        </button>

        {/* Sidebar Title */}
        <h1
          className={`font-extrabold text-2xl mt-3 mb-6 tracking-wide transition-all duration-500 ${
            collapsed ? "opacity-0 h-0" : "opacity-100 h-auto"
          }`}
        >
          AI Job Navigator
        </h1>
        {collapsed && <FiTrendingUp size={30} className="mb-6 mx-auto" />}

        {/* Sidebar Nav */}
        <nav className="flex flex-col gap-2">
          <SidebarButton icon={<FiHome />} label="Home" collapsed={collapsed} active={section === "home"} onClick={() => goTo("home")} />
          <SidebarButton icon={<FiFileText />} label="Resume Builder" collapsed={collapsed} onClick={() => navigate("/resume-generator")} />
          <SidebarButton icon={<FiBriefcase />} label="Job Recommender" collapsed={collapsed} onClick={() => navigate("/job-recommender")} />
          <SidebarButton icon={<FiBook />} label="AI Tutor" collapsed={collapsed} onClick={() => navigate("/ai-tutor")} />
          <SidebarButton icon={<FiMessageSquare />} label="AI Student Bot" collapsed={collapsed} onClick={() => navigate("/ai-student")} />
          <SidebarButton icon={<FiTrendingUp />} label="Resume Score" collapsed={collapsed} onClick={handleResumeScoreRedirect} />
          <div className="border-t border-indigo-600 my-2"></div>
          <SidebarButton icon={<FiUser />} label="Profile" collapsed={collapsed} active={section === "profile"} onClick={() => goTo("profile")} />
          <SidebarButton icon={<FiSettings />} label="Settings" collapsed={collapsed} active={section === "settings"} onClick={() => goTo("settings")} />
        </nav>

        {/* Footer */}
        <div className="mt-auto space-y-3">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 p-3 bg-red-600 hover:bg-red-700 rounded-lg transition w-full text-sm font-semibold"
          >
            <FiLogOut /> {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Section */}
      <main className="flex-1 flex flex-col p-8 relative overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">
              {getGreeting()} <span className="font-extrabold">{user?.name || "User"}</span>
            </h1>
            <p className="text-md text-gray-600 dark:text-gray-400">
              Your AI-powered launchpad for career success.
            </p>
          </div>

          {/* Top Right Buttons */}
          <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:scale-110 transition shadow-md"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <button 
              className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:scale-110 transition shadow-md relative"
              title="Notifications"
            >
              <FiBell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Conditional Sections */}
        {section === "home" && (
          <HomeSection activeUsers={activeUsers} recent={recent} navigate={navigate} />
        )}
        {section === "profile" && (
          <ProfileSection user={user} setUser={setUser} />
        )}
        {section === "settings" && (
          <SettingsSection darkMode={darkMode} setDarkMode={setDarkMode} />
        )}
      </main>
    </div>
  );
}

// --- Component Definitions ---

// ✅ Sidebar Button (Added 'active' prop for styling)
function SidebarButton({ icon, label, collapsed, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg transition text-sm font-medium ${
        active 
          ? 'bg-indigo-900 shadow-inner' // Active style
          : 'hover:bg-indigo-600' // Inactive style
      } ${collapsed ? 'justify-center' : ''}`}
    >
      {icon} {!collapsed && <span>{label}</span>}
    </button>
  );
}

// ✅ Home Section (Updated to a two-column layout)
function HomeSection({ activeUsers, recent, navigate }) {
  const handleResumeScoreRedirect = () => navigate("/resumescore");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full"
    >
        {/* Left/Main Column (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-6">
            {/* 3 Stat Cards at the top */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<FiActivity />} title="Active Users" value={`${activeUsers} Online`} theme="blue" />
                <StatCard icon={<FiBook />} title="Modules Used" value={`${recent.length || 0} Modules`} theme="green" />
                <StatCard icon={<FiCheckCircle />} title="Success Rate" value={`85% Match`} theme="purple" />
            </div>

            {/* Featured Resume Score Card */}
            <motion.div
                whileHover={{ y: -5 }}
                onClick={handleResumeScoreRedirect}
                className="p-8 rounded-2xl shadow-xl cursor-pointer bg-gradient-to-r from-indigo-600 to-indigo-800 text-white dark:from-indigo-700 dark:to-indigo-900"
            >
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-extrabold mb-1">Boost Your Career: Check Your Resume Score!</h2>
                        <p className="text-indigo-200">Get instant, AI-driven feedback to optimize your application for better job matches.</p>
                    </div>
                    <FiTrendingUp size={45} className="text-white opacity-70" />
                </div>
                <button className="mt-4 bg-white text-indigo-700 font-bold py-2 px-6 rounded-full hover:bg-indigo-50 transition shadow-lg">
                    Analyze Resume
                </button>
            </motion.div>
        </div>

        {/* Right/Sidebar Column (1/3 width on large screens) */}
        <div className="lg:col-span-1">
            <RecentActivityCard recent={recent} navigate={navigate} />
        </div>
    </motion.div>
  );
}

// ✅ Stat Card (Updated with color theme)
function StatCard({ icon, title, value, theme }) {
    const themeStyles = {
        blue: "border-blue-500 text-blue-700 dark:text-blue-300",
        green: "border-green-500 text-green-700 dark:text-green-300",
        purple: "border-purple-500 text-purple-700 dark:text-purple-300",
    };

    return (
        <motion.div
            whileHover={{ scale: 1.03, boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)" }}
            className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-start border-t-4 ${themeStyles[theme] || themeStyles.blue}`}
        >
            <div className={`text-3xl mb-3 ${themeStyles[theme]}`}>
                {icon}
            </div>
            <h3 className="font-medium text-gray-500 dark:text-gray-400">{title}</h3>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                {value}
            </p>
        </motion.div>
    );
}

// ✅ New: Recent Activity Card
function RecentActivityCard({ recent, navigate }) {
    const moduleRoutes = {
        "Resume Builder": "/resume-generator",
        "Job Recommender": "/job-recommender",
        "AI Tutor": "/ai-tutor"
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 h-full"
        >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                <FiClock /> Recent Activity
            </h3>
            <div className="space-y-3">
                {recent.map((item, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ x: 5 }}
                        onClick={() => navigate(moduleRoutes[item.name] || '#')}
                        className="flex justify-between items-center p-3 rounded-lg transition cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 border-b dark:border-gray-700"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-indigo-500 dark:text-indigo-400">{item.icon}</span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">{item.name}</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{item.time}</span>
                    </motion.div>
                ))}
            </div>
            {recent.length === 0 && (
                 <p className="text-center text-gray-500 dark:text-gray-400 mt-6">No recent activity found.</p>
            )}
        </motion.div>
    );
}

// ✅ Profile Section (UI Polish)
function ProfileSection({ user, setUser }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ ...user });

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(form));
    setUser(form);
    setEdit(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-indigo-600 dark:text-indigo-300 border-b pb-2">
        <FiUser className="inline mr-2" /> User Profile
      </h2>
      {edit ? (
        <div className="space-y-4">
          <input
            className="p-3 border border-gray-300 rounded-lg w-full dark:bg-gray-700 dark:border-gray-600"
            value={form.name}
            placeholder="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="p-3 border border-gray-300 rounded-lg w-full dark:bg-gray-700 dark:border-gray-600"
            value={form.email}
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition"
          >
            Save Changes
          </motion.button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-lg"><strong>Name:</strong> <span className="text-indigo-600 dark:text-indigo-400">{user?.name}</span></p>
          <p className="text-lg"><strong>Email:</strong> <span className="text-indigo-600 dark:text-indigo-400">{user?.email}</span></p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {setEdit(true); setForm({...user})}}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <FiSettings /> Edit Profile
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

// ✅ Settings Section (UI Polish)
function SettingsSection({ darkMode, setDarkMode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-indigo-600 dark:text-indigo-300 border-b pb-2">
        <FiSettings className="inline mr-2" /> Application Settings
      </h2>
      <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700">
              <span className="font-medium">Dark Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                  <input
                      type="checkbox"
                      checked={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                      className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700">
              <span className="font-medium">Receive Email Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
          </div>
      </div>
    </motion.div>
  );
}