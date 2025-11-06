export default function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: "Upload Your Resume",
      desc: "Simply upload your resume and our AI will analyze your skills, experience, and career goals."
    },
    {
      num: 2,
      title: "AI Analysis & Matching",
      desc: "Our system fetches relevant jobs from major platforms and ranks them based on your profile."
    },
    {
      num: 3,
      title: "Apply with One Click",
      desc: "Browse your personalized dashboard and apply to jobs directly on the original platforms."
    }
  ];

  return (
    <section id="how" className="py-20 bg-gray-50 text-center">
      <h2 className="text-3xl font-bold mb-8">How It Works</h2>
      <p className="text-gray-600 mb-12">Get personalized job recommendations in three simple steps</p>
      <div className="flex flex-wrap justify-center gap-12">
        {steps.map((s) => (
          <div key={s.num} className="max-w-xs">
            <div className="text-indigo-600 text-5xl font-bold mb-4">{s.num}</div>
            <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
            <p className="text-gray-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
