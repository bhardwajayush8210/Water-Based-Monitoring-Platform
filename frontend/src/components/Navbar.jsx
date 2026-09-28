import { Link } from "react-router-dom";

function Logo({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="10" fill="rgba(255,255,255,0.14)" />
      {/* header pipe */}
      <path
        d="M11 13 V19 H29 V13"
        stroke="#ffffff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* branch lines - one supply split into metered lines */}
      <line
        x1="16"
        y1="19"
        x2="16"
        y2="30"
        stroke="#ffffff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="19"
        x2="20"
        y2="25"
        stroke="#7CE0E8"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <line
        x1="24"
        y1="19"
        x2="24"
        y2="30"
        stroke="#ffffff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* meters */}
      <circle cx="16" cy="30" r="2.1" fill="#ffffff" />
      <circle cx="20" cy="25" r="2.1" fill="#7CE0E8" />
      <circle cx="24" cy="30" r="2.1" fill="#ffffff" />
    </svg>
  );
}

function Navbar() {
  return (
    <nav className="wb-navbar navbar navbar-expand-lg navbar-dark">
      <div className="container d-flex align-items-center justify-content-between">
        <Link
          className="wb-brand navbar-brand fw-bold d-flex align-items-center gap-2"
          to="/"
        >
          <Logo size={34} />
          <span className="wb-brand-text">
            Manifold
            <span className="wb-brand-sub">Water Billing</span>
          </span>
        </Link>

        <div className="d-flex align-items-center gap-2">
          <Link className="wb-link" to="/">
            Home
          </Link>

          <Link className="wb-btn wb-btn-outline" to="/admin/login">
            Admin
          </Link>

          <Link className="wb-btn wb-btn-light" to="/resident/login">
            Resident
          </Link>
        </div>
      </div>

      <style>{`
        .wb-navbar {
          background: linear-gradient(90deg, #0b5ed7 0%, #0d6efd 55%, #2f96ff 100%);
          padding: 12px 0;
          box-shadow: 0 2px 16px rgba(13, 110, 253, 0.18);
        }
        .wb-brand {
          text-decoration: none;
          line-height: 1.1;
        }
        .wb-brand-text {
          display: flex;
          flex-direction: column;
          color: #fff;
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -0.01em;
        }
        .wb-brand-sub {
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 1px;
        }
        .wb-link {
          color: rgba(255, 255, 255, 0.85);
          font-size: 14.5px;
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 8px;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .wb-link:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #fff;
        }
        .wb-btn {
          font-size: 14.5px;
          font-weight: 500;
          padding: 8px 18px;
          border-radius: 8px;
          text-decoration: none;
          transition: transform 0.15s ease, background 0.15s ease;
          border: 1.5px solid transparent;
        }
        .wb-btn:hover { transform: translateY(-1px); }
        .wb-btn-outline {
          border-color: rgba(255, 255, 255, 0.55);
          color: #fff;
        }
        .wb-btn-outline:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #fff;
        }
        .wb-btn-light {
          background: #fff;
          color: #0d6efd;
        }
        .wb-btn-light:hover {
          background: #eef5ff;
          color: #0d6efd;
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
