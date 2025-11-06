import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all users when admin logs in
  useEffect(() => {
    fetch("http://localhost:8000/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  }, []);

  // ✅ Delete a user
  async function handleDeleteUser(userId) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:8000/admin/delete_user/${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== userId));
        alert("✅ User deleted successfully!");
      } else {
        alert("❌ Failed to delete user.");
      }
    } catch (err) {
      console.error(err);
      alert("🚫 Error deleting user.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
        Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Total Users</h2>
          <p className="text-2xl font-bold text-indigo-600">{users.length}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Resume Scores Checked</h2>
          <p className="text-2xl font-bold text-indigo-600">42</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">AI Tutor Sessions</h2>
          <p className="text-2xl font-bold text-indigo-600">19</p>
        </div>
      </div>

      {/* User Management */}
      <h2 className="text-2xl font-bold mb-4 text-gray-700">User Management</h2>

      {loading ? (
        <p className="text-center">⏳ Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-4">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-indigo-100 text-left">
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Signup Date</th>
                <th className="p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{u.name}</td>
                  <td className="p-3 border-b">{u.email}</td>
                  <td className="p-3 border-b">{u.signup_date || "—"}</td>
                  <td className="p-3 border-b">
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
