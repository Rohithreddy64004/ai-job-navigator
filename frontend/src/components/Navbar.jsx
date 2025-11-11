import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // npm install lucide-react

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="flex justify-between items-center px-6 md:px-10 py-4">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-indigo-600">◎</span> AI Job Navigator
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-gray-600 font-medium items-center">
          <li>
            <a href="#features" className="hover:text-indigo-600 transition">
              Features
            </a>
          </li>
          <li>
            <a href="#how" className="hover:text-indigo-600 transition">
              How It Works
            </a>
          </li>
          <li>
            <Link
              to="/auth"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Get Started
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md border-t border-gray-100">
          <ul className="flex flex-col items-center gap-4 py-4 text-gray-700 font-medium">
            <li>
              <a
                href="#features"
                className="hover:text-indigo-600 transition"
                onClick={() => setIsOpen(false)}
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#how"
                className="hover:text-indigo-600 transition"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </a>
            </li>
            <li>
              <Link
                to="/auth"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
