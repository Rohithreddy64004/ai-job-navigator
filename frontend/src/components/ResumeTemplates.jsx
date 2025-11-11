import React, { useState, useRef } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

const ALL_TEMPLATES = [
  { id: "minimal", name: "Minimalist", color: "border-gray-400", previewStyle: "style1" },
  { id: "modern", name: "Modern Professional", color: "border-indigo-500", previewStyle: "style2" },
  { id: "elegant", name: "Elegant Classic", color: "border-purple-600", previewStyle: "style3" },
  { id: "simple", name: "Simple Standard", color: "border-green-500", previewStyle: "style1" },
  { id: "standard", name: "Standard ATS", color: "border-slate-500", previewStyle: "style1" },
  { id: "bold", name: "Bold Headers", color: "border-blue-700", previewStyle: "style2" },
  { id: "tech", name: "Tech Focused", color: "border-teal-500", previewStyle: "style2" },
  { id: "executive", name: "Executive Summary", color: "border-violet-500", previewStyle: "style3" },
  { id: "visual", name: "Visual Header", color: "border-indigo-900", previewStyle: "style3" },
  { id: "creative", name: "Creative Layout", color: "border-red-500", previewStyle: "style1" },
  { id: "academic", name: "Academic / CV", color: "border-orange-500", previewStyle: "style3" },
  { id: "two_column", name: "Two Column", color: "border-yellow-600", previewStyle: "style2" },
  { id: "clean", name: "Clean Lines", color: "border-cyan-500", previewStyle: "style1" },
  { id: "functional", name: "Functional", color: "border-pink-500", previewStyle: "style2" },
  { id: "chronological", name: "Chronological", color: "border-lime-500", previewStyle: "style3" },
  { id: "infographic", name: "Infographic Style", color: "border-fuchsia-500", previewStyle: "style1" },
  { id: "business", name: "Business Format", color: "border-rose-500", previewStyle: "style2" },
  { id: "gradient", name: "Subtle Gradient", color: "border-sky-500", previewStyle: "style3" },
  { id: "sidebar", name: "Sidebar Design", color: "border-emerald-500", previewStyle: "style2" },
  { id: "compact", name: "Compact Design", color: "border-amber-500", previewStyle: "style1" },
];

const DetailList = ({ details, isSmall = false }) => {
  if (!details) return null;
  return (
    <ul className={`list-disc ${isSmall ? "text-[8px] leading-tight" : "ml-4 text-xs"}`}>
      {details.split("\n").map((line, idx) =>
        line.trim() ? <li key={idx}>{line.trim()}</li> : null
      )}
    </ul>
  );
};


const initialFormData = {
  name: "Jane Doe",
  jobTitle: "Senior Software Developer",
  email: "jane.doe@example.com",
  phone: "(555) 987-6543",
  location: "San Francisco, CA",
  summary:
    "Highly motivated and results-driven developer with 5+ years experience building scalable web applications and real-time data pipelines.",
  experience: [
    {
      id: 1,
      title: "Software Engineer",
      company: "TechCorp Solutions",
      startDate: "Jan 2022",
      endDate: "Present",
      details:
        "• Led development of 3 full-stack applications using React/Node.\n• Implemented microservices architecture, improving reliability by 20%.",
    },
  ],
  education: [
    {
      id: 1,
      degree: "M.S. Computer Science",
      school: "State University",
      gradYear: "2020",
      details: "• Specialization in Distributed Systems.\n• Completed thesis on container orchestration.",
    },
  ],
  skills: "JavaScript (React, Node.js), Python, AWS, Docker, Kubernetes, SQL, REST APIs",
};

const SmallPreviewComponent = ({ data, style }) => {
  const firstExp = data.experience[0] || { title: "Job", company: "Company", details: "" };
  if (style === "style1")
    return (
      <div className="p-2 border border-gray-200 rounded-md bg-white h-32 overflow-hidden shadow-inner">
        <h3 className="text-[10px] font-bold text-center">{data.name || "Your Name"}</h3>
        <hr className="my-0.5 border-gray-400" />
        <p className="text-[8px] font-semibold">
          {firstExp.title} at {firstExp.company}
        </p>
        <DetailList details={firstExp.details.substring(0, 50)} isSmall={true} />
      </div>
    );
  if (style === "style2")
    return (
      <div className="p-2 border border-indigo-200 rounded-md bg-white h-32 overflow-hidden shadow-inner">
        <div className="bg-indigo-100 p-0.5 mb-1">
          <h3 className="text-[10px] font-extrabold text-indigo-800 text-center leading-tight">{data.name || "Your Name"}</h3>
        </div>
        <p className="text-[8px] text-indigo-600 font-semibold">{firstExp.title}</p>
        <DetailList details={firstExp.details.substring(0, 50)} isSmall={true} />
      </div>
    );
  if (style === "style3")
    return (
      <div className="p-2 border border-purple-300 rounded-md bg-white h-32 overflow-hidden shadow-inner border-l-4">
        <h3 className="text-[10px] font-serif font-light mb-0.5">{data.name || "Your Name"}</h3>
        <p className="text-[8px] text-purple-700 font-semibold">{data.jobTitle || "Your Role"}</p>
        <hr className="my-0.5 border-purple-300" />
        <DetailList details={firstExp.details.substring(0, 50)} isSmall={true} />
      </div>
    );
  return (
    <div className="h-32 p-2 text-xs flex items-center justify-center border border-gray-200 rounded-md">No Preview Available</div>
  );
};

const FullResumeTemplateView = React.forwardRef(({ data, style }, ref) => {
  const ContactInfo = (className = "text-center text-sm mb-4") => (
    <div className={className}>
      <p className="text-gray-600 leading-tight">
        {data.email || "Email"} | {data.phone || "Phone"} | {data.location || "Location"}
      </p>
    </div>
  );
  const renderExperience = () =>
    data.experience.map((exp, index) => (
      <div key={exp.id || index} className="mb-3">
        <div className="flex justify-between font-semibold">
          <span>
            {exp.title} at {exp.company}
          </span>
          <span className="text-sm text-gray-600">
            {exp.startDate} - {exp.endDate}
          </span>
        </div>
        <DetailList details={exp.details} />
      </div>
    ));
  const renderEducation = () =>
    data.education.map((edu, index) => (
      <div key={edu.id || index} className="mb-3">
        <div className="flex justify-between font-semibold">
          <span>
            {edu.degree} from {edu.school}
          </span>
          <span className="text-sm text-gray-600">{edu.gradYear}</span>
        </div>
        <DetailList details={edu.details} />
      </div>
    ));
  if (style === "style1") {
    return (
      <div
        ref={ref}
        className="p-8 bg-white shadow-xl max-w-4xl mx-auto my-8 border-t-8 border-gray-700 text-gray-900 font-sans"
      >
        <h1 className="text-3xl font-bold mb-1 text-center">{data.name || "YOUR NAME"}</h1>
        <h2 className="text-xl text-gray-700 mb-2 text-center">{data.jobTitle || "Your Current Role"}</h2>
        {ContactInfo()}
        <h2 className="text-lg font-bold uppercase mt-4 mb-1 border-b border-gray-400">Summary</h2>
        <p className="text-sm">{data.summary || "Write a brief professional summary here."}</p>
        <h2 className="text-lg font-bold uppercase mt-4 mb-1 border-b border-gray-400">Experience</h2>
        {renderExperience()}
        <h2 className="text-lg font-bold uppercase mt-4 mb-1 border-b border-gray-400">Education</h2>
        {renderEducation()}
        <h2 className="text-lg font-bold uppercase mt-4 mb-1 border-b border-gray-400">Skills</h2>
        <p className="text-sm">{data.skills}</p>
      </div>
    );
  }
  if (style === "style2") {
    return (
      <div
        ref={ref}
        className="p-8 bg-white shadow-xl max-w-4xl mx-auto my-8 border-t-8 border-indigo-500 text-gray-900 font-serif"
      >
        <div className="bg-indigo-100 p-4 mb-6">
          <h1 className="text-4xl font-extrabold text-indigo-800 text-center">{data.name || "YOUR NAME"}</h1>
          <h2 className="text-xl text-indigo-600 text-center">{data.jobTitle || "Your Current Role"}</h2>
          {ContactInfo("text-center text-md mt-1")}
        </div>
        <h2 className="text-xl font-bold text-indigo-700 mt-4 mb-2 border-b border-indigo-300">Summary</h2>
        <p className="text-sm italic mb-4">{data.summary || "Professional summary here."}</p>
        <h2 className="text-xl font-bold text-indigo-700 mt-4 mb-2 border-b border-indigo-300">💼 Experience</h2>
        {data.experience.map((exp, index) => (
          <div key={exp.id || index} className="mb-3">
            <div className="flex justify-between text-lg font-semibold text-indigo-800">
              <span>{exp.title}</span>
              <span className="text-sm text-gray-600">
                {exp.startDate} - {exp.endDate}
              </span>
            </div>
            <p className="text-sm italic mb-1">{exp.company}</p>
            <DetailList details={exp.details} />
          </div>
        ))}
        <h2 className="text-xl font-bold text-indigo-700 mt-4 mb-2 border-b border-indigo-300">🎓 Education</h2>
        {data.education.map((edu, index) => (
          <div key={edu.id || index} className="mb-3">
            <div className="flex justify-between font-semibold">
              <span>{edu.degree}</span>
              <span className="text-sm text-gray-600">{edu.gradYear}</span>
            </div>
            <p className="text-sm italic mb-1">{edu.school}</p>
            <DetailList details={edu.details} />
          </div>
        ))}
        <h2 className="text-xl font-bold text-indigo-700 mt-4 mb-2 border-b border-indigo-300">🧠 Skills</h2>
        <p className="text-sm">{data.skills}</p>
      </div>
    );
  }
  if (style === "style3") {
    return (
      <div
        ref={ref}
        className="p-8 bg-white shadow-xl max-w-4xl mx-auto my-8 border-l-8 border-purple-600 text-gray-900 font-sans"
      >
        <h1 className="text-3xl font-serif font-light mb-1">{data.name || "YOUR NAME"}</h1>
        <h2 className="text-xl text-purple-700 mb-4">{data.jobTitle || "Your Role"}</h2>
        {ContactInfo("text-md mb-4")}
        <h2 className="text-lg font-bold uppercase mt-4 mb-1 border-b-2 border-purple-300 text-purple-700">Summary</h2>
        <p className="text-sm italic">{data.summary || "Write a brief professional summary here."}</p>
        <h2 className="text-lg font-bold uppercase mt-4 mb-1 border-b-2 border-purple-300 text-purple-700">Experience</h2>
        {data.experience.map((exp, index) => (
          <div key={exp.id || index} className="mb-3">
            <div className="flex justify-between font-semibold text-base">
              <span>
                {exp.title} at {exp.company}
              </span>
              <span className="text-sm text-gray-600">
                {exp.startDate} - {exp.endDate}
              </span>
            </div>
            <DetailList details={exp.details} />
          </div>
        ))}
        <h2 className="text-lg font-bold uppercase mt-4 mb-1 border-b-2 border-purple-300 text-purple-700">Education</h2>
        {data.education.map((edu, index) => (
          <div key={edu.id || index} className="mb-3">
            <div className="flex justify-between font-semibold text-base">
              <span>
                {edu.degree} from {edu.school}
              </span>
              <span className="text-sm text-gray-600">{edu.gradYear}</span>
            </div>
            <DetailList details={edu.details} />
          </div>
        ))}
        <h2 className="text-lg font-bold uppercase mt-4 mb-1 border-b-2 border-purple-300 text-purple-700">Skills</h2>
        <p className="text-sm">{data.skills}</p>
      </div>
    );
  }
  return (
    <div ref={ref} className="p-8 bg-white shadow-xl max-w-4xl mx-auto my-8">
      <h3 className="text-xl text-red-600">Full Preview for '{style}' Not Implemented</h3>
      <p className="text-sm">Please implement the FullResumeTemplateView component for this style.</p>
    </div>
  );
});

export default function ResumeTemplates() {
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [viewMode, setViewMode] = useState("selection");
  const [formData, setFormData] = useState(initialFormData);
  const resumeRef = useRef(null);
  const selectedTemplate = ALL_TEMPLATES.find((t) => t.id === selectedTemplateId);
  const selectedStyle = selectedTemplate?.previewStyle || "style1";

  const handleFlatFieldChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStructuredArrayChange = (type, id, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [type]: prevData[type].map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const addExperienceItem = () => {
    setFormData((prevData) => ({
      ...prevData,
      experience: [
        ...prevData.experience,
        { id: Date.now(), title: "New Job", company: "Company Name", startDate: "Start", endDate: "End", details: "• New detail one\n• New detail two" },
      ],
    }));
  };

  const removeExperienceItem = (id) => {
    setFormData((prevData) => ({
      ...prevData,
      experience: prevData.experience.filter((item) => item.id !== id),
    }));
  };

  const addEducationItem = () => {
    setFormData((prevData) => ({
      ...prevData,
      education: [
        ...prevData.education,
        { id: Date.now(), degree: "Degree", school: "University", gradYear: "Year", details: "• Academic highlight" },
      ],
    }));
  };

  const removeEducationItem = (id) => {
    setFormData((prevData) => ({
      ...prevData,
      education: prevData.education.filter((item) => item.id !== id),
    }));
  };

  // Backend PDF download integration
  const handleBackendPdfDownload = async () => {
    if (!selectedTemplate) {
      alert("Please select a template first!");
      return;
    }
    try {
      const requestData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        summary: formData.summary,
        skills: formData.skills,
        education: formData.education
          .map((e) => `${e.degree} from ${e.school} (${e.gradYear})\n${e.details}`)
          .join("\n"),
        experience: formData.experience
          .map((e) => `${e.title} at ${e.company} (${e.startDate} - ${e.endDate})\n${e.details}`)
          .join("\n"),
        projects: "",
        certifications: "",
        role_type: "",
      };

      const response = await fetch(`${apiUrl}/api/resume/generate/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error("PDF generation failed");

      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition");
      let filename = "resume.pdf";
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "") || filename;
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Error downloading PDF. Please try again later.");
      console.error(err);
    }
  };

  const handleTemplateSelect = (id) => {
    setSelectedTemplateId(id);
    setViewMode("preview");
  };

  if (viewMode === "selection") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex flex-col items-center p-10">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">🎨 Step 1: Select Your Template</h1>
        <p className="text-gray-600 mb-8">Click on any template below to view the full-size design.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10 w-full max-w-5xl">
          {ALL_TEMPLATES.map((t) => (
            <div
              key={t.id}
              onClick={() => handleTemplateSelect(t.id)}
              className={`cursor-pointer border-4 rounded-xl p-3 text-center shadow-md hover:shadow-xl transition-all transform hover:scale-[1.02] ${
                selectedTemplateId === t.id ? `${t.color} bg-indigo-50 font-bold shadow-2xl` : "border-gray-200 bg-white"
              }`}
            >
              <h3 className="text-md font-semibold text-indigo-700 mb-2">{t.name}</h3>
              <SmallPreviewComponent data={formData} style={t.previewStyle} />
              <p className="text-gray-500 text-xs mt-2">Click to Preview</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const showPreview = viewMode === "preview" || viewMode === "edit";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">Template: {selectedTemplate?.name}</h1>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setViewMode("selection")}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          ← Change Template
        </button>
        <button
          onClick={() => setViewMode(viewMode === "edit" ? "preview" : "edit")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-bold transition"
        >
          {viewMode === "edit" ? "👁️ Hide Edit Form" : "📝 Click to Edit Details"}
        </button>
      </div>

      {viewMode === "edit" && (
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-4xl mb-8">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-6">📝 Edit Details and Download</h2>

          {/* Personal & Summary */}
          <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-1">Personal & Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input name="name" placeholder="Full Name" value={formData.name} onChange={handleFlatFieldChange} className="border rounded-lg p-3" />
            <input name="jobTitle" placeholder="Current/Target Job Title" value={formData.jobTitle} onChange={handleFlatFieldChange} className="border rounded-lg p-3" />
            <input name="location" placeholder="Location (City, State)" value={formData.location} onChange={handleFlatFieldChange} className="border rounded-lg p-3" />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleFlatFieldChange} className="border rounded-lg p-3" type="email" />
            <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleFlatFieldChange} className="border rounded-lg p-3" />
          </div>
          <textarea
            name="summary"
            placeholder="Professional Summary (1-3 sentences)"
            value={formData.summary}
            onChange={handleFlatFieldChange}
            className="border rounded-lg p-3 w-full min-h-[80px] mb-6"
          />

          {/* Experience */}
          <h3 className="text-xl font-semibold text-indigo-700 mb-3 border-b pb-1">Experience</h3>
          {formData.experience.map((item) => (
            <div key={item.id} className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4 border-l-4 border-blue-400">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                <input
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => handleStructuredArrayChange("experience", item.id, "title", e.target.value)}
                  className="border rounded-lg p-2 col-span-2"
                />
                <input
                  placeholder="Company"
                  value={item.company}
                  onChange={(e) => handleStructuredArrayChange("experience", item.id, "company", e.target.value)}
                  className="border rounded-lg p-2"
                />
                <input
                  placeholder="Start Date"
                  value={item.startDate}
                  onChange={(e) => handleStructuredArrayChange("experience", item.id, "startDate", e.target.value)}
                  className="border rounded-lg p-2"
                />
                <input
                  placeholder="End Date"
                  value={item.endDate}
                  onChange={(e) => handleStructuredArrayChange("experience", item.id, "endDate", e.target.value)}
                  className="border rounded-lg p-2"
                />
              </div>
              <textarea
                placeholder="Job Details (One bullet point per line)"
                value={item.details}
                onChange={(e) => handleStructuredArrayChange("experience", item.id, "details", e.target.value)}
                className="border rounded-lg p-2 w-full min-h-[80px]"
              />
              <div className="text-right mt-2">
                <button
                  onClick={() => removeExperienceItem(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove Entry
                </button>
              </div>
            </div>
          ))}
          <button onClick={addExperienceItem} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm mb-6">
            + Add Experience
          </button>

          {/* Education */}
          <h3 className="text-xl font-semibold text-indigo-700 mb-3 border-b pb-1">Education</h3>
          {formData.education.map((item) => (
            <div key={item.id} className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4 border-l-4 border-green-400">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <input
                  placeholder="Degree/Certificate"
                  value={item.degree}
                  onChange={(e) => handleStructuredArrayChange("education", item.id, "degree", e.target.value)}
                  className="border rounded-lg p-2 col-span-2"
                />
                <input
                  placeholder="School/Institution"
                  value={item.school}
                  onChange={(e) => handleStructuredArrayChange("education", item.id, "school", e.target.value)}
                  className="border rounded-lg p-2"
                />
                <input
                  placeholder="Graduation Year"
                  value={item.gradYear}
                  onChange={(e) => handleStructuredArrayChange("education", item.id, "gradYear", e.target.value)}
                  className="border rounded-lg p-2"
                />
              </div>
              <textarea
                placeholder="Academic Details (One bullet point per line)"
                value={item.details}
                onChange={(e) => handleStructuredArrayChange("education", item.id, "details", e.target.value)}
                className="border rounded-lg p-2 w-full min-h-[60px]"
              />
              <div className="text-right mt-2">
                <button
                  onClick={() => removeEducationItem(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove Entry
                </button>
              </div>
            </div>
          ))}
          <button onClick={addEducationItem} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm mb-6">
            + Add Education
          </button>

          {/* Skills */}
          <h3 className="text-xl font-semibold text-indigo-700 mb-3 border-b pb-1 mt-6">Skills</h3>
          <textarea
            name="skills"
            placeholder="Skills (Comma-separated list or categories)"
            value={formData.skills}
            onChange={handleFlatFieldChange}
            className="border rounded-lg p-3 w-full min-h-[80px]"
          />

          {/* Download button triggers backend PDF generation/download */}
          <div className="mt-8 text-center space-x-4">
            <button
              onClick={handleBackendPdfDownload}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-lg"
            >
              ⬇️ Download PDF (Server)
            </button>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="w-full max-w-4xl">
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">Live Resume Preview (Updates in Real-Time)</h2>
          <FullResumeTemplateView ref={resumeRef} data={formData} style={selectedStyle} />
        </div>
      )}
    </div>
  );
}
