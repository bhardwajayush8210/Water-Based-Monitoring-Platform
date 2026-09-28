import React, { useState, useEffect, useRef } from "react";
import "./ChatBot.css";
import { askGemini } from "../geminiService";

const ChatBot = () => {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hello! I am your Smart Water Billing Assistant.\n\nAsk me anything about:\n\n• Bills\n• Water Usage\n• Tariff\n• Invoices\n• Billing Cycle\n• Community Admin\n• Support",
    },
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const userMessage = {
      sender: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    const prompt = message;

    setMessage("");

    setLoading(true);

    try {
      const reply = await askGemini(prompt);

      setMessages((prev) => [
        ...prev,

        {
          sender: "bot",
          text: reply,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,

        {
          sender: "bot",
          text: "Sorry, something went wrong.",
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "👋 Hello! I am your Smart Water Billing Assistant.\n\nHow can I help you today?",
      },
    ]);
  };

  return (
    <>
      {!open && (
        <button className="chatbot-button" onClick={() => setOpen(true)}>
          <span className="bot-icon">🤖</span>
        </button>
      )}

      {open && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h3>💧 Water Assistant</h3>

            <div>
              <button onClick={clearChat} className="clear-btn">
                🗑
              </button>

              <button onClick={() => setOpen(false)} className="close-btn">
                ✖
              </button>
            </div>
          </div>

          <div className="chatbot-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === "user"
                    ? "message user-message"
                    : "message bot-message"
                }
              >
                {msg.text}
              </div>
            ))}

            {loading && <div className="message bot-message">Typing...</div>}

            <div ref={chatEndRef}></div>
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about bills..."
            />

            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;