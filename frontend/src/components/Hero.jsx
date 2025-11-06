import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth"); // Redirects user to /auth page
  };

  return (
    <section className="bg-indigo-50 text-center py-20">
      <h1 className="text-5xl font-extrabold text-gray-900">
        Find Your Perfect Job with{" "}
        <span className="text-indigo-600">AI Intelligence</span>
      </h1>
      <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto">
        Upload your resume and let our AI analyze your skills to find personalized job
        recommendations from LinkedIn, Indeed, and Naukri. No more endless scrolling.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={handleGetStarted}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Get Started Free
        </button>
      </div>
    </section>
  );
}
