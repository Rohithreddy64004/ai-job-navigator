import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function ChatAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hello! I’m your AI Support Assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Suggested quick questions
  const suggestedQuestions = [
    "What is AI Job Navigator?",
    "How can I create my resume?",
    "How does the job recommender work?",
    "Can I talk to the AI Tutor?",
    "How to contact support?",
  ];

  const handleSend = async (userInput = input) => {
    if (!userInput.trim()) return;

    const userMessage = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await res.json();
      const botMessage = { sender: "bot", text: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Sorry, I couldn’t connect to the server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white shadow-lg rounded-2xl border border-gray-300 flex flex-col overflow-hidden z-50">
          <div className="bg-blue-600 text-white text-lg font-semibold p-3">
            AI Support Agent
          </div>

          <div className="flex-1 p-3 space-y-2 overflow-y-auto h-80">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg text-sm ${
                  msg.sender === "user"
                    ? "bg-blue-100 self-end text-right"
                    : "bg-gray-100 text-left"
                }`}
              >
                {msg.text}

                {/* 👇 Show suggested questions only after latest bot message */}
                {index === messages.length - 1 &&
                  msg.sender === "bot" &&
                  !loading && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {suggestedQuestions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(q)}
                          className="text-xs bg-blue-50 border border-blue-300 text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-100 transition"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {loading && (
              <div className="text-gray-400 text-sm">🤔 Thinking...</div>
            )}
          </div>

          <div className="flex items-center border-t border-gray-200 p-2">
            <input
              type="text"
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={() => handleSend()}
              className="ml-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
