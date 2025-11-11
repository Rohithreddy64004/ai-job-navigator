export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6 sm:px-10 lg:px-20 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          ◎ <span className="text-indigo-500">AI Job Navigator</span>
        </h2>
        <p className="text-gray-400 text-sm sm:text-base">
          Intelligent job search powered by AI — helping you find the perfect match faster.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mt-6 text-gray-400 text-sm">
          <a href="#features" className="hover:text-indigo-400 transition-colors duration-200">
            Features
          </a>
          <a href="#how" className="hover:text-indigo-400 transition-colors duration-200">
            How It Works
          </a>
          <a href="#contact" className="hover:text-indigo-400 transition-colors duration-200">
            Contact
          </a>
          <a href="#about" className="hover:text-indigo-400 transition-colors duration-200">
            About
          </a>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4">
          <p className="text-gray-500 text-xs sm:text-sm">
            © 2025 <span className="text-indigo-400">AI Job Navigator</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
