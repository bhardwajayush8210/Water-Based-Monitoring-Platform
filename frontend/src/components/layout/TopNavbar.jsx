import { BellFill } from "react-bootstrap-icons";
import LanguageSwitcher from "./LanguageSwitcher";

function TopNavbar({
  title = "Dashboard",
  subtitle = "Water Billing Administration",
}) {
  const username = localStorage.getItem("username") || "User";
  const role = localStorage.getItem("role");

  const roleLabel =
    role === "ADMIN"
      ? "Super Admin"
      : role === "COMMUNITY_ADMIN"
        ? "Community Admin"
        : role || "";

  const initials =
    username
      .split(/[.\s_]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "U";

  return (
    <>
      <div className="wm-topbar">
        <div>
          <h4 className="wm-topbar-title">{title}</h4>
          <p className="wm-topbar-subtitle">{subtitle}</p>
        </div>

        <div className="wm-topbar-right">
          <LanguageSwitcher />

          <button
            className="wm-bell-btn"
            type="button"
            aria-label="Notifications"
          >
            <BellFill size={16} />
          </button>

          <div className="wm-user-chip">
            <div className="wm-avatar">{initials}</div>
            <div className="wm-user-meta">
              <strong>{username}</strong>
              <span>{roleLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .wm-topbar {
          position: fixed;
          top: 0;
          right: 0;
          left: 252px;
          height: 72px;
          background: #fff;
          border-bottom: 1px solid var(--wm-border, #E7EBF1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          z-index: 30;
          font-family: var(--wm-font-body, 'Inter', sans-serif);
        }

        .wm-topbar-title {
          font-family: var(--wm-font-display, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: 19px;
          color: var(--wm-ink, #0F172A);
          margin: 0;
          letter-spacing: -0.2px;
        }

        .wm-topbar-subtitle {
          font-size: 12.5px;
          color: var(--wm-muted, #64748B);
          margin: 2px 0 0 0;
        }

        .wm-topbar-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .wm-bell-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1px solid var(--wm-border, #E7EBF1);
          background: #fff;
          color: var(--wm-muted, #64748B);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .wm-bell-btn:hover {
          background: var(--wm-bg, #F6F8FB);
        }

        .wm-user-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 5px 12px 5px 5px;
          border-radius: 999px;
          border: 1px solid var(--wm-border, #E7EBF1);
        }

        .wm-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--wm-accent-soft, #E3FBF6);
          color: var(--wm-accent-dark, #0D9488);
          font-family: var(--wm-font-mono, 'JetBrains Mono', monospace);
          font-size: 12.5px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .wm-user-meta {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        .wm-user-meta strong {
          font-size: 13px;
          color: var(--wm-ink, #0F172A);
        }
        .wm-user-meta span {
          font-size: 11px;
          color: var(--wm-muted, #64748B);
        }

        @media (max-width: 991px) {
          .wm-topbar { left: 0; padding: 0 18px; }
          .wm-user-meta { display: none; }
        }
      `}</style>
    </>
  );
}

export default TopNavbar;
