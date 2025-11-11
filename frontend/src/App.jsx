import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import UploadSection from "./components/UploadSection";
import Footer from "./components/Footer";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import ResumeGenerator from "./components/ResumeGenerator";
import JobRecommender from "./components/JobRecommender";
import AIResume from "./components/AIResume";
import ResumeTemplates from "./components/ResumeTemplates";
import AiTutor from "./components/AiTutor";
import AiStudent from "./components/AiStudent";
import ResumeScorer from "./components/ResumeScorer";
import AdminDashboard from "./components/AdminDashboard";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ChatAgent from "./components/ChatAgent";

function AppContent() {
  const location = useLocation();

  // ✅ Show ChatAgent only on "/" and "/dashboard"
  const showChatAgent =
    location.pathname === "/" || location.pathname === "/dashboard";

  return (
    <div className="font-sans">
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <Features />
              <HowItWorks />
              <UploadSection />
              <Footer />
            </>
          }
        />

        {/* Auth Page */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Admin Dashboard */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Password Pages */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* User Dashboard + Features */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume-generator" element={<ResumeGenerator />} />
        <Route path="/job-recommender" element={<JobRecommender />} />
        <Route path="/ai-resume" element={<AIResume />} />
        <Route path="/resume-templates" element={<ResumeTemplates />} />
        <Route path="/ai-tutor" element={<AiTutor />} />
        <Route path="/ai-student" element={<AiStudent />} />
        <Route path="/resumescore" element={<ResumeScorer />} />
      </Routes>

      {/* ✅ ChatAgent only shows on specific pages */}
      {showChatAgent && <ChatAgent />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
