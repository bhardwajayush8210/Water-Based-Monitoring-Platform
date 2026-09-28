import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import AdminSidebar from "../components/layout/AdminSidebar";
import TopNavbar from "../components/layout/TopNavbar";
import StatCard from "../components/layout/StatCard";
import { BarChartMini } from "../components/MiniCharts";
import {
  PeopleFill,
  Building,
  PersonCircle,
  ArrowRight,
  GeoAltFill,
  HourglassSplit,
} from "react-bootstrap-icons";

function AdminDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Admin";

  const [apartments, setApartments] = useState([]);
  const [residents, setResidents] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [apartmentsRes, residentsRes, pendingRes] = await Promise.all([
        api.get("/apartments"),
        api.get("/auth/residents"),
        api.get("/admin/community-admins/pending").catch(() => ({ data: [] })),
      ]);
      setApartments(apartmentsRes.data);
      setResidents(residentsRes.data);
      setPendingCount(pendingRes.data.length);
    } catch (err) {
      console.error(err);
      setError("Failed to load platform data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const residentCountFor = (apartmentName) =>
    residents.filter(
      (r) =>
        (r.apartment || "").toLowerCase() ===
        (apartmentName || "").toLowerCase(),
    ).length;

  return (
    <>
      <AdminSidebar />
      <TopNavbar title="Dashboard" subtitle={`Welcome back, ${username}`} />

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
            <button className="wm-btn-outline" onClick={loadData}>
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="row g-3">
              <div className="col-md-4">
                <StatCard
                  icon={Building}
                  label="Total Communities"
                  value={String(apartments.length)}
                  tone="accent"
                />
              </div>
              <div className="col-md-4">
                <StatCard
                  icon={PeopleFill}
                  label="Total Residents"
                  value={String(residents.length)}
                  tone="success"
                />
              </div>
              <div className="col-md-4">
                <div
                  onClick={() => navigate("/admin/pending-approvals")}
                  style={{ cursor: "pointer" }}
                >
                  <StatCard
                    icon={HourglassSplit}
                    label="Pending Approvals"
                    value={String(pendingCount)}
                    tone={pendingCount > 0 ? "warn" : "success"}
                  />
                </div>
              </div>
            </div>

            {apartments.length > 0 && (
              <div className="wm-card mt-3">
                <h6 className="wm-card-title">Residents by Community</h6>
                <p className="wm-card-subtitle">
                  Distribution across every registered community
                </p>
                <BarChartMini
                  data={apartments.map((a) => ({
                    label: a.apartmentName,
                    value: residentCountFor(a.apartmentName),
                  }))}
                  color="#6366F1"
                  height={220}
                  unit="residents"
                />
              </div>
            )}

            <div className="wm-card mt-3">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="wm-card-title mb-0">All Communities</h6>
                <button
                  className="wm-btn-outline"
                  onClick={() => navigate("/admin/residents")}
                >
                  Full drill-down view
                  <ArrowRight size={12} className="ms-2" />
                </button>
              </div>

              {apartments.length === 0 ? (
                <p className="wm-muted-text text-center py-4 mb-0">
                  No communities registered yet.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="wm-table">
                    <thead>
                      <tr>
                        <th>Community</th>
                        <th>Admin</th>
                        <th>Location</th>
                        <th>Residents</th>
                        <th>Total Flats</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apartments.map((apt) => (
                        <tr
                          key={apt.id}
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate("/admin/residents")}
                        >
                          <td style={{ fontWeight: 500 }}>
                            {apt.apartmentName}
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <PersonCircle size={18} color="#c7d0d9" />
                              {apt.communityAdmin?.fullName ||
                                apt.communityAdmin?.username ||
                                "—"}
                            </div>
                          </td>
                          <td className="wm-muted-text">
                            <GeoAltFill size={11} className="me-1" />
                            {apt.city || "—"}
                            {apt.state ? `, ${apt.state}` : ""}
                          </td>
                          <td>
                            <span className="wm-badge wm-badge-accent">
                              {residentCountFor(apt.apartmentName)}
                            </span>
                          </td>
                          <td className="wm-muted-text">
                            {apt.totalFlats ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="wm-card mt-3">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="wm-card-title mb-0">All Residents</h6>
                <span className="wm-badge wm-badge-neutral">
                  {residents.length} total
                </span>
              </div>

              {residents.length === 0 ? (
                <p className="wm-muted-text text-center py-4 mb-0">
                  No residents registered yet.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="wm-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Community</th>
                        <th>Flat</th>
                        <th>Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {residents.map((r) => (
                        <tr key={r.id}>
                          <td style={{ fontWeight: 500 }}>{r.fullName}</td>
                          <td className="wm-muted-text">@{r.username}</td>
                          <td>
                            <span className="wm-badge wm-badge-accent">
                              {r.apartment || "—"}
                            </span>
                          </td>
                          <td>
                            <span className="wm-badge wm-badge-neutral">
                              {r.flatNumber || "—"}
                            </span>
                          </td>
                          <td className="wm-muted-text">{r.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
        .wm-card {
          background: #fff;
          border: 1px solid var(--wm-border, #E7EBF1);
          border-radius: 16px;
          padding: 20px 22px;
        }
        .wm-card-title {
          font-family: var(--wm-font-display, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: 15px;
          color: var(--wm-ink, #0F172A);
        }
        .wm-muted-text { color: var(--wm-muted, #64748B); font-size: 13.5px; }
        .wm-badge { font-size: 11.5px; font-weight: 600; padding: 4px 10px; border-radius: 999px; }
        .wm-badge-accent { background: var(--wm-accent-soft); color: var(--wm-accent-dark); }
        .wm-badge-neutral { background: #eef1f5; color: #414d5c; }
        .wm-btn-outline {
          display: inline-flex;
          align-items: center;
          border: 1px solid var(--wm-accent);
          color: var(--wm-accent-dark);
          background: #fff;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
        }
        .wm-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .wm-table thead th {
          text-align: left;
          font-weight: 500;
          font-size: 11.5px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          color: var(--wm-muted, #64748B);
          padding: 0 12px 10px;
          border-bottom: 1px solid var(--wm-border, #E7EBF1);
        }
        .wm-table tbody td {
          padding: 12px;
          border-bottom: 1px solid var(--wm-border, #E7EBF1);
          color: var(--wm-ink, #0F172A);
        }
        .wm-table tbody tr:hover { background: var(--wm-bg, #F6F8FB); }
        .wm-table tbody tr:last-child td { border-bottom: none; }
        @media (max-width: 991px) {
          .wm-page { margin-left: 0; padding: 90px 16px 24px; }
        }
      `}</style>
    </>
  );
}

export default AdminDashboard;
