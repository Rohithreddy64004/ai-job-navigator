import React, { useState, useRef, useEffect } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
import {
  FiSend,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiMessageSquare,
  FiArrowLeft,
  FiUser,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Returns a consistent color for message avatars per user
function colorForUser(id) {
  const colors = ["bg-indigo-400", "bg-pink-400", "bg-blue-400", "bg-yellow-400"];
  return colors[id % colors.length];
}

export default function AiStudent() {
  const navigate = useNavigate();
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("student_chats");
    return saved ? JSON.parse(saved) : [];
  });
  const [filteredChats, setFilteredChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Load from localStorage
  useEffect(() => {
    localStorage.setItem("student_chats", JSON.stringify(chats));
  }, [chats]);

  // Scroll to last message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Search filter
  useEffect(() => {
    setFilteredChats(
      chats.filter((chat) =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, chats]);

  // New chat
  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      name: `Chat ${chats.length + 1}`,
      history: [],
    };
    setChats([newChat, ...chats]);
    setCurrentChat(newChat.id);
    setMessages([]);
  };

  // Select existing chat
  const handleSelectChat = (id) => {
    const chat = chats.find((c) => c.id === id);
    setCurrentChat(id);
    setMessages(chat ? chat.history : []);
  };

  // Send message
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();
      const botMsg = { sender: "bot", text: data.response };
      const newMessages = [...updatedMessages, botMsg];
      setMessages(newMessages);

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChat ? { ...chat, history: newMessages } : chat
        )
      );
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Connection error. Try again later." },
      ]);
    }
    setLoading(false);
  };

  const handleRenameChat = (id) => {
    const newName = prompt("Rename chat:");
    if (!newName) return;
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, name: newName } : chat
      )
    );
  };

  const handleDeleteChat = (id) => {
    const updated = chats.filter((c) => c.id !== id);
    setChats(updated);
    if (id === currentChat) {
      setCurrentChat(null);
      setMessages([]);
    }
  };

  // Avatar for sender
  function MsgAvatar({ sender }) {
    if (sender === "bot") {
      return (
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png"
          alt="Bot"
          className="w-8 h-8 rounded-full border-2 border-blue-300 bg-white"
        />
      );
    }
    // Fallback user avatar
    return (
      <div
        className={`w-8 h-8 flex items-center justify-center rounded-full ${colorForUser(currentChat || 1)}`}
      >
        <FiUser className="text-white" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-violet-100 text-gray-900 font-inter overflow-hidden">
      {/* === Sidebar === */}
      <aside className="w-80 max-w-xs hidden md:flex flex-col border-r border-indigo-100 bg-white/60 backdrop-blur-lg shadow-2xl relative z-10">
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xl font-bold rounded-br-3xl flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="mr-2 p-2 rounded-full bg-white/20 hover:bg-indigo-700 transition"
            aria-label="Back to dashboard"
            title="Back"
          >
            <FiArrowLeft size={21} className="text-white" />
          </button>
          <span>AI Student</span>
        </div>
        <div className="p-5 border-b border-indigo-100">
          <div className="flex items-center bg-gray-100/80 rounded-full px-3 py-2 mb-3">
            <FiSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search chats..."
              className="bg-transparent outline-none flex-1 text-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleNewChat}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-full font-medium flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition"
          >
            <FiPlus /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {(filteredChats.length > 0 ? filteredChats : chats).map((chat) => (
            <motion.div
              key={chat.id}
              whileHover={{ scale: 1.03 }}
              onClick={() => handleSelectChat(chat.id)}
              className={`group flex justify-between items-center p-3 rounded-2xl cursor-pointer ${
                currentChat === chat.id
                  ? "bg-gradient-to-r from-indigo-100 to-blue-100 text-blue-800 shadow"
                  : "bg-white/80 hover:bg-indigo-50"
              } transition`}
              tabIndex={0}
            >
              <div className="flex items-center gap-2 truncate">
                <FiMessageSquare className="text-indigo-600" />
                <span className="truncate text-base font-medium">{chat.name}</span>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <FiEdit2
                  size={15}
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRenameChat(chat.id);
                  }}
                />
                <FiTrash2
                  size={15}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat.id);
                  }}
                />
              </div>
            </motion.div>
          ))}
          {chats.length === 0 && (
            <p className="text-center text-gray-400 mt-10 text-sm">
              No chats yet.
            </p>
          )}
        </div>
      </aside>

      {/* === Chat Section === */}
      <main className="flex-1 flex flex-col relative bg-white/60 backdrop-blur-2xl shadow-2xl rounded-l-3xl">
        {/* Top bar */}
        <div className="p-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold text-lg flex justify-between items-center shadow-md rounded-bl-3xl">
          <div className="flex items-center gap-3">
            {/* Back button for mobile */}
            <button
              onClick={() => navigate("/")}
              className="md:hidden mr-4 px-2 py-1 rounded-full bg-white/20 hover:bg-indigo-500 transition"
              aria-label="Back to dashboard"
            >
              <FiArrowLeft size={22} className="text-white" />
            </button>
            🤖 AI Learning Assistant
          </div>
          <span className="text-sm text-blue-100">Smart Study Companion</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-6 md:px-16 bg-gradient-to-b from-white/70 to-blue-100 relative select-none">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <motion.img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png"
                alt="AI Bot"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-28 mb-8 opacity-80"
              />
              <p className="text-lg text-center">Start your learning journey with your AI Tutor 💡</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className={`flex items-end gap-2 mb-5 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && <MsgAvatar sender="bot" />}
                <div
                  className={`max-w-xl px-7 py-4 rounded-2xl shadow font-normal text-base transition-all ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-indigo-400 via-blue-500 to-indigo-600 text-white rounded-br-lg"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-lg"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && <MsgAvatar sender="user" />}
              </motion.div>
            ))
          )}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2 text-gray-500 italic text-base animate-pulse"
            >
              <MsgAvatar sender="bot" />
              <span>Bot is typing...</span>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <form
          className="p-4 md:p-6 bg-white/80 backdrop-blur-md border-t border-gray-200 flex items-center gap-3 shadow-inner"
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            placeholder="Ask me anything about your studies..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            className="flex-1 rounded-full px-6 py-4 border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none shadow text-base bg-gray-50"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="submit"
            disabled={loading}
            className="p-4 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg hover:opacity-90 focus:ring"
            title="Send"
            aria-label="Send message"
          >
            <FiSend size={28} />
          </motion.button>
        </form>
      </main>
    </div>
  );
}
