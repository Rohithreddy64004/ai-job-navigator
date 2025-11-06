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
    <section id="features" className="py-20 bg-white text-center">
      <h2 className="text-3xl font-bold mb-10">Why Choose AI Job Navigator?</h2>
      <div className="flex flex-wrap justify-center gap-12">
        {features.map((f, i) => (
          <div key={i} className="max-w-sm">
            <div className="text-5xl mb-4 text-indigo-600">{f.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
