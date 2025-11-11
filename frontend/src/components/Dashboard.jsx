import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser, FiLogOut, FiChevronLeft, FiChevronRight, FiFileText, FiBriefcase,
  FiBook, FiMessageSquare, FiActivity, FiSettings, FiBell, FiSun, FiMoon,
  FiTrendingUp, FiHome, FiClock, FiCheckCircle, FiMenu
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// --- Main Dashboard Component ---
export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New state for mobile overlay
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
    if (!userData) {
      // Optional: Redirect to login if no user data
      // navigate("/login");
      // Set dummy user for display if needed
      setUser({ name: "Guest User", email: "guest@ai.com" });
    } else {
      setUser(userData);
    }
  }, [navigate]);

  // Apply dark mode class to HTML body
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Fake activity
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev =>
        Math.max(3, Math.min(12, prev + (Math.random() > 0.5 ? 1 : -1)))
      );
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning 🌅";
    if (hour < 18) return "Good Afternoon 🌞";
    return "Good Evening 🌙";
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const goTo = (name) => {
    setSection(name);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false); // Close menu on mobile after selection
  };
  const handleResumeScoreRedirect = () => navigate("/resumescore");

  const sidebarVariants = {
    open: { width: 256 },
    collapsed: { width: 80 },
    mobileClosed: { x: '-100%' },
    mobileOpen: { x: 0 },
  };

  return (
    <div
      className={`flex min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gray-950 text-gray-100"
          : "bg-gradient-to-br from-gray-50 via-white to-blue-100"
      }`}
    >
      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar - Combined fixed/static and mobile states */}
      <motion.aside
        initial={false}
        animate={isMobileMenuOpen ? "mobileOpen" : (collapsed ? "collapsed" : "open")}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`${
          darkMode ? "bg-gray-900 border-r border-gray-800" : "bg-indigo-700"
        } text-white fixed h-full flex flex-col p-0 shadow-xl z-50 overflow-hidden`}
        aria-label="Sidebar Navigation"
      >
        {/* Toggle Button for Desktop/Tablet */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`absolute top-4 ${collapsed ? 'right-2' : 'right-4'} p-2 rounded-full 
                      ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-indigo-600 hover:bg-indigo-800'} 
                      shadow-md transition hidden md:block z-10`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
        </button>
        
        {/* Branding & Mobile Close Button */}
        <div className={`flex ${collapsed ? 'justify-center' : 'justify-start'} items-center p-4 h-16 transition-all duration-300`}>
          {collapsed ? (
            <FiTrendingUp size={32} className="transition-all duration-300" />
          ) : (
            <h1 className="font-extrabold text-2xl tracking-tight text-white transition-all duration-300">AI Job Navigator</h1>
          )}
          {/* Mobile Close Button (X) */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden absolute top-4 right-4 p-2"
            aria-label="Close menu"
          >
            <FiMenu size={24} className="transform rotate-90" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex flex-col gap-1 mt-4 p-2 overflow-y-auto flex-1">
          <SidebarButton icon={<FiHome />} label="Home" collapsed={collapsed} active={section === "home"} onClick={() => goTo("home")} />
          <SidebarButton icon={<FiFileText />} label="Resume Builder" collapsed={collapsed} onClick={() => navigate("/resume-generator")} />
          <SidebarButton icon={<FiBriefcase />} label="Job Recommender" collapsed={collapsed} onClick={() => navigate("/job-recommender")} />
          <SidebarButton icon={<FiBook />} label="AI Tutor" collapsed={collapsed} onClick={() => navigate("/ai-tutor")} />
          <SidebarButton icon={<FiMessageSquare />} label="AI Student Bot" collapsed={collapsed} onClick={() => navigate("/ai-student")} />
          <SidebarButton icon={<FiTrendingUp />} label="Resume Score" collapsed={collapsed} onClick={handleResumeScoreRedirect} />
          
          {/* Divider */}
          <hr className="my-3 border-indigo-500 opacity-70 dark:border-gray-700" />

          <SidebarButton icon={<FiUser />} label="Profile" collapsed={collapsed} active={section === "profile"} onClick={() => goTo("profile")} />
          <SidebarButton icon={<FiSettings />} label="Settings" collapsed={collapsed} active={section === "settings"} onClick={() => goTo("settings")} />
        </nav>
        
        {/* Sidebar Footer (Logout) */}
        <div className="mt-auto p-4 border-t border-indigo-500 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 p-3 font-medium rounded-lg 
                        bg-red-600 hover:bg-red-700 transition w-full text-sm justify-center shadow-lg 
                        ${collapsed ? 'text-lg' : ''}`}
            aria-label="Logout"
          >
            <FiLogOut /> {!collapsed && "Logout"}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col p-4 md:p-8 overflow-y-auto max-w-full ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        {/* Mobile Header & Toggle */}
        <header className={`sticky top-0 z-30 w-full p-4 md:p-0 flex justify-between items-center md:hidden 
                           ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-white shadow-md'}`}>
          <h1 className="text-xl font-bold text-indigo-700 dark:text-indigo-200">AI Navigator</h1>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-full bg-indigo-500 text-white shadow"
            aria-label="Open sidebar menu"
          >
            <FiMenu size={24} />
          </button>
        </header>

        {/* Desktop Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pt-4 md:pt-0 border-b dark:border-gray-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-200">
              {getGreeting()} <span className="font-extrabold">{user?.name || "User"}</span>
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Your AI-powered launchpad for career success.
            </p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0 items-center">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:scale-105 shadow-md transition-transform duration-200"
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            {/* Notifications */}
            <button
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 shadow-md transition relative hover:scale-105 duration-200"
              aria-label="Notifications"
            >
              <FiBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>
          </div>
        </header>

        {/* Conditional Sections */}
        <AnimatePresence mode="wait">
          {section === "home" && (
            <HomeSection key="home" activeUsers={activeUsers} recent={recent} navigate={navigate} />
          )}
          {section === "profile" && (
            <ProfileSection key="profile" user={user} setUser={setUser} />
          )}
          {section === "settings" && (
            <SettingsSection key="settings" darkMode={darkMode} setDarkMode={setDarkMode} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// Sidebar Nav Button
function SidebarButton({ icon, label, collapsed, onClick, active }) {
  const buttonVariants = {
    open: { opacity: 1, x: 0 },
    collapsed: { opacity: 1, x: 0 },
  };

  return (
    <motion.button
      initial={false}
      animate={collapsed ? "collapsed" : "open"}
      variants={buttonVariants}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 my-1 rounded-lg transition font-medium text-sm w-full 
        ${
          active
            ? "bg-indigo-900 shadow-inner text-white"
            : "hover:bg-indigo-600 hover:text-white"
        } 
        ${collapsed ? "justify-center" : "justify-start"}`}
      aria-label={label}
      tabIndex={0}
      title={label}
    >
      {icon}
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Home Section
function HomeSection({ activeUsers, recent, navigate }) {
  const handleResumeScoreRedirect = () => navigate("/resumescore");
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 32 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full"
    >
      {/* Main Stat Cards */}
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard icon={<FiActivity />} title="Active Users" value={`${activeUsers} Online`} theme="blue" />
          <StatCard icon={<FiBook />} title="Modules Used" value={`${recent.length || 0}`} theme="green" />
          <StatCard icon={<FiCheckCircle />} title="Success Rate" value={`85% Match`} theme="purple" />
        </div>
        
        {/* Call to Action Card */}
        <motion.div
          whileHover={{ y: -6, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          onClick={handleResumeScoreRedirect}
          className="p-8 rounded-2xl shadow-xl cursor-pointer bg-gradient-to-r from-indigo-600 to-indigo-800 text-white transition duration-300"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl font-extrabold mb-2">🚀 Boost Your Career: Check Your Resume Score!</h2>
              <p className="opacity-85 text-indigo-200 text-sm">Get instant, AI-driven feedback to optimize your job application.</p>
            </div>
            <FiTrendingUp size={40} className="mt-6 md:mt-0 text-white opacity-70 hidden md:block" />
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-5 bg-white text-indigo-700 font-bold py-2 px-5 rounded-full hover:bg-indigo-50 transition shadow-lg text-base"
          >
            Analyze Resume
          </motion.button>
        </motion.div>
      </div>
      {/* Recent Activity */}
      <div className="lg:col-span-1">
        <RecentActivityCard recent={recent} navigate={navigate} />
      </div>
    </motion.div>
  );
}

// Stat Card
function StatCard({ icon, title, value, theme }) {
  const themeStyles = {
    blue: "border-blue-500 text-blue-700 dark:text-blue-300",
    green: "border-green-500 text-green-700 dark:text-green-300",
    purple: "border-purple-500 text-purple-700 dark:text-purple-300",
  };
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.04, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
      className={`bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg flex flex-col items-start border-t-4 transition duration-300 ${themeStyles[theme] || themeStyles.blue}`}
    >
      <div className={`text-2xl mb-2 ${themeStyles[theme]}`}>{icon}</div>
      <h3 className="font-medium text-gray-500 dark:text-gray-400 text-xs mb-1 uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{value}</p>
    </motion.div>
  );
}

// Recent Activity
function RecentActivityCard({ recent, navigate }) {
  const moduleRoutes = {
    "Resume Builder": "/resume-generator",
    "Job Recommender": "/job-recommender",
    "AI Tutor": "/ai-tutor",
    "AI Student Bot": "/ai-student", // Added missing route
  };
  return (
    <motion.div 
      initial={{ opacity: 0, x: 24 }} 
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 h-full border dark:border-gray-800"
    >
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700 dark:text-indigo-200">
        <FiClock /> Recent Activity
      </h3>
      <div className="space-y-2">
        {recent.map((item, index) => (
          <motion.div 
            key={index} 
            whileHover={{ x: 7 }}
            onClick={() => navigate(moduleRoutes[item.name] || '#')}
            className="flex justify-between items-center p-3 rounded-lg cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-800 transition duration-150 border-b dark:border-gray-800 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <span className="text-indigo-500 dark:text-indigo-400">{item.icon}</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{item.name}</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{item.time}</span>
          </motion.div>
        ))}
      </div>
      {recent.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">No recent activity found.</p>
      )}
    </motion.div>
  );
}

// Profile Section
function ProfileSection({ user, setUser }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  
  // Update form state when user prop changes (e.g., initial load)
  useEffect(() => {
      setForm({ name: user?.name || '', email: user?.email || '' });
  }, [user]);

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(form));
    setUser(form);
    setEdit(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-md mx-auto border dark:border-gray-800"
    >
      <h2 className="text-2xl font-bold mb-8 text-indigo-700 dark:text-indigo-200 border-b dark:border-gray-800 pb-2 flex items-center gap-2">
        <FiUser /> User Profile
      </h2>
      {edit ? (
        <form className="space-y-5" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Name</label>
            <input className="p-3 border border-gray-300 rounded-lg w-full dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
              value={form.name} placeholder="Name"
              onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Email</label>
            <input className="p-3 border border-gray-300 rounded-lg w-full dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
              value={form.email} placeholder="Email" type="email"
              onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-800 transition w-full">
            Save Changes
          </motion.button>
        </form>
      ) : (
        <div className="space-y-4 text-base">
          <p><span className="font-bold text-gray-700 dark:text-gray-300">Name:</span> <span className="text-indigo-700 dark:text-indigo-300 ml-2">{user?.name || 'N/A'}</span></p>
          <p><span className="font-bold text-gray-700 dark:text-gray-300">Email:</span> <span className="text-indigo-700 dark:text-indigo-300 ml-2">{user?.email || 'N/A'}</span></p>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => { setEdit(true); setForm({ name: user?.name || '', email: user?.email || '' }); }}
            className="mt-4 bg-indigo-700 text-white px-5 py-3 rounded-lg font-medium shadow-md hover:bg-indigo-800 transition flex items-center justify-center gap-2 w-full">
            <FiSettings /> Edit Profile
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

// Settings Section
function SettingsSection({ darkMode, setDarkMode }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-md mx-auto border dark:border-gray-800"
    >
      <h2 className="text-2xl font-bold mb-8 text-indigo-700 dark:text-indigo-200 border-b dark:border-gray-800 pb-2 flex items-center gap-2">
        <FiSettings /> Settings
      </h2>
      <div className="space-y-6">
        <ToggleRow label="Dark Mode" checked={darkMode} setChecked={setDarkMode} icon={<FiMoon />} />
        <ToggleRow label="Email Notifications" checked={true} readOnly icon={<FiBell />} />
      </div>
    </motion.div>
  );
}

// Toggle Row Component for settings (FIXED STYLING)
function ToggleRow({ label, checked, setChecked, readOnly, icon }) {
  return (
    <motion.div 
        whileHover={{ scale: 1.01, backgroundColor: "rgba(240, 240, 240, 0.1)" }}
        className="flex items-center justify-between p-4 rounded-xl border dark:border-gray-800 transition-colors"
    >
      <span className="font-medium text-base flex items-center gap-3 text-gray-700 dark:text-gray-300">
        <span className="text-indigo-500">{icon}</span> {label}
      </span>
      <label className="inline-flex items-center cursor-pointer">
        <input 
            type="checkbox" 
            checked={checked} 
            onChange={() => setChecked && setChecked(!checked)} 
            disabled={readOnly}
            className="sr-only peer" 
        />
        <div className="w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded-full transition-all duration-300 peer-checked:bg-indigo-600 relative">
          <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 transition-transform duration-300 shadow-md ${
            checked ? "translate-x-6 bg-white" : ""
          }`}></div>
        </div>
      </label>
    </motion.div>
  );
}