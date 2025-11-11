export default function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: "Upload Your Resume",
      desc: "Simply upload your resume and our AI will analyze your skills, experience, and career goals.",
    },
    {
      num: 2,
      title: "AI Analysis & Matching",
      desc: "Our system fetches relevant jobs from major platforms and ranks them based on your profile.",
    },
    {
      num: 3,
      title: "Apply with One Click",
      desc: "Browse your personalized dashboard and apply to jobs directly on the original platforms.",
    },
  ];

  return (
    <section id="how" className="py-16 sm:py-20 bg-gray-50 text-center px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-900">
          How It Works
        </h2>
        <p className="text-gray-600 mb-12 text-base sm:text-lg max-w-2xl mx-auto">
          Get personalized job recommendations in three simple steps
        </p>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12">
          {steps.map((s) => (
            <div
              key={s.num}
              className="bg-white shadow-md hover:shadow-lg transition rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center"
            >
              <div className="text-indigo-600 text-4xl sm:text-5xl font-extrabold mb-4">
                {s.num}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">
                {s.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
