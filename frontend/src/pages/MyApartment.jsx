import { useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";
import StatCard from "../components/layout/StatCard";
import {
  Building,
  GeoAltFill,
  HouseDoorFill,
  PencilFill,
  Link45deg,
  ClipboardCheckFill,
  PeopleFill,
  EnvelopeFill,
} from "react-bootstrap-icons";

function MyApartment() {
  const [apartment, setApartment] = useState(null);
  const [residentCount, setResidentCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    totalFlats: "",
  });
  const [saving, setSaving] = useState(false);

  const [inviteLink, setInviteLink] = useState("");
  const [loadingInvite, setLoadingInvite] = useState(true);
  const [copied, setCopied] = useState(false);
  const [residentEmail, setResidentEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  const loadInviteLink = async () => {
    setLoadingInvite(true);
    try {
      const res = await api.get("/community/invite-token");
      setInviteLink(`${window.location.origin}/invite/${res.data.token}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInvite(false);
    }
  };

  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendInviteEmail = async () => {
    if (!residentEmail.trim()) {
      alert("Please enter resident email.");
      return;
    }

    try {
      setSendingEmail(true);
      await api.post("/community/invite/email", {
        email: residentEmail,
      });
      alert("Invitation email sent successfully.");
      setResidentEmail("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send invitation.");
    } finally {
      setSendingEmail(false);
    }
  };

  const loadApartment = async () => {
    setLoading(true);
    setError("");
    try {
      const [aptRes, statsRes] = await Promise.all([
        api.get("/community/apartment"),
        api.get("/community/stats").catch(() => null),
      ]);
      setApartment(aptRes.data);
      setForm({
        address: aptRes.data.address || "",
        city: aptRes.data.city || "",
        state: aptRes.data.state || "",
        pincode: aptRes.data.pincode || "",
        totalFlats: aptRes.data.totalFlats || "",
      });
      if (statsRes) setResidentCount(statsRes.data.residentCount);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to load apartment details.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApartment();
    loadInviteLink();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put("/community/apartment", {
        ...form,
        totalFlats: form.totalFlats ? parseInt(form.totalFlats, 10) : null,
      });
      setApartment(res.data);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const occupancyPercent =
    apartment?.totalFlats && residentCount !== null
      ? Math.min((residentCount / apartment.totalFlats) * 100, 100)
      : null;

  return (
    <>
      <Sidebar />
      <TopNavbar title="Apartments" subtitle="Your community's details" />

      <div className="wm-page">
        {loading ? (
          <div className="text-center py-5">
            <div
              className="spinner-border"
              style={{ color: "var(--wm-accent)" }}
              role="status"
            />
          </div>
        ) : error ? (
          <div className="wm-card text-center py-5">
            <p style={{ color: "var(--wm-danger)", fontSize: 14 }}>{error}</p>
            <button className="wm-btn-outline" onClick={loadApartment}>
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Hero banner */}
            <div className="wm-hero-card">
              <div className="wm-hero-blob" />
              <div className="wm-hero-content">
                <div className="wm-hero-icon">
                  <Building size={26} />
                </div>
                <div className="wm-hero-text">
                  <h4>{apartment.apartmentName}</h4>
                  <p>
                    <GeoAltFill size={12} className="me-1" />
                    {apartment.city || "—"}
                    {apartment.state ? `, ${apartment.state}` : ""}
                    {apartment.pincode ? ` · ${apartment.pincode}` : ""}
                  </p>
                </div>
                {!editing && (
                  <button
                    className="wm-hero-edit-btn"
                    onClick={() => setEditing(true)}
                  >
                    <PencilFill size={12} className="me-2" />
                    Edit Details
                  </button>
                )}
              </div>
            </div>

            {/* Stat cards */}
            <div className="row g-3 mt-1 mb-3">
              <div className="col-md-4">
                <StatCard
                  icon={HouseDoorFill}
                  label="Total Households"
                  value={
                    apartment.totalFlats ? String(apartment.totalFlats) : "—"
                  }
                  tone="accent"
                />
              </div>
              <div className="col-md-4">
                <StatCard
                  icon={PeopleFill}
                  label="Registered Residents"
                  value={residentCount !== null ? String(residentCount) : "—"}
                  percent={occupancyPercent}
                  tone="success"
                />
              </div>
              <div className="col-md-4">
                <StatCard
                  icon={EnvelopeFill}
                  label="Invite Link"
                  value={loadingInvite ? "…" : "Active"}
                  tone="warn"
                />
              </div>
            </div>

            <div className="row g-3">
              {/* Community Details Side */}
              <div className="col-lg-7">
                <div className="wm-card h-100">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h6 className="wm-card-title mb-0">Community Details</h6>
                    {!editing && (
                      <button
                        className="wm-btn-outline"
                        onClick={() => setEditing(true)}
                      >
                        <PencilFill size={12} className="me-2" />
                        Edit
                      </button>
                    )}
                  </div>

                  {editing ? (
                    <form onSubmit={handleSave}>
                      <div className="row g-3">
                        <div className="col-md-12">
                          <label className="wm-label">Address</label>
                          <div className="wm-input-group">
                            <GeoAltFill size={14} className="wm-input-icon" />
                            <input
                              className="wm-input"
                              name="address"
                              value={form.address}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <label className="wm-label">City</label>
                          <input
                            className="wm-input-plain"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="wm-label">State</label>
                          <input
                            className="wm-input-plain"
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="wm-label">Pincode</label>
                          <input
                            className="wm-input-plain"
                            name="pincode"
                            value={form.pincode}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="wm-label">Total Households</label>
                          <div className="wm-input-group">
                            <HouseDoorFill
                              size={14}
                              className="wm-input-icon"
                            />
                            <input
                              type="number"
                              className="wm-input"
                              name="totalFlats"
                              value={form.totalFlats}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="d-flex gap-2 mt-4">
                        <button className="wm-btn-primary" disabled={saving}>
                          {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          className="wm-btn-outline"
                          onClick={() => {
                            setEditing(false);
                            loadApartment();
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="wm-details-list">
                      <div className="wm-detail-row">
                        <span className="wm-detail-label">Address</span>
                        <span className="wm-detail-value">
                          {apartment.address || "—"}
                        </span>
                      </div>
                      <div className="wm-detail-row">
                        <span className="wm-detail-label">City</span>
                        <span className="wm-detail-value">
                          {apartment.city || "—"}
                        </span>
                      </div>
                      <div className="wm-detail-row">
                        <span className="wm-detail-label">State</span>
                        <span className="wm-detail-value">
                          {apartment.state || "—"}
                        </span>
                      </div>
                      <div className="wm-detail-row">
                        <span className="wm-detail-label">Pincode</span>
                        <span className="wm-detail-value">
                          {apartment.pincode || "—"}
                        </span>
                      </div>
                      <div className="wm-detail-row" style={{ border: "none" }}>
                        <span className="wm-detail-label">
                          Total Households
                        </span>
                        <span className="wm-detail-value">
                          {apartment.totalFlats ?? "—"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Invite Residents Side */}
              <div className="col-lg-5">
                <div className="wm-invite-card h-100">
                  <div className="wm-invite-icon">
                    <Link45deg size={22} />
                  </div>
                  <h6 className="wm-card-title mb-1">Invite Residents</h6>
                  <p className="wm-muted-text mb-3">
                    Share this link — anyone who registers through it joins your
                    community automatically, with no apartment selection needed.
                  </p>

                  {loadingInvite ? (
                    <div className="text-center py-3">
                      <div
                        className="spinner-border spinner-border-sm"
                        style={{ color: "var(--wm-accent)" }}
                        role="status"
                      />
                    </div>
                  ) : (
                    <>
                      {/* Section 1: Copy Link Feature */}
                      <div className="mb-4">
                        <div className="wm-invite-link-box mb-2">
                          {inviteLink}
                        </div>
                        <button
                          className="wm-btn-primary w-100"
                          onClick={handleCopyInvite}
                        >
                          {copied ? (
                            <>
                              <ClipboardCheckFill size={13} className="me-2" />
                              Copied to clipboard
                            </>
                          ) : (
                            "Copy Invite Link"
                          )}
                        </button>
                      </div>

                      <hr
                        className="my-3"
                        style={{
                          borderColor: "var(--wm-accent)",
                          opacity: 0.25,
                        }}
                      />

                      {/* Section 2: Email Send Feature */}
                      <div>
                        <label className="wm-label mb-2">
                          Invite Resident via Email
                        </label>
                        <input
                          type="email"
                          className="wm-input-plain mb-2"
                          placeholder="resident@gmail.com"
                          value={residentEmail}
                          onChange={(e) => setResidentEmail(e.target.value)}
                          style={{ backgroundColor: "#fff" }}
                        />
                        <button
                          className="wm-btn-outline w-100"
                          onClick={handleSendInviteEmail}
                          disabled={sendingEmail}
                        >
                          {sendingEmail
                            ? "Sending..."
                            : "Send Invitation Email"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        .wm-page {
          margin-left: 252px;
          padding: 96px 28px 32px;
          background: var(--wm-bg, #F6F8FB);
          min-height: 100vh;
          font-family: var(--wm-font-body, 'Inter', sans-serif);
        }

        .wm-hero-card {
          position: relative;
          background: linear-gradient(135deg, var(--wm-navy, #0B1C2C) 0%, #14283b 100%);
          border-radius: 20px;
          padding: 28px 30px;
          overflow: hidden;
        }
        .wm-hero-blob {
          position: absolute;
          top: -60px;
          right: -60px;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: var(--wm-accent, #14B8A6);
          opacity: 0.18;
          filter: blur(10px);
        }
        .wm-hero-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .wm-hero-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: rgba(255,255,255,0.1);
          color: var(--wm-accent, #14B8A6);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wm-hero-text { flex: 1; }
        .wm-hero-text h4 {
          font-family: var(--wm-font-display, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: 22px;
          color: #fff;
          margin: 0 0 4px;
        }
        .wm-hero-text p {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          margin: 0;
          display: flex;
          align-items: center;
        }
        .wm-hero-edit-btn {
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s ease;
        }
        .wm-hero-edit-btn:hover { background: rgba(255,255,255,0.2); }

        .wm-card {
          background: #fff;
          border: 1px solid var(--wm-border, #E7EBF1);
          border-radius: 16px;
          padding: 22px;
        }
        .wm-card-title {
          font-family: var(--wm-font-display, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: 15px;
          color: var(--wm-ink, #0F172A);
        }
        .wm-muted-text { color: var(--wm-muted, #64748B); font-size: 12.5px; }

        .wm-details-list { display: flex; flex-direction: column; }
        .wm-detail-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid var(--wm-border, #E7EBF1);
        }
        .wm-detail-label { font-size: 12.5px; color: var(--wm-muted, #64748B); }
        .wm-detail-value { font-size: 13.5px; font-weight: 600; color: var(--wm-ink, #0F172A); }

        .wm-label {
          font-size: 12px;
          color: var(--wm-muted, #64748B);
          display: block;
          margin-bottom: 6px;
        }
        .wm-input-group {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--wm-border, #E7EBF1);
          border-radius: 8px;
          padding: 0 10px;
          height: 42px;
        }
        .wm-input-icon { color: #a3adba; flex-shrink: 0; }
        .wm-input {
          border: none;
          outline: none;
          flex: 1;
          font-size: 13.5px;
          height: 100%;
          background: transparent;
        }
        .wm-input-plain {
          border: 1px solid var(--wm-border, #E7EBF1);
          border-radius: 8px;
          padding: 0 12px;
          height: 42px;
          width: 100%;
          font-size: 13.5px;
        }
        .wm-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--wm-accent);
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13.5px;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .wm-btn-primary:hover { background: var(--wm-accent-dark); }
        .wm-btn-outline {
          border: 1px solid var(--wm-accent);
          color: var(--wm-accent-dark);
          background: #fff;
          padding: 9px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .wm-btn-outline:hover {
          background: var(--wm-accent-soft);
        }

        .wm-invite-card {
          background: var(--wm-accent-soft);
          border: 1px solid var(--wm-accent);
          border-radius: 16px;
          padding: 22px;
        }
        .wm-invite-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #fff;
          color: var(--wm-accent-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }
        .wm-invite-link-box {
          background: #fff;
          border: 1px dashed var(--wm-accent);
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 12px;
          color: var(--wm-accent-dark);
          word-break: break-all;
          font-family: var(--wm-font-mono, 'JetBrains Mono', monospace);
        }

        @media (max-width: 991px) {
          .wm-page { margin-left: 0; padding: 90px 16px 24px; }
          .wm-hero-content { flex-wrap: wrap; }
        }
      `}</style>
    </>
  );
}

export default MyApartment;
