import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";
import StatCard from "../components/layout/StatCard";
import { AreaChartMini } from "../components/MiniCharts";
import {
  PeopleFill,
  HouseDoorFill,
  DropletFill,
  ArrowRight,
  ClockHistory,
} from "react-bootstrap-icons";

function CommunityAdminDashboard() {
  const navigate = useNavigate();
  const isApproved = localStorage.getItem("approved") === "true";
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/community/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard stats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isApproved) loadStats();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const weeklyAverage =
    stats?.weeklyTrend?.length > 0
      ? (
          stats.weeklyTrend.reduce((s, d) => s + d.total, 0) /
          stats.weeklyTrend.length
        ).toFixed(1)
      : null;

  return (
    <>
      <Sidebar restricted={!isApproved} />
      <TopNavbar title="Dashboard" subtitle="Community overview" />

      <div className="wm-page">
        {!isApproved ? (
          <div className="wm-card wm-pending-card">
            <div className="wm-pending-icon">
              <ClockHistory size={26} />
            </div>
            <h5>Approval Pending</h5>
            <p>
              Your account is awaiting verification from a Super Admin. Once
              approved, you'll get full access to manage your community,
              residents, and water usage.
            </p>
          </div>
        ) : loading ? (
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
            <button className="wm-btn-outline" onClick={loadStats}>
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="row g-3">
              <div className="col-lg-4 col-md-6">
                <StatCard
                  icon={PeopleFill}
                  label="Residents"
                  value={String(stats.residentCount)}
                  tone="accent"
                />
              </div>
              <div className="col-lg-4 col-md-6">
                <StatCard
                  icon={HouseDoorFill}
                  label="Total Households"
                  value={
                    stats.totalFlats != null ? String(stats.totalFlats) : "—"
                  }
                  tone="success"
                  percent={
                    stats.totalFlats
                      ? Math.min(
                          (stats.residentCount / stats.totalFlats) * 100,
                          100,
                        )
                      : null
                  }
                />
              </div>
              <div className="col-lg-4 col-md-6">
                <StatCard
                  icon={DropletFill}
                  label="Today's Community Usage"
                  value={`${stats.todayTotalUsage} L`}
                  tone="warn"
                />
              </div>
            </div>

            <div className="row mt-3 g-3">
              <div className="col-lg-8">
                <div className="wm-card h-100">
                  <h6 className="wm-card-title">Water Consumption Trend</h6>
                  <p className="wm-card-subtitle">
                    Community-wide daily usage, last 7 days
                    {weeklyAverage && ` · avg ${weeklyAverage} L/day`}
                  </p>
                  {stats.weeklyTrend.length === 0 ? (
                    <p className="wm-empty-note">
                      No usage data yet. Log readings from the Water Usage page
                      to see trends here.
                    </p>
                  ) : (
                    <AreaChartMini
                      data={stats.weeklyTrend.map((d) => ({
                        label: d.date,
                        value: d.total,
                      }))}
                      color="#14B8A6"
                      height={260}
                    />
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="wm-card h-100 d-flex flex-column">
                  <h6 className="wm-card-title">Quick Actions</h6>
                  <p className="wm-card-subtitle">Common tasks</p>

                  <div className="wm-quick-actions">
                    <button
                      className="wm-quick-btn"
                      onClick={() => navigate("/community/meter")}
                    >
                      <DropletFill size={16} />
                      Log Water Usage
                      <ArrowRight size={13} className="ms-auto" />
                    </button>
                    <button
                      className="wm-quick-btn"
                      onClick={() => navigate("/community/residents")}
                    >
                      <PeopleFill size={16} />
                      Manage Residents
                      <ArrowRight size={13} className="ms-auto" />
                    </button>
                    <button
                      className="wm-quick-btn"
                      onClick={() => navigate("/community/apartments")}
                    >
                      <HouseDoorFill size={16} />
                      Apartment Details
                      <ArrowRight size={13} className="ms-auto" />
                    </button>
                  </div>
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
        .wm-card {
          background: #fff;
          border: 1px solid var(--wm-border, #E7EBF1);
          border-radius: 16px;
          padding: 20px 22px;
        }
        .wm-card-title {
          font-family: var(--wm-font-display, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: 15.5px;
          color: var(--wm-ink, #0F172A);
          margin: 0 0 2px 0;
        }
        .wm-card-subtitle {
          font-size: 12.5px;
          color: var(--wm-muted, #64748B);
          margin-bottom: 14px;
        }
        .wm-empty-note { font-size: 13px; color: var(--wm-muted, #64748B); }
        .wm-btn-outline {
          border: 1px solid var(--wm-accent);
          color: var(--wm-accent-dark);
          background: #fff;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
        }
        .wm-quick-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 4px;
        }
        .wm-quick-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--wm-bg, #F6F8FB);
          border: 1px solid var(--wm-border, #E7EBF1);
          color: var(--wm-ink, #0F172A);
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.15s ease;
        }
        .wm-quick-btn:hover { border-color: var(--wm-accent); }
        .wm-pending-card {
          text-align: center;
          max-width: 460px;
          margin: 60px auto;
          padding: 40px 30px;
        }
        .wm-pending-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--wm-warn-soft);
          color: #B45309;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
        }
        .wm-pending-card h5 {
          font-family: var(--wm-font-display, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: 18px;
          color: var(--wm-ink, #0F172A);
          margin-bottom: 10px;
        }
        .wm-pending-card p {
          font-size: 13.5px;
          color: var(--wm-muted, #64748B);
          line-height: 1.6;
          margin: 0;
        }
        @media (max-width: 991px) {
          .wm-page { margin-left: 0; padding: 90px 16px 24px; }
        }
      `}</style>
    </>
  );
}

export default CommunityAdminDashboard;
