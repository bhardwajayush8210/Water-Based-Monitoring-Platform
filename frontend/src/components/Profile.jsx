import { useEffect, useState } from "react";
import api from "../api/api";
import {
  PersonCircle,
  PencilFill,
  CheckCircleFill,
  KeyFill,
  Building,
  DropletFill,
  EnvelopeFill,
  TelephoneFill,
} from "react-bootstrap-icons";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/me");
      setProfile(res.data);
      setFullName(res.data.fullName || "");
      setPhone(res.data.phone || "");
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg("");
    try {
      const res = await api.put("/auth/me", { fullName, phone });
      setProfile(res.data);
      setEditing(false);
      setProfileMsg("Profile updated successfully.");
      setTimeout(() => setProfileMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setProfileMsg("Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMsg("");

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      await api.put("/auth/change-password", { currentPassword, newPassword });
      setPasswordMsg("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordMsg("");
      }, 2000);
    } catch (err) {
      setPasswordError(
        err.response?.data ||
          "Failed to change password. Check your current password.",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="wm-card text-center py-5">
        <div
          className="spinner-border"
          style={{ color: "var(--wm-accent)" }}
          role="status"
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="wm-card text-center py-5">
        <p className="wm-empty-note mb-0">Couldn't load your profile.</p>
      </div>
    );
  }

  return (
    <>
      <div className="wm-card">
        <div className="wm-profile-header">
          <div className="wm-profile-avatar">
            <PersonCircle size={40} />
          </div>
          <div className="flex-grow-1">
            <h5 className="wm-profile-name">
              {profile.fullName || profile.username}
            </h5>
            <span className="wm-badge wm-badge-accent">{profile.role}</span>
          </div>
          {!editing && (
            <button className="wm-btn-outline" onClick={() => setEditing(true)}>
              <PencilFill size={12} className="me-1" />
              Edit Profile
            </button>
          )}
        </div>

        {profileMsg && (
          <div className="wm-profile-msg">
            <CheckCircleFill size={13} className="me-1" />
            {profileMsg}
          </div>
        )}

        {!editing ? (
          <div className="wm-profile-grid mt-3">
            <div className="wm-profile-field">
              <span className="wm-profile-label">Username</span>
              <span className="wm-profile-value">{profile.username}</span>
            </div>
            <div className="wm-profile-field">
              <span className="wm-profile-label">
                <EnvelopeFill size={11} className="me-1" />
                Email
              </span>
              <span className="wm-profile-value">{profile.email}</span>
            </div>
            <div className="wm-profile-field">
              <span className="wm-profile-label">
                <TelephoneFill size={11} className="me-1" />
                Phone
              </span>
              <span className="wm-profile-value">
                {profile.phone || "Not set"}
              </span>
            </div>
            <div className="wm-profile-field">
              <span className="wm-profile-label">
                <Building size={11} className="me-1" />
                Apartment
              </span>
              <span className="wm-profile-value">
                {profile.apartment || "N/A"}
              </span>
            </div>
            <div className="wm-profile-field">
              <span className="wm-profile-label">Flat Number</span>
              <span className="wm-profile-value">
                {profile.flatNumber || "N/A"}
              </span>
            </div>
            <div className="wm-profile-field">
              <span className="wm-profile-label">
                <DropletFill size={11} className="me-1" />
                Meter Number
              </span>
              <span className="wm-profile-value">
                {profile.meterNumber || "Not assigned"}
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="mt-3">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button
                type="button"
                className="wm-btn-outline"
                onClick={() => {
                  setEditing(false);
                  setFullName(profile.fullName || "");
                  setPhone(profile.phone || "");
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="wm-btn-primary-sm"
                disabled={savingProfile}
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="wm-card mt-3">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <KeyFill size={15} color="var(--wm-accent-dark)" />
            <h6 className="wm-card-title mb-0">Password</h6>
          </div>
          {!showPasswordForm && (
            <button
              className="wm-btn-outline"
              onClick={() => setShowPasswordForm(true)}
            >
              Change Password
            </button>
          )}
        </div>

        {showPasswordForm && (
          <form onSubmit={handleChangePassword} className="mt-3">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Current Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            {passwordError && (
              <p className="wm-profile-error mt-2">{passwordError}</p>
            )}
            {passwordMsg && (
              <p className="wm-profile-msg mt-2">
                <CheckCircleFill size={13} className="me-1" />
                {passwordMsg}
              </p>
            )}

            <div className="d-flex gap-2 mt-3">
              <button
                type="button"
                className="wm-btn-outline"
                onClick={() => {
                  setShowPasswordForm(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setPasswordError("");
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="wm-btn-primary-sm"
                disabled={savingPassword}
              >
                {savingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .wm-profile-header {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .wm-profile-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--wm-accent-soft);
          color: var(--wm-accent-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wm-profile-name {
          font-family: var(--wm-font-display, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: 18px;
          color: var(--wm-ink, #0F172A);
          margin-bottom: 6px;
        }
        .wm-profile-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .wm-profile-field {
          background: #F8FAFC;
          border: 1px solid var(--wm-border, #E7EBF1);
          border-radius: 10px;
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .wm-profile-label {
          font-size: 11px;
          color: var(--wm-muted, #64748B);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .wm-profile-value {
          font-size: 14px;
          font-weight: 600;
          color: var(--wm-ink, #0F172A);
        }
        .wm-profile-msg {
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          color: #166534;
          font-size: 12.5px;
          padding: 8px 12px;
          border-radius: 8px;
          margin-top: 12px;
        }
        .wm-profile-error {
          background: #FEF2F2;
          border: 1px solid #FCA5A5;
          color: #991B1B;
          font-size: 12.5px;
          padding: 8px 12px;
          border-radius: 8px;
        }
        @media (max-width: 900px) {
          .wm-profile-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .wm-profile-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
