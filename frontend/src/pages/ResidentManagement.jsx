import { useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";
import {
  PeopleFill,
  TelephoneFill,
  TrashFill,
  PersonCircle,
  Speedometer2,
  PencilFill,
} from "react-bootstrap-icons";

function ResidentManagement({ endpoint = "/community/residents" }) {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Meter assignment is only editable from the Community Admin's own
  // scoped view - Super Admin's unscoped view (/auth/residents) doesn't
  // have a single apartment to validate ownership against.
  const canEditMeter = endpoint === "/community/residents";

  const [editingMeterId, setEditingMeterId] = useState(null);
  const [meterDraft, setMeterDraft] = useState("");
  const [savingMeter, setSavingMeter] = useState(false);
  const [autoAssigning, setAutoAssigning] = useState(false);

  const hasUnassignedMeters = residents.some((r) => !r.meterNumber);

  const handleAutoAssignMeters = async () => {
    setAutoAssigning(true);
    try {
      const res = await api.post("/community/residents/auto-assign-meters");
      alert(
        `Assigned placeholder meter numbers to ${res.data.assignedCount} resident(s). You can edit any of these to the real meter number.`,
      );
      loadResidents();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to auto-assign meters.");
    } finally {
      setAutoAssigning(false);
    }
  };

  const loadResidents = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get(endpoint);
      setResidents(res.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to load residents. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResidents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const deleteResident = async (id) => {
    if (!window.confirm("Delete Resident?")) return;

    try {
      await api.delete(`/auth/residents/${id}`);
      loadResidents();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete resident");
    }
  };

  const startEditMeter = (resident) => {
    setEditingMeterId(resident.id);
    setMeterDraft(resident.meterNumber || "");
  };

  const saveMeter = async (residentId) => {
    setSavingMeter(true);
    try {
      await api.put(`/community/residents/${residentId}/meter-number`, {
        meterNumber: meterDraft,
      });
      setEditingMeterId(null);
      loadResidents();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save meter number.");
    } finally {
      setSavingMeter(false);
    }
  };

  return (
    <>
      <Sidebar />
      <TopNavbar
        title="Residents"
        subtitle="Manage residents in your community"
      />

      <div className="wm-page">
        <div className="wm-card">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <PeopleFill size={17} color="var(--wm-accent-dark)" />
              <h6 className="wm-card-title mb-0">All Residents</h6>
            </div>
            <div className="d-flex align-items-center gap-2">
              {canEditMeter && hasUnassignedMeters && (
                <button
                  className="wm-btn-outline"
                  onClick={handleAutoAssignMeters}
                  disabled={autoAssigning}
                >
                  <Speedometer2 size={11} className="me-1" />
                  {autoAssigning
                    ? "Assigning..."
                    : "Auto-assign missing meters"}
                </button>
              )}
              <span className="wm-badge wm-badge-accent">
                {residents.length} total
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                style={{ color: "var(--wm-accent)" }}
                role="status"
              />
              <p className="wm-muted-text mt-3 mb-0">Loading residents...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <p
                className="mb-2"
                style={{ color: "var(--wm-danger)", fontSize: 14 }}
              >
                {error}
              </p>
              <button className="wm-btn-outline" onClick={loadResidents}>
                Retry
              </button>
            </div>
          ) : residents.length === 0 ? (
            <div className="text-center py-5">
              <PeopleFill size={32} color="#c7d0d9" />
              <p className="wm-muted-text mt-3 mb-0">
                No residents registered yet.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="wm-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Apartment</th>
                    <th>Flat</th>
                    <th>Meter No.</th>
                    <th>Phone</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {residents.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <PersonCircle size={24} color="#c7d0d9" />
                          <span style={{ fontWeight: 500 }}>{r.fullName}</span>
                        </div>
                      </td>
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
                      <td>
                        {editingMeterId === r.id ? (
                          <div className="d-flex align-items-center gap-1">
                            <input
                              type="text"
                              className="wm-mini-input"
                              placeholder="e.g. MTR-102"
                              value={meterDraft}
                              onChange={(e) => setMeterDraft(e.target.value)}
                              autoFocus
                            />
                            <button
                              className="wm-btn-primary-sm"
                              disabled={savingMeter}
                              onClick={() => saveMeter(r.id)}
                            >
                              {savingMeter ? "..." : "Save"}
                            </button>
                            <button
                              className="wm-btn-cancel-sm"
                              onClick={() => setEditingMeterId(null)}
                            >
                              ✕
                            </button>
                          </div>
                        ) : r.meterNumber ? (
                          <span className="wm-badge wm-badge-meter">
                            <Speedometer2 size={10} className="me-1" />
                            {r.meterNumber}
                          </span>
                        ) : canEditMeter ? (
                          <button
                            className="wm-assign-link"
                            onClick={() => startEditMeter(r)}
                          >
                            + Assign
                          </button>
                        ) : (
                          <span className="wm-muted-text">Not assigned</span>
                        )}

                        {canEditMeter &&
                          r.meterNumber &&
                          editingMeterId !== r.id && (
                            <button
                              className="wm-edit-icon-btn"
                              onClick={() => startEditMeter(r)}
                            >
                              <PencilFill size={10} />
                            </button>
                          )}
                      </td>
                      <td className="wm-muted-text">
                        <TelephoneFill size={11} className="me-1" />
                        {r.phone}
                      </td>
                      <td className="text-end">
                        <button
                          className="wm-btn-danger-outline"
                          onClick={() => deleteResident(r.id)}
                        >
                          <TrashFill size={12} />
                          Delete
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
        .wm-muted-text { color: var(--wm-muted, #64748B); font-size: 13.5px; }
        .wm-badge {
          font-size: 11.5px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 999px;
        }
        .wm-badge-accent { background: var(--wm-accent-soft); color: var(--wm-accent-dark); }
        .wm-badge-neutral { background: #eef1f5; color: #414d5c; }
        .wm-badge-meter {
          display: inline-flex;
          align-items: center;
          background: #ECEDFD;
          color: #4F46E5;
          font-family: var(--wm-font-mono, 'JetBrains Mono', monospace);
        }
        .wm-assign-link {
          background: none;
          border: none;
          color: var(--wm-accent-dark);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }
        .wm-assign-link:hover { text-decoration: underline; }
        .wm-edit-icon-btn {
          background: none;
          border: none;
          color: var(--wm-muted, #64748B);
          padding: 0;
          margin-left: 6px;
          cursor: pointer;
        }
        .wm-edit-icon-btn:hover { color: var(--wm-accent-dark); }
        .wm-mini-input {
          border: 1px solid var(--wm-border, #E7EBF1);
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 12px;
          width: 110px;
          height: 30px;
        }
        .wm-btn-primary-sm {
          background: var(--wm-accent);
          color: #fff;
          border: none;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
        }
        .wm-btn-cancel-sm {
          background: none;
          border: none;
          color: var(--wm-muted, #64748B);
          font-size: 13px;
          cursor: pointer;
          padding: 0 4px;
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
        .wm-table tbody tr:last-child td { border-bottom: none; }
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
        .wm-btn-danger-outline {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid var(--wm-danger);
          color: var(--wm-danger);
          background: #fff;
          padding: 5px 12px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .wm-btn-danger-outline:hover { background: var(--wm-danger-soft); }
        @media (max-width: 991px) {
          .wm-page { margin-left: 0; padding: 90px 16px 24px; }
        }
      `}</style>
    </>
  );
}

export default ResidentManagement;
