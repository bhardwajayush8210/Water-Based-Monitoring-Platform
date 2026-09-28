import React, { useState, useRef, useEffect } from "react";
import api from "../api/api";
import {
  Robot,
  XCircleFill,
  SendFill,
  Stars,
  CompassFill,
  MicFill,
} from "react-bootstrap-icons";
import { useLocation } from "react-router-dom";

export default function AquaTrackAI({ currentPage = "GENERAL" }) {
  const [isOpen, setIsOpen] = useState(false);

  const getInitialSuggestions = () => {
    const role = localStorage.getItem("role");

    if (role === "COMMUNITY_ADMIN") {
      return [
        "Show today's community water usage",
        "Show resident consumption summary",
        "Show current billing cycle",
      ];
    }

    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      return [
        "Show pending admin approvals",
        "Show all communities",
        "Show system tickets",
      ];
    }

    // Default Resident
    return [
      "Show my current bill",
      "Why is my bill higher?",
      "Where do I download invoices?",
    ];
  };

const location = useLocation();
const lastUsernameRef = useRef(localStorage.getItem("username"));

  const [messages, setMessages] = useState([
    {
      sender: "BOT",
      text: "Hello! I am **AquaTrack AI Assistant**. Ask me anything about your water usage, bills, invoices, tariffs, or platform navigation!",
      suggestions: getInitialSuggestions(),
    },
  ]);

  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const currentUsername = localStorage.getItem("username");
    if (currentUsername !== lastUsernameRef.current) {
      lastUsernameRef.current = currentUsername;
      setMessages([
        {
          sender: "BOT",
          text: "Hello! I am **AquaTrack AI Assistant**. Ask me anything about your water usage, bills, invoices, tariffs, or platform navigation!",
          suggestions: getInitialSuggestions(),
        },
      ]);
      setIsOpen(false);
    }
  }, [location.pathname]);

  const startVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice input is not supported in this browser");
      return;
    }

    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;

      setInput(voiceText);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    recognition.start();
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newHistory = [...messages, { sender: "USER", text: query }];
    setMessages(newHistory);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await api.post("/ai/chat", {
        message: query,
        currentPage: currentPage,
        history: historyPayload,
      });

      setMessages([
        ...newHistory,
        {
          sender: "BOT",
          text: res.data.response,
          suggestions: res.data.suggestions,
          navigation: res.data.navigation,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newHistory,
        {
          sender: "BOT",
          text: "⚠️ Sorry, I encountered an issue connecting to the server. Please check if the backend is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wm-ai-container">
      {!isOpen && (
        <button className="wm-ai-trigger" onClick={() => setIsOpen(true)}>
          <Stars size={18} className="me-2 text-warning" />
          <span>AquaTrack AI</span>
        </button>
      )}

      {isOpen && (
        <div className="wm-ai-window">
          {/* Header */}
          <div className="wm-ai-header">
            <div className="d-flex align-items-center gap-2">
              <div className="wm-ai-avatar">
                <Robot size={18} color="#fff" />
              </div>
              <div>
                <h6 className="mb-0 fw-bold" style={{ fontSize: "14.5px" }}>
                  AquaTrack AI
                </h6>
                <small style={{ fontSize: "11px", opacity: 0.8 }}>
                  Real-time Platform Assistant
                </small>
              </div>
            </div>
            <button className="wm-ai-close" onClick={() => setIsOpen(false)}>
              <XCircleFill size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="wm-ai-body">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`wm-ai-msg-wrapper ${
                  m.sender === "USER" ? "wm-ai-user" : "wm-ai-bot"
                }`}
              >
                <div className="wm-ai-msg-bubble">
                  <div style={{ whiteSpace: "pre-line" }}>{m.text}</div>

                  {/* Navigation Step Card */}
                  {m.navigation && (
                    <div className="wm-ai-nav-card mt-2">
                      <div className="d-flex align-items-center gap-1 text-primary fw-semibold mb-1">
                        <CompassFill size={13} />
                        <span>Navigation Step</span>
                      </div>
                      <strong>{m.navigation.pageName}</strong>
                      <p
                        className="mb-0 text-muted"
                        style={{ fontSize: "11.5px" }}
                      >
                        {m.navigation.steps}
                      </p>
                    </div>
                  )}
                </div>

                {/* Suggested Questions */}
                {m.sender === "BOT" &&
                  m.suggestions &&
                  m.suggestions.length > 0 &&
                  localStorage.getItem("role") !== "COMMUNITY_ADMIN" && (
                    <div className="wm-ai-suggestions">
                      {m.suggestions.map((sugg, i) => (
                        <button
                          key={i}
                          className="wm-ai-sugg-btn"
                          onClick={() => handleSend(sugg)}
                        >
                          {sugg}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {loading && (
              <div className="wm-ai-msg-wrapper wm-ai-bot">
                <div className="wm-ai-msg-bubble wm-ai-loading">
                  <span
                    className="spinner-grow spinner-grow-sm me-1"
                    role="status"
                  />
                  Analyzing platform state...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Footer Input */}
          <div className="wm-ai-footer">
            <input
              type="text"
              className="form-control"
              placeholder="Ask about bills, usage, tariffs..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />

            <button
              className={`wm-ai-mic-btn ${isListening ? "active" : ""}`}
              onClick={startVoiceInput}
            >
              <MicFill size={15} />
            </button>

            <button
              className="wm-ai-send-btn"
              disabled={loading || !input.trim()}
              onClick={() => handleSend()}
            >
              <SendFill size={14} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        .wm-ai-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          font-family: 'Inter', sans-serif;
        }
        .wm-ai-trigger {
          background: #0B1C2C;
          color: #fff;
          border: 1px solid #0EA5E9;
          padding: 12px 20px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 14px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.2s ease;
        }
        .wm-ai-trigger:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(14,165,233,0.3);
        }
        .wm-ai-window {
          width: 370px;
          height: 520px;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.25);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #E7EBF1;
        }
        .wm-ai-header {
          background: #0B1C2C;
          color: #fff;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .wm-ai-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #0EA5E9;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wm-ai-close {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
        }
        .wm-ai-close:hover { color: #fff; }
        .wm-ai-body {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: #F8FAFC;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .wm-ai-msg-wrapper {
          display: flex;
          flex-direction: column;
          max-width: 85%;
        }
        .wm-ai-user { align-self: flex-end; }
        .wm-ai-bot { align-self: flex-start; }
        .wm-ai-msg-bubble {
          padding: 10px 14px;
          border-radius: 14px;
          font-size: 13px;
          line-height: 1.45;
        }
        .wm-ai-user .wm-ai-msg-bubble {
          background: #0EA5E9;
          color: #fff;
          border-bottom-right-radius: 2px;
        }
        .wm-ai-bot .wm-ai-msg-bubble {
          background: #fff;
          color: #0F172A;
          border: 1px solid #E2E8F0;
          border-bottom-left-radius: 2px;
        }
        .wm-ai-nav-card {
          background: #F0F9FF;
          border: 1px solid #BAE6FD;
          border-radius: 8px;
          padding: 8px 10px;
        }
        .wm-ai-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
        }
        .wm-ai-sugg-btn {
          background: #fff;
          border: 1px solid #CBD5E1;
          color: #0284C7;
          border-radius: 999px;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .wm-ai-sugg-btn:hover {
          background: #E0F2FE;
          border-color: #0EA5E9;
        }
        .wm-ai-footer {
          padding: 10px 12px;
          background: #fff;
          border-top: 1px solid #E2E8F0;
          display: flex;
          gap: 8px;
        }
          .wm-ai-mic-btn {

background:#F1F5F9;
border:1px solid #CBD5E1;
color:#0284C7;

width:38px;
border-radius:10px;

display:flex;
align-items:center;
justify-content:center;

cursor:pointer;

}


.wm-ai-mic-btn:hover {

background:#E0F2FE;

}


.wm-ai-mic-btn.active {

background:#EF4444;
color:white;

}
        .wm-ai-send-btn {
          background: #0EA5E9;
          color: #fff;
          border: none;
          padding: 0 14px;
          border-radius: 10px;
          cursor: pointer;
        }
        .wm-ai-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
