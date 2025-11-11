import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <section className="bg-indigo-50 text-center px-4 sm:px-6 md:px-10 py-16 sm:py-20 lg:py-28">
      <div className="max-w-5xl mx-auto">
        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
          Find Your Perfect Job with{" "}
          <span className="text-indigo-600 block sm:inline">AI Intelligence</span>
        </h1>

        {/* Subheading */}
        <p className="text-gray-600 mt-6 text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-2">
          Upload your resume and let our AI analyze your skills to find personalized job
          recommendations from LinkedIn, Indeed, and Naukri. No more endless scrolling.
        </p>

        {/* Call-to-Action Button */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleGetStarted}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition text-base sm:text-lg"
          >
            Get Started Free
          </button>
        </div>

        {/* Optional image or illustration */}
        {/* <img
          src="/images/ai-job-search.svg"
          alt="AI Job Search"
          className="w-full max-w-md mx-auto mt-12"
        /> */}
      </div>
    </section>
  );
}
