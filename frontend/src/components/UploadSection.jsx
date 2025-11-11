import { useNavigate } from "react-router-dom";

export default function UploadSection() {
  const navigate = useNavigate();

  const handleStartFindingJobs = (e) => {
    e.preventDefault();
    navigate("/auth");
  };

  return (
    <section
      id="getstarted"
      className="py-16 sm:py-20 bg-white text-center px-4 sm:px-8"
    >
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          Ready to Find Your Dream Job?
        </h2>
        <p className="text-gray-600 mb-10 text-base sm:text-lg max-w-2xl mx-auto">
          Upload your resume and get started with AI-powered job recommendations
        </p>

        {/* Upload Form */}
        <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl shadow-lg">
          <form className="space-y-6" onSubmit={handleStartFindingJobs}>
            {/* Input Fields */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full sm:w-1/2 p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:w-1/2 p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            {/* Upload Box */}
            <div className="border-2 border-dashed border-gray-300 p-6 sm:p-10 rounded-lg text-gray-500 cursor-pointer hover:bg-gray-100 transition">
              <p className="text-base sm:text-lg">📄 Click to upload or drag and drop</p>
              <p className="text-sm mt-2 text-gray-500">PDF, DOC, DOCX (max 10MB)</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full sm:w-auto bg-indigo-700 text-white px-6 sm:px-10 py-3 rounded-lg shadow hover:bg-indigo-800 transition font-medium"
            >
              Start Finding Jobs →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
