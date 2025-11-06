// src/components/ResumeTemplates.jsx
import React, { useState } from "react";
import jsPDF from "jspdf";


export default function ResumeTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    experience: "",
    skills: "",
  });

  const handleDownload = () => {
    if (!selectedTemplate) {
      alert("Please select a template first!");
      return;
    }

    const pdf = new jsPDF();
    const { name, email, phone, education, experience, skills } = formData;
    let content = "";

    if (selectedTemplate === "minimal") {
      content = `
${name}
${email} | ${phone}

-------------------------
Education:
${education}

Skills:
${skills}

Experience:
${experience}
      `;
    } else if (selectedTemplate === "modern") {
      content = `
==== ${name} ====
📧 ${email} | 📱 ${phone}

🎓 Education
${education}

🧠 Skills
${skills}

💼 Experience
${experience}
      `;
    } else {
      content = `
${name.toUpperCase()}
${email} | ${phone}
───────────────────────────────
🎓 Education
${education}

💼 Experience
${experience}

🧠 Skills
${skills}
───────────────────────────────
Elegant Resume Template
      `;
    }

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(content, 10, 10, { maxWidth: 180 });
    pdf.save(`${name || "resume"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">
        🎨 AI Resume Templates
      </h1>
      <p className="text-gray-600 mb-8">
        Select a template style and fill in your details to generate a PDF.
      </p>

      {/* Template Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {[
          { id: "minimal", name: "Minimal", color: "border-gray-400" },
          { id: "modern", name: "Modern", color: "border-indigo-500" },
          { id: "elegant", name: "Elegant", color: "border-purple-600" },
        ].map((t) => (
          <div
            key={t.id}
            onClick={() => setSelectedTemplate(t.id)}
            className={`cursor-pointer border-4 rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all ${
              selectedTemplate === t.id
                ? `${t.color} bg-indigo-50`
                : "border-gray-200 bg-white"
            }`}
          >
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">
              {t.name}
            </h3>
            <p className="text-gray-500 text-sm">
              {t.name} layout with ATS-friendly formatting.
            </p>
          </div>
        ))}
      </div>

      {/* Form Section */}
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["name", "email", "phone", "education", "experience", "skills"].map(
            (field) => (
              <input
                key={field}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                className="border rounded-lg p-3 w-full"
              />
            )
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleDownload}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
          >
            ⬇️ Download Resume PDF
          </button>
        </div>
      </div>

      <button
        onClick={() => window.history.back()}
        className="mt-10 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
      >
        ← Back
      </button>
    </div>
  );
}
