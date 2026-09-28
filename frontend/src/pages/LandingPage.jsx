import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  Droplet,
  DropletFill,
  ShieldLockFill,
  PeopleFill,
  GraphUpArrow,
  BellFill,
  Building,
  ArrowRight,
  CheckCircleFill,
  PersonFill,
  KeyFill,
  QuestionCircleFill,
  ChevronDown,
} from "react-bootstrap-icons";
// Corrected import path for LanguageSwitcher
import LanguageSwitcher from "../components/layout/LanguageSwitcher";

const roleRedirects = {
  RESIDENT: "/resident/dashboard",
  COMMUNITY_ADMIN: "/community/dashboard",
  ADMIN: "/admin/dashboard",
};

const features = [
  {
    icon: DropletFill,
    title: "Real-Time Usage Tracking",
    desc: "Meter readings are logged and instantly turned into consumption trends over time.",
  },
  {
    icon: ShieldLockFill,
    title: "Secure, Role-Based Access",
    desc: "JWT-backed authentication keeps every account scoped to exactly what it should see.",
  },
  {
    icon: Building,
    title: "Community Management",
    desc: "Each community manages its own residents and usage data — no cross-community visibility.",
  },
  {
    icon: GraphUpArrow,
    title: "Visual Insights",
    desc: "Weekly and monthly consumption charts make it easy to spot spikes before they become a problem.",
  },
  {
    icon: PeopleFill,
    title: "Multi-Tier Oversight",
    desc: "Platform-wide visibility across every registered community and its residents.",
  },
  {
    icon: BellFill,
    title: "Usage Alerts",
    desc: "Threshold-based notifications keep everyone informed when consumption trends upward.",
  },
];

const faqs = [
  {
    q: "How is my water bill calculated under the tiered structure?",
    a: "Your water bill is divided into Tier 1 and Tier 2. Tier 1 applies a standard base rate up to a designated monthly consumption threshold (e.g., 1,500 L). Any water consumed beyond that threshold is billed at Tier 2 rates to promote conservation.",
  },
  {
    q: "How are my daily meter readings entered into the system?",
    a: "Readings are recorded and entered directly by your Community Admin. You can track your daily consumption trends under the 'Usage History' tab in your dashboard.",
  },
  {
    q: "How do support tickets and concerns get resolved?",
    a: "When you raise a concern, local hardware or billing issues automatically route to your Community Admin's dashboard. App bugs or technical platform issues route directly to the Super Admin.",
  },
  {
    q: "Can I download my past water invoices?",
    a: "Yes, you can view the complete itemized breakdown or download formal tax invoice PDFs directly from the 'My Invoices' section.",
  },
];

const authPoints = [
  {
    icon: DropletFill,
    text: "Daily meter readings, logged by your Community Admin",
  },
  {
    icon: GraphUpArrow,
    text: "Tiered billing broken down litre by litre, not just a total",
  },
  {
    icon: ShieldLockFill,
    text: "Access scoped to your role — residents, admins, and Super Admins each see only what's theirs",
  },
];

// Helper hook for scroll-reveal animations
function useScrollReveal() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

// Custom SVG Hero Illustration Component
function HeroApartmentSVG() {
  return (
    <svg
      className="wm-hero-svg-bg"
      viewBox="0 0 520 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Droplet Linear Gradient */}
        <linearGradient id="dropletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#14B8A6" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.4" />
        </linearGradient>

        {/* Apartment Gradient */}
        <linearGradient id="buildingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95" />
        </linearGradient>

        {/* Glow Filter */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Grid Lines Background */}
      <path
        d="M 40,0 V 480 M 120,0 V 480 M 200,0 V 480 M 280,0 V 480 M 360,0 V 480 M 440,0 V 480"
        stroke="rgba(255,255,255,0.03)"
        strokeWidth="1"
      />

      {/* Main Apartment Building Body */}
      <rect
        x="90"
        y="100"
        width="220"
        height="350"
        rx="16"
        fill="url(#buildingGrad)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1.5"
      />

      {/* Secondary Building Wing */}
      <rect
        x="280"
        y="180"
        width="150"
        height="270"
        rx="12"
        fill="#111827"
        fillOpacity="0.8"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />

      {/* Staggered Glowing Windows - Main Building */}
      <g className="wm-svg-windows">
        {/* Row 1 */}
        <rect
          className="wm-win wm-win-1"
          x="115"
          y="130"
          width="35"
          height="40"
          rx="6"
        />
        <rect
          className="wm-win wm-win-2"
          x="182"
          y="130"
          width="35"
          height="40"
          rx="6"
        />
        <rect
          className="wm-win wm-win-3"
          x="250"
          y="130"
          width="35"
          height="40"
          rx="6"
        />

        {/* Row 2 */}
        <rect
          className="wm-win wm-win-3"
          x="115"
          y="190"
          width="35"
          height="40"
          rx="6"
        />
        <rect
          className="wm-win wm-win-1"
          x="182"
          y="190"
          width="35"
          height="40"
          rx="6"
        />
        <rect
          className="wm-win wm-win-2"
          x="250"
          y="190"
          width="35"
          height="40"
          rx="6"
        />

        {/* Row 3 */}
        <rect
          className="wm-win wm-win-2"
          x="115"
          y="250"
          width="35"
          height="40"
          rx="6"
        />
        <rect
          className="wm-win wm-win-3"
          x="182"
          y="250"
          width="35"
          height="40"
          rx="6"
        />
        <rect
          className="wm-win wm-win-1"
          x="250"
          y="250"
          width="35"
          height="40"
          rx="6"
        />

        {/* Row 4 */}
        <rect
          className="wm-win wm-win-1"
          x="115"
          y="310"
          width="35"
          height="40"
          rx="6"
        />
        <rect
          className="wm-win wm-win-2"
          x="182"
          y="310"
          width="35"
          height="40"
          rx="6"
        />
        <rect
          className="wm-win wm-win-3"
          x="250"
          y="310"
          width="35"
          height="40"
          rx="6"
        />

        {/* Wing Windows */}
        <rect
          className="wm-win wm-win-2"
          x="310"
          y="210"
          width="30"
          height="32"
          rx="4"
        />
        <rect
          className="wm-win wm-win-1"
          x="370"
          y="210"
          width="30"
          height="32"
          rx="4"
        />
        <rect
          className="wm-win wm-win-3"
          x="310"
          y="260"
          width="30"
          height="32"
          rx="4"
        />
        <rect
          className="wm-win wm-win-2"
          x="370"
          y="260"
          width="30"
          height="32"
          rx="4"
        />
        <rect
          className="wm-win wm-win-1"
          x="310"
          y="310"
          width="30"
          height="32"
          rx="4"
        />
        <rect
          className="wm-win wm-win-3"
          x="370"
          y="310"
          width="30"
          height="32"
          rx="4"
        />
      </g>

      {/* Main Entrance Door */}
      <rect
        x="180"
        y="390"
        width="40"
        height="60"
        rx="6"
        fill="#0284C7"
        fillOpacity="0.4"
        stroke="#38BDF8"
        strokeWidth="1"
      />

      {/* Large Gradient Water Droplet Overlapping Roof Corner */}
      <path
        d="M 120 40 C 120 40, 210 130, 210 185 C 210 235, 170 270, 120 270 C 70 270, 30 235, 30 185 C 30 130, 120 40, 120 40 Z"
        fill="url(#dropletGrad)"
        filter="url(#glow)"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
      />

      {/* Inner Droplet Highlight Specular */}
      <path
        d="M 95 130 C 95 130, 70 165, 70 190 C 70 205, 78 215, 88 218 C 82 210, 80 195, 85 180 C 90 162, 110 142, 110 142 Z"
        fill="#FFFFFF"
        fillOpacity="0.45"
      />
    </svg>
  );
}

function EmbeddedSignInForm() {
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
    <div className="wm-embed-login">
      <div className="wm-embed-login-icon">
        <Droplet size={22} />
      </div>
      <h5 className="wm-embed-login-title">Sign In</h5>
      <p className="wm-embed-login-subtitle">
        Enter your credentials to continue
      </p>

      <form onSubmit={handleLogin}>
        <div className="wm-embed-field">
          <label>Username</label>
          <div className="wm-embed-input-group">
            <PersonFill size={14} />
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="wm-embed-field">
          <label>Password</label>
          <div className="wm-embed-input-group">
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

        {error && <p className="wm-embed-error">{error}</p>}

        <button className="wm-embed-submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="wm-embed-footer">
        New here?{" "}
        <button className="wm-link-btn" onClick={() => navigate("/register")}>
          Register
        </button>
      </p>
    </div>
  );
}

function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqRef, isFaqVisible] = useScrollReveal();

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className={`wm-section wm-scroll-reveal ${isFaqVisible ? "wm-revealed" : ""}`}
      id="faq"
      ref={faqRef}
    >
      <div className="wm-section-head">
        <span className="wm-section-eyebrow">Got Questions?</span>
        <h2 className="wm-section-title">Frequently Asked Questions</h2>
      </div>

      <div className="wm-faq-container">
        {faqs.map((faq, idx) => (
          <div key={idx} className="wm-faq-item">
            <button
              onClick={() => toggleFAQ(idx)}
              className={`wm-faq-trigger ${openIndex === idx ? "wm-faq-trigger-active" : ""}`}
            >
              <span>{faq.q}</span>
              <ChevronDown
                size={16}
                style={{
                  transform:
                    openIndex === idx ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </button>
            {openIndex === idx && (
              <div className="wm-faq-answer">
                <p>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function LandingPage() {
  const navigate = useNavigate();

  // Scroll reveal hook bindings
  const [featuresRef, isFeaturesVisible] = useScrollReveal();
  const [authRef, isAuthVisible] = useScrollReveal();
  const [trustRef, isTrustVisible] = useScrollReveal();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="wm-land">
      {/* Navbar */}
      <header className="wm-land-nav">
        <div className="wm-land-nav-inner">
          <div className="wm-land-brand">
            <div className="wm-land-brand-mark">
              <Droplet size={17} />
            </div>
            <span>Water Billing</span>
          </div>

          <nav className="wm-land-nav-links">
            <button onClick={() => scrollTo("features")}>Features</button>
            <button onClick={() => scrollTo("faq")}>FAQ</button>
            <button onClick={() => scrollTo("roles")}>Get Started</button>
          </nav>

          <div className="wm-land-nav-right">
            {/* Language Switcher integrated on Landing Page */}
            <LanguageSwitcher />

            <button
              className="wm-land-btn-primary wm-land-nav-cta"
              onClick={() => scrollTo("roles")}
            >
              Get Started
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="wm-hero">
        <div className="wm-hero-blob wm-hero-blob-1" />
        <div className="wm-hero-blob wm-hero-blob-2" />
        <div className="wm-hero-blob wm-hero-blob-3" />

        <div className="wm-hero-grid">
          <div className="wm-hero-content">
            <span
              className="wm-hero-eyebrow wm-fade-up"
              style={{ animationDelay: "0.05s" }}
            >
              Water Usage Monitoring &amp; Billing
            </span>
            <h1
              className="wm-hero-title wm-fade-up"
              style={{ animationDelay: "0.15s" }}
            >
              Track water usage.
              <br />
              Manage communities.
              <br />
              <span className="wm-hero-title-accent">All in one place.</span>
            </h1>
            <p
              className="wm-hero-subtitle wm-fade-up"
              style={{ animationDelay: "0.25s" }}
            >
              A role-based platform for apartment communities — residents log
              usage, community admins manage their residents, and super admins
              oversee it all.
            </p>
            <div
              className="wm-hero-actions wm-fade-up"
              style={{ animationDelay: "0.35s" }}
            >
              <button
                className="wm-land-btn-primary"
                onClick={() => scrollTo("roles")}
              >
                Get Started
                <ArrowRight size={15} />
              </button>
              <button
                className="wm-land-btn-ghost"
                onClick={() => scrollTo("features")}
              >
                See Features
              </button>
            </div>
          </div>

          <div
            className="wm-hero-visual wm-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="wm-hero-ring" />

            {/* Custom SVG Apartment & Droplet Backdrop */}
            <HeroApartmentSVG />

            {/* Existing Floating Dashboard Card */}
            <div className="wm-hero-card">
              <div className="wm-hero-card-dots">
                <span />
                <span />
                <span />
              </div>

              <div className="wm-hero-card-main">
                <div className="wm-hero-droplet">
                  <DropletFill size={22} />
                </div>
                <div>
                  <div className="wm-hero-card-value">182 L</div>
                  <div className="wm-hero-card-label">Today's Usage</div>
                </div>
              </div>

              <svg
                className="wm-hero-trend"
                viewBox="0 0 160 44"
                preserveAspectRatio="none"
              >
                <polyline
                  className="wm-hero-trend-line"
                  points="2,34 24,26 46,30 68,14 90,20 112,8 134,16 158,6"
                  fill="none"
                  stroke="#5EEAD4"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  className="wm-hero-trend-dot"
                  cx="158"
                  cy="6"
                  r="4"
                  fill="#5EEAD4"
                />
              </svg>

              <div className="wm-hero-card-bars">
                <span style={{ "--h": "40%", animationDelay: "0.5s" }} />
                <span style={{ "--h": "65%", animationDelay: "0.6s" }} />
                <span style={{ "--h": "50%", animationDelay: "0.7s" }} />
                <span style={{ "--h": "85%", animationDelay: "0.8s" }} />
                <span style={{ "--h": "70%", animationDelay: "0.9s" }} />
                <span style={{ "--h": "95%", animationDelay: "1.0s" }} />
                <span style={{ "--h": "60%", animationDelay: "1.1s" }} />
              </div>

              <div className="wm-hero-card-footer">
                <span className="wm-hero-card-tag">Tier 1 Active</span>
                <span className="wm-hero-card-tag wm-hero-card-tag-accent">
                  On Track
                </span>
              </div>
            </div>

            <div className="wm-hero-chip wm-hero-chip-1">
              <BellFill size={13} />2 Alerts
            </div>
            <div className="wm-hero-chip wm-hero-chip-2">
              <ShieldLockFill size={13} />
              Role-Secured
            </div>
          </div>
        </div>

        <svg
          className="wm-hero-wave"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,64 C240,120 480,0 720,32 C960,64 1200,120 1440,64 L1440,120 L0,120 Z"
            fill="#F6F8FB"
          />
        </svg>
      </section>

      {/* Features */}
      <section
        className={`wm-section wm-scroll-reveal ${isFeaturesVisible ? "wm-revealed" : ""}`}
        id="features"
        ref={featuresRef}
      >
        <div className="wm-section-head">
          <span className="wm-section-eyebrow">Features</span>
          <h2 className="wm-section-title">
            Built for every level of the community
          </h2>
        </div>

        <div className="wm-features-grid">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div className="wm-feature-card" key={i}>
                <div className="wm-feature-icon">
                  <Icon size={19} />
                </div>
                <h6>{f.title}</h6>
                <p>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <LandingFAQ />

      {/* Sign-in — two-panel block: brand story left, form right */}
      <section
        className={`wm-auth-section wm-scroll-reveal ${isAuthVisible ? "wm-revealed" : ""}`}
        id="roles"
        ref={authRef}
      >
        <div className="wm-auth-block">
          <div className="wm-auth-visual">
            <div className="wm-auth-blob wm-auth-blob-1" />
            <div className="wm-auth-blob wm-auth-blob-2" />

            <div className="wm-auth-visual-inner">
              <div className="wm-land-brand wm-auth-brand">
                <div className="wm-land-brand-mark">
                  <Droplet size={17} />
                </div>
                <span>Water Billing</span>
              </div>

              <h2 className="wm-auth-headline">
                Know your usage.
                <br />
                Trust your bill.
              </h2>
              <p className="wm-auth-subtext">
                Sign in to see daily readings, tiered billing breakdowns, and
                usage alerts before they become surprises on your invoice.
              </p>

              <ul className="wm-auth-points">
                {authPoints.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <li key={i}>
                      <Icon size={15} />
                      <span>{p.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="wm-auth-formzone">
            <EmbeddedSignInForm />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section
        className={`wm-trust wm-scroll-reveal ${isTrustVisible ? "wm-revealed" : ""}`}
        ref={trustRef}
      >
        <div className="wm-trust-item">
          <div className="wm-trust-badge">
            <CheckCircleFill size={15} />
          </div>
          <span>JWT-secured authentication</span>
        </div>
        <div className="wm-trust-item">
          <div className="wm-trust-badge">
            <CheckCircleFill size={15} />
          </div>
          <span>Role-scoped data access</span>
        </div>
        <div className="wm-trust-item">
          <div className="wm-trust-badge">
            <CheckCircleFill size={15} />
          </div>
          <span>Real usage-based insights</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="wm-footer">
        <div className="wm-footer-divider" />
        <div className="wm-land-brand">
          <div className="wm-land-brand-mark">
            <Droplet size={15} />
          </div>
          <span>Water Billing</span>
        </div>
        <p>Water Usage Monitoring &amp; Billing Administration Platform</p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        .wm-land {
          font-family: 'Inter', sans-serif;
          color: #0F172A;
          background: #F6F8FB;
          overflow-x: hidden;
        }

        /* Scroll Reveal Effect */
        .wm-scroll-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .wm-scroll-reveal.wm-revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* Navbar */
        .wm-land-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(11,28,44,0.85);
          backdrop-filter: blur(10px);
        }
        .wm-land-nav-inner {
          max-width: 1160px;
          margin: 0 auto;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .wm-land-brand {
          display: flex;
          align-items: center;
          gap: 9px;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 15.5px;
          color: #fff;
        }
        .wm-land-brand-mark {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          background: #14B8A6;
          color: #06231f;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wm-land-nav-links {
          display: flex;
          gap: 6px;
        }
        .wm-land-nav-links button {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.75);
          font-size: 13.5px;
          font-weight: 500;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
        }
        .wm-land-nav-links button:hover { color: #fff; background: rgba(255,255,255,0.08); }
        .wm-land-nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .wm-land-nav-cta { padding: 9px 16px !important; font-size: 13.5px !important; }

        @media (max-width: 767px) {
          .wm-land-nav-links { display: none; }
        }

        /* Buttons */
        .wm-land-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #14B8A6;
          color: #06231f;
          border: none;
          padding: 13px 24px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14.5px;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease;
        }
        .wm-land-btn-primary:hover { background: #0EA99A; transform: translateY(-1px); }

        .wm-land-btn-ghost {
          background: rgba(255,255,255,0.08);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.18);
          padding: 13px 24px;
          border-radius: 10px;
          font-weight: 500;
          font-size: 14.5px;
          cursor: pointer;
        }
        .wm-land-btn-ghost:hover { background: rgba(255,255,255,0.14); }

        /* Hero */
        .wm-hero {
          position: relative;
          background: #0B1C2C;
          padding: 90px 24px 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .wm-hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.35;
        }
        .wm-hero-blob-1 { width: 420px; height: 420px; background: #14B8A6; top: -120px; left: -100px; }
        .wm-hero-blob-2 { width: 380px; height: 380px; background: #6366F1; top: -60px; right: -120px; }
        .wm-hero-blob-3 { width: 300px; height: 300px; background: #0EA5E9; bottom: -60px; left: 40%; opacity: 0.25; }

        .wm-hero-grid {
          position: relative;
          z-index: 2;
          max-width: 1160px;
          width: 100%;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          align-items: center;
          gap: 40px;
          padding-bottom: 90px;
        }
        .wm-hero-content {
          text-align: left;
        }
        .wm-hero-eyebrow {
          display: inline-block;
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.4px;
          color: #5EEAD4;
          background: rgba(20,184,166,0.14);
          padding: 6px 14px;
          border-radius: 999px;
          margin-bottom: 22px;
        }
        .wm-hero-title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 44px;
          line-height: 1.15;
          color: #fff;
          letter-spacing: -1px;
          margin-bottom: 18px;
        }
        .wm-hero-title-accent {
          background: linear-gradient(90deg, #5EEAD4, #7DD3FC);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .wm-hero-subtitle {
          font-size: 16px;
          color: rgba(255,255,255,0.68);
          line-height: 1.6;
          margin-bottom: 32px;
        }
        .wm-hero-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-start;
          flex-wrap: wrap;
        }
        .wm-hero-wave {
          width: 100%;
          height: 90px;
          display: block;
        }

        @media (max-width: 640px) {
          .wm-hero-title { font-size: 32px; }
        }

        /* Entrance animation */
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .wm-fade-up {
          opacity: 0;
          animation: heroFadeUp 0.7s ease forwards;
        }

        /* Background blob drift */
        .wm-hero-blob-1 { animation: blobDrift1 16s ease-in-out infinite; }
        .wm-hero-blob-2 { animation: blobDrift2 20s ease-in-out infinite; }
        .wm-hero-blob-3 { animation: blobDrift3 24s ease-in-out infinite; }
        @keyframes blobDrift1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(24px, -18px); }
        }
        @keyframes blobDrift2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 16px); }
        }
        @keyframes blobDrift3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(14px, -22px); }
        }

        /* Hero illustration */
        .wm-hero-visual {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 380px;
        }
        .wm-hero-svg-bg {
          position: absolute;
          width: 120%;
          height: auto;
          max-width: 520px;
          z-index: 1;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        /* Window Glow Animations */
        .wm-win {
          fill: #334155;
          transition: fill 0.5s ease;
        }
        .wm-win-1 { animation: windowGlow 4s ease-in-out infinite 0s; }
        .wm-win-2 { animation: windowGlow 4s ease-in-out infinite 1.3s; }
        .wm-win-3 { animation: windowGlow 4s ease-in-out infinite 2.6s; }

        @keyframes windowGlow {
          0%, 100% { fill: #334155; }
          50% { fill: #38BDF8; filter: drop-shadow(0px 0px 4px #38BDF8); }
        }

        .wm-hero-ring {
          position: absolute;
          width: 340px;
          height: 340px;
          border: 1.5px dashed rgba(94,234,212,0.22);
          border-radius: 50%;
          animation: heroSpin 40s linear infinite;
        }
        @keyframes heroSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .wm-hero-card {
          position: relative;
          z-index: 2;
          width: 280px;
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 20px;
          padding: 20px;
          backdrop-filter: blur(12px);
          box-shadow: 0 24px 50px -20px rgba(0,0,0,0.6);
          animation: heroFloat 6s ease-in-out infinite;
        }
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0) rotate(-1.5deg); }
          50% { transform: translateY(-12px) rotate(-0.5deg); }
        }
        .wm-hero-card-dots {
          display: flex;
          gap: 6px;
          margin-bottom: 14px;
        }
        .wm-hero-card-dots span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255,255,255,0.25);
        }
        .wm-hero-card-main {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
        .wm-hero-droplet {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: rgba(94,234,212,0.16);
          color: #5EEAD4;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wm-hero-card-value {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 22px;
          color: #fff;
          line-height: 1.1;
        }
        .wm-hero-card-label {
          font-size: 11.5px;
          color: rgba(255,255,255,0.5);
          margin-top: 2px;
        }
        .wm-hero-trend {
          width: 100%;
          height: 44px;
          margin-bottom: 14px;
        }
        .wm-hero-trend-line {
          stroke-dasharray: 220;
          stroke-dashoffset: 220;
          animation: heroDraw 1.6s ease forwards 0.6s;
        }
        @keyframes heroDraw {
          to { stroke-dashoffset: 0; }
        }
        .wm-hero-trend-dot {
          animation: heroPulseDot 2s ease-in-out infinite 2.2s;
        }
        @keyframes heroPulseDot {
          0%, 100% { opacity: 1; r: 4; }
          50% { opacity: 0.4; r: 6; }
        }
        .wm-hero-card-bars {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          height: 46px;
          margin-bottom: 16px;
        }
        .wm-hero-card-bars span {
          flex: 1;
          height: var(--h);
          background: linear-gradient(180deg, #5EEAD4, #14B8A6);
          border-radius: 4px;
          transform: scaleY(0);
          transform-origin: bottom;
          animation: heroGrowBar 0.6s ease forwards;
        }
        @keyframes heroGrowBar {
          to { transform: scaleY(1); }
        }
        .wm-hero-card-footer {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .wm-hero-card-tag {
          font-size: 10.5px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.7);
        }
        .wm-hero-card-tag-accent {
          background: rgba(94,234,212,0.16);
          color: #5EEAD4;
        }

        .wm-hero-chip {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 6px;
          background: #fff;
          color: #0F172A;
          font-size: 12px;
          font-weight: 600;
          padding: 8px 13px;
          border-radius: 12px;
          box-shadow: 0 14px 30px -12px rgba(0,0,0,0.35);
          z-index: 3;
        }
        .wm-hero-chip svg { color: #14B8A6; flex-shrink: 0; }
        .wm-hero-chip-1 {
          top: 4%;
          right: 2%;
          animation: heroChipFloat 5s ease-in-out infinite;
        }
        .wm-hero-chip-2 {
          bottom: 6%;
          left: -4%;
          animation: heroChipFloat 5.5s ease-in-out infinite 0.6s;
        }
        @keyframes heroChipFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-9px); }
        }

        @media (max-width: 991px) {
          .wm-hero-grid { grid-template-columns: 1fr; gap: 48px; text-align: center; }
          .wm-hero-content { text-align: center; }
          .wm-hero-actions { justify-content: center; }
          .wm-hero-visual { min-height: 300px; margin-top: 10px; }
        }
        @media (max-width: 480px) {
          .wm-hero-chip { display: none; }
        }

        /* Sections */
        .wm-section { padding: 70px 24px; max-width: 1160px; margin: 0 auto; }

        .wm-section-head { text-align: center; max-width: 560px; margin: 0 auto 44px; }
        .wm-section-eyebrow {
          display: block;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: #0D9488;
          margin-bottom: 10px;
        }
        .wm-section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 28px;
          color: #0F172A;
          letter-spacing: -0.5px;
        }

        .wm-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .wm-feature-card {
          position: relative;
          background: #fff;
          border: 1px solid #E7EBF1;
          border-radius: 16px;
          padding: 22px;
          overflow: hidden;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .wm-feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #14B8A6, #38BDF8);
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .wm-feature-card:hover {
          transform: translateY(-4px);
          border-color: #CBD5E1;
          box-shadow: 0 12px 24px -8px rgba(15, 23, 42, 0.08);
        }
        .wm-feature-card:hover::before {
          opacity: 1;
        }
        .wm-feature-icon {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          background: #E3FBF6;
          color: #0D9488;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
        }
        .wm-feature-card:hover .wm-feature-icon {
          transform: translateY(-2px);
          background: #14B8A6;
          color: #fff;
        }
        .wm-feature-card h6 {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 15px;
          margin-bottom: 6px;
          color: #0F172A;
        }
        .wm-feature-card p {
          font-size: 13px;
          color: #64748B;
          line-height: 1.55;
          margin: 0;
        }

        /* FAQ Styling */
        .wm-faq-container {
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .wm-faq-item {
          background: #fff;
          border: 1px solid #E7EBF1;
          border-radius: 14px;
          overflow: hidden;
          transition: border-color 0.15s ease;
        }
        .wm-faq-item:hover { border-color: #CBD5E1; }
        .wm-faq-trigger {
          position: relative;
          width: 100%;
          padding: 18px 22px 18px 26px;
          background: #fff;
          border: none;
          text-align: left;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 15px;
          color: #0F172A;
          cursor: pointer;
          transition: background 0.15s ease, padding-left 0.2s ease;
        }
        .wm-faq-trigger::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #14B8A6;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .wm-faq-trigger-active {
          background: #F8FAFC;
        }
        .wm-faq-trigger-active::before {
          opacity: 1;
        }
        .wm-faq-answer {
          padding: 0 22px 18px 26px;
          color: #64748B;
          font-size: 13.5px;
          line-height: 1.6;
        }
        .wm-faq-answer p { margin: 0; }

        @media (max-width: 900px) {
          .wm-features-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .wm-features-grid { grid-template-columns: 1fr; }
        }

        /* Sign-in: two-panel block */
        .wm-auth-section {
          padding: 20px 24px 90px;
        }
        .wm-auth-block {
          max-width: 1160px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 30px 70px -25px rgba(11,28,44,0.4);
        }

        .wm-auth-visual {
          position: relative;
          background: #0B1C2C;
          padding: 56px 48px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .wm-auth-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.3;
        }
        .wm-auth-blob-1 { width: 300px; height: 300px; background: #14B8A6; top: -80px; left: -60px; }
        .wm-auth-blob-2 { width: 260px; height: 260px; background: #6366F1; bottom: -80px; right: -60px; opacity: 0.28; }

        .wm-auth-visual-inner {
          position: relative;
          z-index: 2;
        }
        .wm-auth-brand {
          margin-bottom: 28px;
        }
        .wm-auth-headline {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 32px;
          line-height: 1.2;
          color: #fff;
          letter-spacing: -0.5px;
          margin-bottom: 14px;
        }
        .wm-auth-subtext {
          font-size: 14px;
          color: rgba(255,255,255,0.66);
          line-height: 1.65;
          margin-bottom: 30px;
          max-width: 380px;
        }
        .wm-auth-points {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .wm-auth-points li {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          font-size: 13.5px;
          color: rgba(255,255,255,0.85);
          line-height: 1.5;
        }
        .wm-auth-points li svg {
          color: #5EEAD4;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .wm-auth-formzone {
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 56px 44px;
        }

        .wm-embed-login {
          width: 100%;
          max-width: 340px;
          margin: 0 auto;
          background: transparent;
          border: none;
          padding: 0;
          text-align: center;
        }
        .wm-embed-login-icon {
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
        .wm-embed-login-title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 20px;
          color: #0F172A;
          margin-bottom: 4px;
        }
        .wm-embed-login-subtitle {
          font-size: 13.5px;
          color: #64748B;
          margin-bottom: 22px;
        }
        .wm-embed-field {
          text-align: left;
          margin-bottom: 14px;
        }
        .wm-embed-field label {
          font-size: 12px;
          color: #64748B;
          display: block;
          margin-bottom: 6px;
        }
        .wm-embed-input-group {
          display: flex;
          align-items: center;
          gap: 9px;
          background: #F8FAFC;
          border: 1px solid #E7EBF1;
          border-radius: 10px;
          padding: 0 12px;
          height: 44px;
          transition: border-color 0.15s ease;
        }
        .wm-embed-input-group:focus-within { border-color: #14B8A6; background: #fff; }
        .wm-embed-input-group svg { color: #a3adba; flex-shrink: 0; }
        .wm-embed-input-group input {
          border: none;
          outline: none;
          flex: 1;
          font-size: 14px;
          height: 100%;
          background: transparent;
        }
        .wm-embed-error {
          color: #EF4444;
          font-size: 12.5px;
          text-align: left;
          margin: -4px 0 12px;
        }
        .wm-embed-submit {
          width: 100%;
          background: #14B8A6;
          color: #06231f;
          border: none;
          height: 44px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .wm-embed-submit:hover { background: #0EA99A; }
        .wm-embed-submit:disabled { opacity: 0.7; cursor: default; }
        .wm-embed-footer {
          font-size: 13px;
          color: #64748B;
          margin: 18px 0 0;
        }
        .wm-link-btn {
          background: transparent;
          border: none;
          color: #0D9488;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          padding: 0;
        }
        .wm-link-btn:hover { text-decoration: underline; }

        @media (max-width: 900px) {
          .wm-auth-block { grid-template-columns: 1fr; border-radius: 22px; }
          .wm-auth-visual { padding: 40px 32px; }
          .wm-auth-headline { font-size: 26px; }
          .wm-auth-formzone { padding: 40px 28px; }
        }

        .wm-trust {
          display: flex;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
          padding: 20px 24px 60px;
          max-width: 1160px;
          margin: 0 auto;
        }
        .wm-trust-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13.5px;
          font-weight: 500;
          color: #0F172A;
          cursor: default;
        }
        .wm-trust-badge {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #E3FBF6;
          color: #0D9488;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
        }
        .wm-trust-item:hover .wm-trust-badge {
          transform: translateY(-2px);
          background: #14B8A6;
          color: #fff;
        }

        .wm-footer {
          position: relative;
          background: #0B1C2C;
          padding: 48px 24px 40px;
          text-align: center;
        }
        .wm-footer-divider {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          max-width: 800px;
          height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,0), rgba(94, 234, 212, 0.3), rgba(255,255,255,0));
        }
        .wm-footer .wm-land-brand { justify-content: center; margin-bottom: 8px; }
        .wm-footer p {
          font-size: 12.5px;
          color: rgba(255,255,255,0.45);
          margin: 0;
        }
      `}</style>
    </div>
  );
}

export default LandingPage;
