import { useNavigate } from "react-router-dom";

export default function UploadSection() {
  const navigate = useNavigate();

  const handleStartFindingJobs = (e) => {
    e.preventDefault(); // prevent form submission refresh
    navigate("/auth"); // redirect to signup page
  };

  return (
    <section id="getstarted" className="py-20 bg-white text-center">
      <h2 className="text-3xl font-bold mb-6">Ready to Find Your Dream Job?</h2>
      <p className="text-gray-600 mb-10">
        Upload your resume and get started with AI-powered job recommendations
      </p>

      <div className="max-w-3xl mx-auto bg-gray-50 p-8 rounded-2xl shadow">
        <form className="space-y-6" onSubmit={handleStartFindingJobs}>
          <div className="flex gap-6">
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-1/2 p-3 border rounded-lg"
              required
            />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-1/2 p-3 border rounded-lg"
              required
            />
          </div>

          <div className="border-2 border-dashed border-gray-300 p-10 rounded-lg text-gray-500 cursor-pointer hover:bg-gray-100 transition">
            <p>📄 Click to upload or drag and drop</p>
            <p className="text-sm mt-2">PDF, DOC, DOCX (max 10MB)</p>
          </div>

          <button
            type="submit"
            className="bg-indigo-700 text-white px-8 py-3 rounded-lg shadow hover:bg-indigo-800 transition"
          >
            Start Finding Jobs →
          </button>
        </form>
      </div>
    </section>
  );
}
