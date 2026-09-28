import { useEffect, useState } from "react";
import api from "../api/api";
import AdminSidebar from "../components/layout/AdminSidebar";
import TopNavbar from "../components/layout/TopNavbar";
import {
  PersonCircle,
  GeoAltFill,
  CheckCircleFill,
  HourglassSplit,
} from "react-bootstrap-icons";

function PendingApprovals() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvingId, setApprovingId] = useState(null);

  const loadPending = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/community-admins/pending");
      setPending(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load pending approvals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (id) => {
    setApprovingId(id);
    try {
      await api.put(`/admin/community-admins/${id}/approve`);
      loadPending();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to approve.");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <>
      <AdminSidebar />
      <TopNavbar
        title="Pending Approvals"
        subtitle="Community Admins awaiting verification"
      />

      <div className="wm-page">
        <div className="wm-card">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <HourglassSplit size={16} color="var(--wm-accent-dark)" />
              <h6 className="wm-card-title mb-0">
                Pending Community Admin Approvals
              </h6>
            </div>
            <span className="wm-badge wm-badge-warn">
              {pending.length} pending
            </span>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                style={{ color: "var(--wm-accent)" }}
                role="status"
              />
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <p style={{ color: "var(--wm-danger)", fontSize: 14 }}>{error}</p>
              <button className="wm-btn-outline" onClick={loadPending}>
                Retry
              </button>
            </div>
          ) : pending.length === 0 ? (
            <div className="text-center py-5">
              <CheckCircleFill size={32} color="#c7d0d9" />
              <p className="wm-muted-text mt-3 mb-0">
                No pending approvals right now.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="wm-table">
                <thead>
                  <tr>
                    <th>Admin Details</th>
                    <th>Apartment & Location</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <PersonCircle size={26} color="#c7d0d9" />
                          <div>
                            <div style={{ fontWeight: 600 }}>{p.fullName}</div>
                            <div className="wm-muted-text">{p.email}</div>
                            <div className="wm-muted-text">{p.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{p.apartmentName}</div>
                        <div className="wm-muted-text">
                          <GeoAltFill size={11} className="me-1" />
                          {p.city}
                        </div>
                      </td>
                      <td className="text-end">
                        <button
                          className="wm-btn-approve"
                          disabled={approvingId === p.id}
                          onClick={() => handleApprove(p.id)}
                        >
                          {approvingId === p.id
                            ? "Approving..."
                            : "Approve Admin"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
          padding: 22px;
        }
        .wm-card-title {
          font-family: var(--wm-font-display, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: 15px;
          color: var(--wm-ink, #0F172A);
        }
        .wm-muted-text { color: var(--wm-muted, #64748B); font-size: 12.5px; }
        .wm-badge { font-size: 11.5px; font-weight: 600; padding: 4px 10px; border-radius: 999px; }
        .wm-badge-warn { background: var(--wm-warn-soft); color: #B45309; }
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
        .wm-btn-approve {
          background: var(--wm-success, #22C55E);
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
        }
        .wm-btn-approve:disabled { opacity: 0.6; cursor: default; }
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
          padding: 14px 12px;
          border-bottom: 1px solid var(--wm-border, #E7EBF1);
          color: var(--wm-ink, #0F172A);
          vertical-align: top;
        }
        .wm-table tbody tr:last-child td { border-bottom: none; }
        @media (max-width: 991px) {
          .wm-page { margin-left: 0; padding: 90px 16px 24px; }
        }
      `}</style>
    </>
  );
}

export default PendingApprovals;
