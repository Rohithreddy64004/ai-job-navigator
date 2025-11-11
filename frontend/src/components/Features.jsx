export default function Features() {
  const features = [
    {
      title: "Smart Resume Analysis",
      desc: "Our AI analyzes your resume to understand your skills, experience, and career goals automatically.",
      icon: "⬆️"
    },
    {
      title: "Real-Time Job Fetching",
      desc: "Get the latest opportunities from LinkedIn, Indeed, and Naukri updated in real-time.",
      icon: "🔍"
    },
    {
      title: "Intelligent Ranking",
      desc: "Jobs are ranked by relevance to your profile, showing the best matches first.",
      icon: "⚡"
    },
  ];

  return (
    <section id="features" className="py-20 bg-white text-center px-6 sm:px-10 lg:px-20">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800">
        Why Choose <span className="text-indigo-600">AI Job Navigator?</span>
      </h2>
      <p className="text-gray-600 mb-12 max-w-2xl mx-auto text-sm sm:text-base">
        Discover how our AI-powered platform simplifies your job search and boosts your career opportunities.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16 justify-items-center">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-gray-50 hover:bg-indigo-50 transition-all duration-300 rounded-2xl shadow-md hover:shadow-lg p-8 text-center max-w-xs w-full"
          >
            <div className="text-5xl mb-4 text-indigo-600">{f.icon}</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">{f.title}</h3>
            <p className="text-gray-600 text-sm sm:text-base">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
