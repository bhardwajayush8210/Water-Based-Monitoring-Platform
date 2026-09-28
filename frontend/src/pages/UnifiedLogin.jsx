import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { Droplet, PersonFill, KeyFill } from "react-bootstrap-icons";

const roleRedirects = {
  RESIDENT: "/resident/dashboard",
  COMMUNITY_ADMIN: "/community/dashboard",
  ADMIN: "/admin/dashboard",
};

function UnifiedLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("approved", String(response.data.approved));

      navigate(roleRedirects[response.data.role] || "/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wm-login-page">
      <div className="wm-login-card">
        <div className="wm-login-icon">
          <Droplet size={22} />
        </div>
        <h2 className="wm-login-title">Sign In</h2>
        <p className="wm-login-subtitle">Enter your credentials to continue</p>

        <form onSubmit={handleLogin} className="mt-3">
          <div className="wm-field">
            <label className="wm-label">Username</label>
            <div className="wm-input-group">
              <PersonFill size={14} className="wm-input-icon" />
              <input
                type="text"
                name="username"
                className="wm-input"
                value={form.username}
                onChange={handleChange}
                autoFocus
                required
              />
            </div>
          </div>

          <div className="wm-field">
            <label className="wm-label">Password</label>
            <div className="wm-input-group">
              <KeyFill size={14} className="wm-input-icon" />
              <input
                type="password"
                name="password"
                className="wm-input"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && <p className="wm-error">{error}</p>}

          <button className="wm-login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="wm-login-footer">
          New here? <Link to="/#roles">Choose your role to register</Link>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&display=swap');

        .wm-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0B1C2C;
          padding: 24px;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .wm-login-page::before {
          content: '';
          position: absolute;
          width: 420px;
          height: 420px;
          background: #14B8A6;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.25;
          top: -140px;
          left: -100px;
        }
        .wm-login-page::after {
          content: '';
          position: absolute;
          width: 380px;
          height: 380px;
          background: #6366F1;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.22;
          bottom: -140px;
          right: -100px;
        }

        .wm-login-card {
          position: relative;
          z-index: 2;
          background: #fff;
          border-radius: 20px;
          padding: 38px 34px;
          width: 100%;
          max-width: 380px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        }

        .wm-login-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #E3FBF6;
          color: #0D9488;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .wm-login-title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 22px;
          color: #0F172A;
          margin-bottom: 4px;
        }

        .wm-login-subtitle {
          font-size: 13.5px;
          color: #64748B;
          margin-bottom: 8px;
        }

        .wm-field { text-align: left; margin-bottom: 16px; }
        .wm-label {
          font-size: 12px;
          color: #64748B;
          display: block;
          margin-bottom: 6px;
        }
        .wm-input-group {
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid #E7EBF1;
          border-radius: 10px;
          padding: 0 12px;
          height: 46px;
          transition: border-color 0.15s ease;
        }
        .wm-input-group:focus-within { border-color: #14B8A6; }
        .wm-input-icon { color: #a3adba; flex-shrink: 0; }
        .wm-input {
          border: none;
          outline: none;
          flex: 1;
          font-size: 14px;
          height: 100%;
          background: transparent;
        }

        .wm-error {
          color: #EF4444;
          font-size: 13px;
          text-align: left;
          margin: -6px 0 14px;
        }

        .wm-login-btn {
          width: 100%;
          background: #14B8A6;
          color: #06231f;
          border: none;
          height: 46px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14.5px;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .wm-login-btn:hover { background: #0EA99A; }
        .wm-login-btn:disabled { opacity: 0.7; cursor: default; }

        .wm-login-footer {
          font-size: 13px;
          color: #64748B;
          margin: 20px 0 0;
        }
        .wm-login-footer a {
          color: #0D9488;
          font-weight: 600;
          text-decoration: none;
        }
        .wm-login-footer a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}

export default UnifiedLogin;
