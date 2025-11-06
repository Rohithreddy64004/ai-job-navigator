import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import ForgotPassword from "./components/ForgotPassword"; // ✅ Import Forgot Password page
import ResetPassword from "./components/ResetPassword"; // ✅ Import Reset Password page

// ✅ Import your Chat Agent component
import ChatAgent from "./components/ChatAgent";

export default function App() {
  return (
    <Router>
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

          {/* Auth Page (Login / Signup) */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Admin Dashboard */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />


          

          {/* User Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume-generator" element={<ResumeGenerator />} />
          <Route path="/job-recommender" element={<JobRecommender />} />
          <Route path="/ai-resume" element={<AIResume />} />
          <Route path="/resume-templates" element={<ResumeTemplates />} />
          <Route path="/ai-tutor" element={<AiTutor />} />
          <Route path="/ai-student" element={<AiStudent />} />
          <Route path="/resumescore" element={<ResumeScorer />} />
        </Routes>

        {/* ✅ Add ChatAgent outside Routes so it's visible on all pages */}
        <ChatAgent />
      </div>
    </Router>
  );
}
