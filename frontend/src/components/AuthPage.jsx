import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup } from "../firebaseConfig"; // 👈 Add Firebase import
import { FcGoogle } from "react-icons/fc";

const apiUrl = import.meta.env.VITE_API_URL;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Email/Password Login or Signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const isAdmin = formData.email.endsWith("@admin.com");
      const endpoint = isAdmin
        ? `${apiUrl}/api/admin/login`
        : isLogin
        ? `${apiUrl}/auth/login`
        : `${apiUrl}/auth/signup`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMessage(data.detail || "❌ Something went wrong.");
        return;
      }

      if (!isLogin) {
        alert("✅ Signup successful! Please login now.");
        setIsLogin(true);
        return;
      }

      if (isAdmin) {
        alert("✅ Admin login successful!");
        localStorage.setItem("admin", JSON.stringify({ email: formData.email }));
        navigate("/admin/dashboard");
      } else {
        alert("✅ User login successful!");
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: data.user?.name || formData.name,
            email: data.user?.email || formData.email,
          })
        );
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      setMessage("🚫 Server not reachable. Please try again later.");
      setLoading(false);
    }
  };

  // ✅ Handle Google Sign-In (Firebase)
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      // Send token to backend for verification
      const res = await fetch(`${apiUrl}/api/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Google login failed.");

      localStorage.setItem(
        "user",
        JSON.stringify({ name: user.displayName, email: user.email })
      );

      alert(`✅ Welcome ${user.displayName}!`);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google Sign-In error:", err);
      alert("❌ Google Sign-In failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          {isLogin ? "Login" : "Signup"} to AI Job Navigator
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          {isLogin && (
            <p
              className="text-right text-sm text-indigo-600 cursor-pointer hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white py-3 rounded-lg transition font-semibold`}
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Signup"}
          </button>
        </form>

        {/* ✅ Google Sign-In Button */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 mb-2">or</p>
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition"
          >
            <FcGoogle className="text-2xl" />
            <span className="font-medium text-gray-700">Sign in with Google</span>
          </button>
        </div>

        {message && (
          <p
            className={`text-center mt-4 font-medium ${
              message.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-center text-gray-600 mt-6">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Signup here
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Login here
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
