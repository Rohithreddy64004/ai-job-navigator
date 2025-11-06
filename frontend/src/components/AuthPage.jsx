import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const isAdmin =
        formData.email === "adminsai123@gmail.com" &&
        formData.password === "Sai@Admin";

      const endpoint = isLogin
        ? isAdmin
          ? "http://127.0.0.1:8000/api/admin/login"
          : "http://127.0.0.1:8000/auth/login"
        : "http://127.0.0.1:8000/auth/signup";

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
            <p className="text-right text-sm text-indigo-600 cursor-pointer hover:underline"
               onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"} text-white py-3 rounded-lg transition`}
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Signup"}
          </button>
        </form>

        {message && (
          <p
            className={`text-center mt-4 font-medium ${
              message.includes("success") ? "text-green-600" : "text-red-500"
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
