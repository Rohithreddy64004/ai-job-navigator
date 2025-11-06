import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-4 shadow-sm bg-white">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <span className="text-indigo-600">◎</span> AI Job Navigator
      </h1>
      <ul className="flex gap-8 text-gray-600 font-medium items-center">
        <li><a href="#features">Features</a></li>
        <li><a href="#how">How It Works</a></li>
        <li>
          <Link
            to="/auth"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>
        </li>
      </ul>
    </nav>
  );
}
