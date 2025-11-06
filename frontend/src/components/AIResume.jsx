import React, { useState } from "react";
// Loader2, Eye, and Download icons from lucide-react are available for use
import { Loader2, Eye, Download, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
// Removed useNavigate import as it's not supported in this environment

// --- Custom Notification Component (Replaces window.alert) ---
const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  const baseClasses = "fixed top-5 right-5 z-50 p-4 rounded-xl shadow-2xl transition-opacity duration-300 flex items-center justify-between gap-3 font-semibold min-w-[300px]";
  let typeClasses = "";
  let IconComponent = AlertTriangle;

  switch (type) {
    case "success":
      typeClasses = "bg-green-500 text-white border-l-4 border-green-700";
      IconComponent = CheckCircle;
      break;
    case "error":
      typeClasses = "bg-red-500 text-white border-l-4 border-red-700";
      IconComponent = XCircle;
      break;
    case "warning":
    default:
      typeClasses = "bg-yellow-400 text-gray-800 border-l-4 border-yellow-600";
      IconComponent = AlertTriangle;
      break;
  }

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <div className="flex items-center gap-3">
        <IconComponent className="w-5 h-5" />
        <span>{message}</span>
      </div>
      <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition">
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
};
// -----------------------------------------------------------

export default function AIResume() {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", linkedin: "", github: "", portfolio: "", location: "",
    degree: "", college: "", university: "", duration: "", cgpa: "",
    experience: "", company: "", role: "", exp_duration: "", responsibilities: "",
    skills: "",
    project1: "", project1_desc: "", project2: "", project2_desc: "",
    certifications: "", achievements: "", summary: "",
    role_type: "fresher",
  });

  const [loading, setLoading] = useState(false);
  const [resumeURL, setResumeURL] = useState(null);
  const [notification, setNotification] = useState({ message: null, type: null });

  // Utility to show notification (instead of alert)
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: null, type: null }), 5000);
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Generate Resume PDF (Backend Integration)
  const handleGenerate = async () => {
    if (!formData.name || !formData.email) {
      showNotification("Please fill out your Name and Email to proceed!", "warning");
      return;
    }

    setLoading(true);
    setResumeURL(null);

    try {
      // NOTE: This API call is assumed to be working for the purpose of the UI demo.
      // In a real application, the fetch URL and method would be validated.
      const res = await fetch("http://127.0.0.1:8000/api/resume/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(`Resume generation failed (${res.status})`);

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setResumeURL(url);
      showNotification("Resume generated successfully! View and download now.", "success");
    } catch (err) {
      console.error("❌ Resume Generation Error:", err);
      showNotification("Failed to generate resume. Please check the console for details.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Download PDF
  const handleDownload = () => {
    if (!resumeURL) return;
    const a = document.createElement("a");
    a.href = resumeURL;
    a.download = `${formData.name || 'Your'}_AI_Hybrid_Resume.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const InputField = ({ name, placeholder, type = "text", rows = 1 }) => {
    const isTextArea = rows > 1;
    const commonClasses = "border border-gray-300 rounded-xl p-4 w-full focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 text-gray-700";
    
    const Component = isTextArea ? 'textarea' : 'input';

    return (
        <Component
          name={name}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
          type={type}
          rows={rows}
          className={isTextArea ? `${commonClasses} resize-none` : commonClasses}
        />
    );
  };

  const SectionCard = ({ title, icon, children }) => (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-indigo-100 mb-8">
      <h3 className="text-xl font-bold text-indigo-700 mb-5 flex items-center gap-3 border-b pb-3 border-indigo-100">
        <span className="text-2xl">{icon}</span> {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 md:p-10 font-sans">
      <Notification 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: null, type: null })}
      />

      {/* Header */}
      <div className="w-full max-w-6xl mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-800 mb-2">
          🤖 AI Hybrid Resume Builder
        </h1>
        <p className="text-lg text-gray-500">
          Craft your perfect resume using a smart, data-driven template.
        </p>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-5xl">
        
        {/* PERSONAL INFO */}
        <SectionCard title="Contact Information" icon="👤">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField name="name" placeholder="Full Name *" />
            <InputField name="email" placeholder="Email *" />
            <InputField name="phone" placeholder="Phone Number" />
            <InputField name="location" placeholder="City, Country" />
            <InputField name="linkedin" placeholder="LinkedIn Profile URL" />
            <InputField name="github" placeholder="GitHub Profile URL" />
            <InputField name="portfolio" placeholder="Portfolio/Website URL" />
          </div>
        </SectionCard>

        {/* SUMMARY */}
        <SectionCard title="Professional Summary" icon="📝">
          <InputField name="summary" placeholder="Write a concise professional summary or leave blank for AI generation..." rows={4} />
        </SectionCard>

        {/* EDUCATION */}
        <SectionCard title="Education" icon="🎓">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField name="degree" placeholder="Degree/Major" />
            <InputField name="college" placeholder="College/Institution" />
            <InputField name="university" placeholder="University Name" />
            <InputField name="duration" placeholder="Duration (e.g., 2020 - 2024)" />
            <InputField name="cgpa" placeholder="CGPA / Grade" />
          </div>
        </SectionCard>

        {/* EXPERIENCE */}
        <SectionCard title="Experience / Internship" icon="💼">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <InputField name="company" placeholder="Company Name" />
            <InputField name="role" placeholder="Your Role/Title" />
            <InputField name="exp_duration" placeholder="Duration (e.g., 1 year 6 months)" />
          </div>
          <InputField name="responsibilities" placeholder="Key Achievements and Responsibilities (use bullet points or separate lines for clarity)" rows={5} />
        </SectionCard>

        {/* SKILLS & CERTIFICATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <SectionCard title="Technical Skills" icon="💻">
                <InputField name="skills" placeholder="List your top skills (e.g., Python, React, AWS, SQL)" rows={3} />
            </SectionCard>
            <SectionCard title="Certifications" icon="🏆">
                <InputField name="certifications" placeholder="List certifications/online courses (comma separated)" rows={3} />
            </SectionCard>
        </div>


        {/* PROJECTS */}
        <SectionCard title="Projects" icon="📊">
          <h4 className="text-base font-semibold text-gray-600 mb-3">Project 1</h4>
          <InputField name="project1" placeholder="Project 1 Name" />
          <InputField name="project1_desc" placeholder="Brief description of Project 1 (Tech stack, results, impact)" rows={3} />
          
          <h4 className="text-base font-semibold text-gray-600 mb-3 mt-6">Project 2</h4>
          <InputField name="project2" placeholder="Project 2 Name" />
          <InputField name="project2_desc" placeholder="Brief description of Project 2 (Tech stack, results, impact)" rows={3} />
        </SectionCard>
        
        {/* ACHIEVEMENTS & RESUME TYPE */}
        <SectionCard title="Additional Info" icon="🌟">
          <InputField name="achievements" placeholder="Mention workshops, hackathons, academic awards, etc." rows={3} />
          
          <div className="mt-6 flex items-center gap-4">
            <label className="font-medium text-gray-600">Resume Focus:</label>
            <select
              name="role_type"
              value={formData.role_type}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            >
              <option value="fresher">🎓 Fresher / Entry-Level</option>
              <option value="professional">💼 Experienced Professional</option>
              <option value="college_student">🏫 Intern / Student</option>
            </select>
          </div>
        </SectionCard>
        
        {/* Generate Button */}
        <div className="mt-10 text-center">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`
              ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"} 
              text-white px-10 py-4 rounded-full text-lg font-bold shadow-2xl shadow-indigo-300/80 transition-all duration-300 transform hover:scale-[1.02] active:scale-100
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <Loader2 className="animate-spin w-5 h-5" /> AI Processing...
              </span>
            ) : (
              "🚀 Generate AI Hybrid Resume"
            )}
          </button>
        </div>

        {/* Resume Preview + Download */}
        {resumeURL && (
          <div className="mt-12 p-6 bg-indigo-50 rounded-2xl shadow-inner border border-indigo-200 text-center">
            <h3 className="text-xl font-bold text-indigo-700 mb-4 flex justify-center items-center gap-2">
              🎯 Resume Ready!
            </h3>
            <div className="flex justify-center gap-4">
              <a
                href={resumeURL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full flex items-center gap-2 transition shadow-md hover:shadow-lg"
              >
                <Eye className="w-5 h-5" /> View Resume
              </a>
              <button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full flex items-center gap-2 transition shadow-md hover:shadow-lg"
              >
                <Download className="w-5 h-5" /> Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
