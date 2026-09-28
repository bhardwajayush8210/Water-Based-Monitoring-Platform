import { useNavigate } from "react-router-dom";
import {
  Speedometer2,
  DropletFill,
  ClockHistory,
  ReceiptCutoff,
  FileEarmarkTextFill,
  BellFill,
  LightbulbFill,
  PersonCircle,
  BoxArrowRight,
  Droplet,
  LifePreserver, // Imported LifePreserver icon for support tickets
} from "react-bootstrap-icons";

const menus = [
  { key: "dashboard", title: "Dashboard", icon: Speedometer2 },
  { key: "usage", title: "My Usage", icon: DropletFill },
  { key: "history", title: "Usage History", icon: ClockHistory },
  { key: "bills", title: "My Bills", icon: ReceiptCutoff },
  { key: "invoices", title: "My Invoices", icon: FileEarmarkTextFill },
  { key: "notifications", title: "Notifications", icon: BellFill },
  { key: "tickets", title: "Support & Concerns", icon: LifePreserver }, // Added Support & Concerns item
  { key: "tips", title: "Water Tips", icon: LightbulbFill },
  { key: "profile", title: "Profile", icon: PersonCircle },
];

function ResidentSidebar({ active, setActive }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <aside className="wm-sidebar">
        <div className="wm-brand">
          <div className="wm-brand-mark">
            <Droplet size={18} />
          </div>
          <span className="wm-brand-text">Water Billing</span>
        </div>

        <nav className="wm-nav">
          {menus.map((menu) => {
            const Icon = menu.icon;
            const isActive = active === menu.key;
            return (
              <button
                key={menu.key}
                onClick={() => setActive(menu.key)}
                className={`wm-nav-item ${isActive ? "wm-nav-item-active" : ""}`}
              >
                <Icon size={17} />
                <span>{menu.title}</span>
              </button>
            );
          })}
        </nav>

        <div className="wm-sidebar-footer">
          <span className="wm-role-badge">Resident</span>
          <button className="wm-logout-btn" onClick={logout}>
            <BoxArrowRight size={16} />
            Logout
          </button>
        </div>
      </aside>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');

        :root {
          --wm-bg: #F6F8FB;
          --wm-navy: #0B1C2C;
          --wm-navy-soft: #14283b;
          --wm-ink: #0F172A;
          --wm-muted: #64748B;
          --wm-border: #E7EBF1;
          --wm-accent: #0EA5E9;
          --wm-accent-soft: #E6F4FE;
          --wm-accent-dark: #0284C7;
          --wm-warn: #F59E0B;
          --wm-warn-soft: #FEF3E2;
          --wm-danger: #EF4444;
          --wm-danger-soft: #FDECEC;
          --wm-success: #22C55E;
          --wm-success-soft: #E9F9EF;
          --wm-font-display: 'Space Grotesk', sans-serif;
          --wm-font-body: 'Inter', sans-serif;
          --wm-font-mono: 'JetBrains Mono', monospace;
        }

        .wm-sidebar {
          width: 252px;
          min-height: 100vh;
          background: var(--wm-navy);
          position: fixed;
          top: 0;
          left: 0;
          display: flex;
          flex-direction: column;
          padding: 22px 16px;
          z-index: 40;
          font-family: var(--wm-font-body);
        }

        .wm-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 8px 20px 8px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 18px;
        }

        .wm-brand-mark {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: var(--wm-accent);
          color: #04263a;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .wm-brand-text {
          font-family: var(--wm-font-display);
          font-weight: 600;
          font-size: 16.5px;
          color: #fff;
          letter-spacing: -0.2px;
        }

        .wm-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .wm-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          color: rgba(255,255,255,0.62);
          background: transparent;
          border: none;
          text-align: left;
          font-size: 13.8px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .wm-nav-item:hover {
          background: rgba(255,255,255,0.06);
          color: #fff;
        }

        .wm-nav-item-active {
          background: var(--wm-accent-soft);
          color: var(--wm-accent-dark);
          font-weight: 600;
        }
        .wm-nav-item-active:hover {
          background: var(--wm-accent-soft);
          color: var(--wm-accent-dark);
        }

        .wm-sidebar-footer {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .wm-role-badge {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3px;
          color: var(--wm-accent);
          background: rgba(14,165,233,0.14);
          padding: 5px 10px;
          border-radius: 999px;
          width: fit-content;
        }

        .wm-logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.75);
          padding: 9px 12px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .wm-logout-btn:hover {
          background: var(--wm-danger-soft);
          border-color: var(--wm-danger);
          color: var(--wm-danger);
        }

        @media (max-width: 991px) {
          .wm-sidebar { display: none; }
        }
      `}</style>
    </>
  );
}

export default ResidentSidebar;
