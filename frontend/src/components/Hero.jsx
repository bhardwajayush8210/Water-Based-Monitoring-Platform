import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <div className="wb-hero">
      <div className="wb-hero-glow wb-glow-1"></div>
      <div className="wb-hero-glow wb-glow-2"></div>

      <div className="container text-center position-relative">
        <span className="wb-eyebrow">💧 Built for Apartment Communities</span>

        <h1 className="display-3 fw-bold wb-title">
          Smart Water Usage Monitoring
        </h1>

        <h3 className="wb-subtitle">& Billing Administration Platform</h3>

        <p className="lead wb-lead mx-auto mt-4">
          Manage Apartments, Community Admins, Residents, Water Usage and Bills
          from one platform.
        </p>

        <div className="d-flex flex-wrap justify-content-center gap-3 mt-5">
          <button
            className="btn btn-primary btn-lg px-4"
            onClick={() => navigate("/admin/login")}
          >
            🛠 Admin Login
          </button>

          <button
            className="btn btn-success btn-lg px-4"
            onClick={() => navigate("/community/login")}
          >
            🏢 Community Login
          </button>

          <button
            className="btn btn-info btn-lg px-4 text-white"
            onClick={() => navigate("/resident/login")}
          >
            👤 Resident Login
          </button>
        </div>

        <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
          {/* <button
            className="btn btn-outline-success btn-lg"
            onClick={() => navigate("/community/register")}
          >
            Community Admin Register
          </button> */}

        </div>
      </div>

      <style>{`

      .wb-hero{
        min-height:90vh;
        display:flex;
        align-items:center;
        justify-content:center;
        position:relative;
        overflow:hidden;
        background:#f8fbff;
      }

      .wb-glow-1{
        position:absolute;
        width:400px;
        height:400px;
        background:#0d6efd;
        border-radius:50%;
        filter:blur(80px);
        top:-120px;
        left:-100px;
        opacity:.18;
      }

      .wb-glow-2{
        position:absolute;
        width:350px;
        height:350px;
        background:#20c997;
        border-radius:50%;
        filter:blur(80px);
        bottom:-100px;
        right:-100px;
        opacity:.18;
      }

      .wb-title{
        color:#0d6efd;
      }

      .wb-subtitle{
        font-weight:600;
      }

      .wb-lead{
        max-width:650px;
      }

      .wb-eyebrow{
        display:inline-block;
        padding:8px 20px;
        background:#dbeafe;
        border-radius:30px;
        color:#0d6efd;
        margin-bottom:25px;
        font-weight:600;
      }

      `}</style>
    </div>
  );
}

export default Hero;
