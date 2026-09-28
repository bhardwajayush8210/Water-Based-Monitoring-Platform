import { useNavigate } from "react-router-dom";
import {
  DropletFill,
  Building,
  ArrowRight,
  Droplet,
} from "react-bootstrap-icons";

function RegisterChoice() {
  const navigate = useNavigate();

  return (
    <div className="wm-choice-page">
      <div className="wm-choice-card">
        <div className="wm-choice-icon">
          <Droplet size={22} />
        </div>
        <h2 className="wm-choice-title">Create an Account</h2>
        <p className="wm-choice-subtitle">
          How will you be using the platform?
        </p>

        <div className="wm-choice-options">
          <button
            className="wm-choice-option"
            onClick={() => navigate("/resident/register")}
          >
            <div className="wm-choice-option-icon">
              <DropletFill size={20} />
            </div>
            <div className="wm-choice-option-text">
              <h6>Resident</h6>
              <p>
                Live in a registered community and want to track your own usage
              </p>
            </div>
            <ArrowRight size={16} className="wm-choice-arrow" />
          </button>

          <button
            className="wm-choice-option"
            onClick={() => navigate("/community/register")}
          >
            <div className="wm-choice-option-icon">
              <Building size={20} />
            </div>
            <div className="wm-choice-option-text">
              <h6>Community Admin</h6>
              <p>Managing an apartment community and its residents</p>
            </div>
            <ArrowRight size={16} className="wm-choice-arrow" />
          </button>
        </div>

        <p className="wm-choice-footer">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&display=swap');

        .wm-choice-page {
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
        .wm-choice-page::before {
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

        .wm-choice-card {
          position: relative;
          z-index: 2;
          background: #fff;
          border-radius: 20px;
          padding: 38px 34px;
          width: 100%;
          max-width: 420px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        }
        .wm-choice-icon {
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
        .wm-choice-title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 21px;
          color: #0F172A;
          margin-bottom: 4px;
        }
        .wm-choice-subtitle {
          font-size: 13.5px;
          color: #64748B;
          margin-bottom: 22px;
        }
        .wm-choice-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .wm-choice-option {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #F6F8FB;
          border: 1px solid #E7EBF1;
          border-radius: 14px;
          padding: 16px;
          cursor: pointer;
          text-align: left;
          transition: border-color 0.15s ease, transform 0.15s ease;
        }
        .wm-choice-option:hover { border-color: #14B8A6; transform: translateY(-1px); }
        .wm-choice-option-icon {
          width: 42px;
          height: 42px;
          border-radius: 11px;
          background: #E3FBF6;
          color: #0D9488;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wm-choice-option-text { flex: 1; }
        .wm-choice-option-text h6 {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 14.5px;
          color: #0F172A;
          margin-bottom: 2px;
        }
        .wm-choice-option-text p {
          font-size: 12px;
          color: #64748B;
          margin: 0;
        }
        .wm-choice-arrow { color: #94A3B8; flex-shrink: 0; }

        .wm-choice-footer {
          font-size: 13px;
          color: #64748B;
          margin: 22px 0 0;
        }
        .wm-choice-footer a {
          color: #0D9488;
          font-weight: 600;
          text-decoration: none;
        }
        .wm-choice-footer a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}

export default RegisterChoice;
