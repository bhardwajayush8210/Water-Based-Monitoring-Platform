import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import {
  Droplet,
  PersonFill,
  EnvelopeFill,
  TelephoneFill,
  At,
  KeyFill,
  HouseDoorFill,
  Building,
} from "react-bootstrap-icons";

function InviteRegister() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [apartment, setApartment] = useState(null);
  const [checkingToken, setCheckingToken] = useState(true);
  const [tokenError, setTokenError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    flatNumber: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      setCheckingToken(true);
      setTokenError("");
      try {
        const res = await api.get(`/invite/${token}`);
        setApartment(res.data);
      } catch (err) {
        console.error(err);
        setTokenError("This invite link is invalid or has expired.");
      } finally {
        setCheckingToken(false);
      }
    };
    checkToken();
  }, [token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      await api.post(`/invite/${token}/register`, form);
      alert("Registration successful! You can now sign in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setSubmitError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="wm-invite-page">
      <div className="wm-invite-card">
        <div className="wm-invite-icon">
          <Droplet size={22} />
        </div>

        {checkingToken ? (
          <div className="text-center py-4">
            <div
              className="spinner-border"
              style={{ color: "#14B8A6" }}
              role="status"
            />
          </div>
        ) : tokenError ? (
          <div className="text-center">
            <h5 className="wm-invite-title">Invalid Invite</h5>
            <p className="wm-invite-subtitle">{tokenError}</p>
            <Link to="/" className="wm-invite-link">
              Back to home
            </Link>
          </div>
        ) : (
          <>
            <h5 className="wm-invite-title">Join {apartment.apartmentName}</h5>
            <p className="wm-invite-subtitle">
              <Building size={13} className="me-1" />
              {apartment.city ? `${apartment.city} \u00b7 ` : ""}
              You're registering as a resident of this community
            </p>

            <form onSubmit={handleSubmit} className="mt-3">
              <div className="wm-field">
                <label>Full Name</label>
                <div className="wm-input-group">
                  <PersonFill size={14} />
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row g-2">
                <div className="col-md-6">
                  <div className="wm-field">
                    <label>Email</label>
                    <div className="wm-input-group">
                      <EnvelopeFill size={14} />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="wm-field">
                    <label>Phone</label>
                    <div className="wm-input-group">
                      <TelephoneFill size={14} />
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="wm-field">
                <label>Flat Number</label>
                <div className="wm-input-group">
                  <HouseDoorFill size={14} />
                  <input
                    name="flatNumber"
                    placeholder="e.g. A-101"
                    value={form.flatNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="wm-field">
                <label>Username</label>
                <div className="wm-input-group">
                  <At size={14} />
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="wm-field">
                <label>Password</label>
                <div className="wm-input-group">
                  <KeyFill size={14} />
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {submitError && <p className="wm-invite-error">{submitError}</p>}

              <button className="wm-invite-submit" disabled={submitting}>
                {submitting ? "Registering..." : "Register"}
              </button>
            </form>

            <p className="wm-invite-footer">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&display=swap');

        .wm-invite-page {
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
        .wm-invite-page::before {
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

        .wm-invite-card {
          position: relative;
          z-index: 2;
          background: #fff;
          border-radius: 20px;
          padding: 34px 32px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        }
        .wm-invite-icon {
          width: 48px;
          height: 48px;
          border-radius: 13px;
          background: #E3FBF6;
          color: #0D9488;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px;
        }
        .wm-invite-title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 19px;
          color: #0F172A;
          text-align: center;
          margin-bottom: 4px;
        }
        .wm-invite-subtitle {
          font-size: 12.5px;
          color: #64748B;
          text-align: center;
          margin-bottom: 4px;
        }
        .wm-invite-link {
          color: #0D9488;
          font-weight: 600;
          font-size: 13px;
        }

        .wm-field { margin-bottom: 12px; }
        .wm-field label {
          font-size: 11.5px;
          color: #64748B;
          display: block;
          margin-bottom: 5px;
        }
        .wm-input-group {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid #E7EBF1;
          border-radius: 9px;
          padding: 0 11px;
          height: 40px;
          color: #a3adba;
        }
        .wm-input-group:focus-within { border-color: #14B8A6; }
        .wm-input-group input {
          border: none;
          outline: none;
          flex: 1;
          font-size: 13.5px;
          height: 100%;
          color: #0F172A;
          background: transparent;
        }

        .wm-invite-error {
          color: #EF4444;
          font-size: 12.5px;
          margin: -4px 0 12px;
        }

        .wm-invite-submit {
          width: 100%;
          background: #14B8A6;
          color: #06231f;
          border: none;
          height: 44px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          margin-top: 4px;
        }
        .wm-invite-submit:hover { background: #0EA99A; }
        .wm-invite-submit:disabled { opacity: 0.7; cursor: default; }

        .wm-invite-footer {
          font-size: 12.5px;
          color: #64748B;
          text-align: center;
          margin: 16px 0 0;
        }
        .wm-invite-footer a {
          color: #0D9488;
          font-weight: 600;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}

export default InviteRegister;
