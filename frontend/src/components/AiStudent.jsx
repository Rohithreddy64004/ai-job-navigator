import React, { useState, useRef, useEffect } from "react";
import {
  FiSend,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiMessageSquare,
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function AiStudent() {
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

  useEffect(() => {
    localStorage.setItem("student_chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setFilteredChats(
      chats.filter((chat) =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, chats]);

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

  const handleSelectChat = (id) => {
    const chat = chats.find((c) => c.id === id);
    setCurrentChat(id);
    setMessages(chat.history);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/ask", {
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

  return (
    <div className="flex h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-violet-100 text-gray-800 font-inter">
      {/* === Sidebar === */}
      <div className="w-1/4 hidden md:flex flex-col border-r border-indigo-100 bg-white/70 backdrop-blur-xl shadow-lg">
        <div className="p-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xl font-semibold rounded-br-3xl">
          🎓 AI Student
        </div>

        <div className="p-4 border-b border-indigo-100">
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 mb-3">
            <FiSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search chats..."
              className="bg-transparent outline-none flex-1 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleNewChat}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-full font-medium flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition"
          >
            <FiPlus /> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          {(filteredChats.length > 0 ? filteredChats : chats).map((chat) => (
            <motion.div
              key={chat.id}
              whileHover={{ scale: 1.03 }}
              onClick={() => handleSelectChat(chat.id)}
              className={`group flex justify-between items-center p-3 rounded-xl cursor-pointer mb-2 ${
                currentChat === chat.id
                  ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800"
                  : "bg-white hover:bg-indigo-50"
              } transition shadow-sm`}
            >
              <div className="flex items-center gap-2 truncate">
                <FiMessageSquare className="text-indigo-600" />
                <span className="truncate text-sm font-medium">
                  {chat.name}
                </span>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <FiEdit2
                  size={14}
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRenameChat(chat.id);
                  }}
                />
                <FiTrash2
                  size={14}
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
      </div>

      {/* === Chat Section === */}
      <div className="flex-1 flex flex-col">
        <div className="p-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold text-lg flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            🤖 AI Learning Assistant
          </div>
          <span className="text-sm text-blue-100">Smart Study Companion</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-gradient-to-b from-white to-blue-50 relative">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <motion.img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png"
                alt="AI Bot"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-24 mb-5 opacity-70"
              />
              <p className="text-base text-center">
                Start your learning journey with your AI Tutor 💡
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex mb-3 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-5 py-3 rounded-2xl shadow-md text-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-br-none"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))
          )}
          {loading && (
            <p className="text-gray-500 italic text-sm animate-pulse">
              🤖 Bot is typing...
            </p>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-5 bg-white/70 backdrop-blur-md border-t border-gray-200 flex items-center gap-3 shadow-inner">
          <input
            type="text"
            placeholder="Ask me anything about your studies..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 rounded-full px-6 py-3 border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm text-sm"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={loading}
            className="p-3 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md hover:opacity-90"
          >
            <FiSend size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
