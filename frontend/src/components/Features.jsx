import {
  FaBuilding,
  FaTint,
  FaFileInvoiceDollar,
  FaChartBar,
} from "react-icons/fa";

function Features() {
  const features = [
    {
      icon: <FaBuilding size={26} />,
      title: "Apartment",
      desc: "Manage Apartments",
      bg: "#e8f1fd",
      color: "#0d6efd",
    },
    {
      icon: <FaTint size={26} />,
      title: "Water Usage",
      desc: "Track Daily Usage",
      bg: "#e9f5fd",
      color: "#0dcaf0",
    },
    {
      icon: <FaFileInvoiceDollar size={26} />,
      title: "Billing",
      desc: "Generate Bills",
      bg: "#e9f9ef",
      color: "#198754",
    },
    {
      icon: <FaChartBar size={26} />,
      title: "Reports",
      desc: "Analytics Dashboard",
      bg: "#fdecea",
      color: "#dc3545",
    },
  ];

  return (
    <div className="wb-features container">
      <div className="text-center mb-5">
        <span className="wb-kicker">Everything in one place</span>
        <h2 className="fw-bold">Features</h2>
      </div>

      <div className="row g-4">
        {features.map((f, i) => (
          <div className="col-md-3 col-sm-6" key={i}>
            <div className="wb-feature-card text-center">
              <div
                className="wb-feature-icon"
                style={{ background: f.bg, color: f.color }}
              >
                {f.icon}
              </div>
              <h4 className="mt-3">{f.title}</h4>
              <p className="mb-0">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .wb-features {
          padding: 70px 0;
        }
        .wb-kicker {
          display: block;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          color: #0d6efd;
          margin-bottom: 8px;
        }
        .wb-feature-card {
          background: #fff;
          border: 1px solid #eef1f5;
          border-radius: 16px;
          padding: 34px 20px;
          height: 100%;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .wb-feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 30px rgba(20, 30, 60, 0.08);
        }
        .wb-feature-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }
        .wb-feature-card h4 {
          font-size: 17px;
          font-weight: 700;
        }
        .wb-feature-card p {
          font-size: 14px;
          color: #6c7a86;
        }
      `}</style>
    </div>
  );
}

export default Features;
