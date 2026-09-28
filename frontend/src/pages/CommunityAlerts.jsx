import { useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";
import {
  ExclamationTriangleFill,
  PersonCircle,
  GearFill,
  Radar,
  GraphUpArrow,
} from "react-bootstrap-icons";

function CommunityAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [threshold, setThreshold] = useState("");
  const [savingThreshold, setSavingThreshold] = useState(false);
  const [thresholdMessage, setThresholdMessage] = useState("");

  const [persisted, setPersisted] = useState([]);
  const [loadingPersisted, setLoadingPersisted] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState("");

  const loadAlerts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/community/alerts");
      setAlerts(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load alerts.");
    } finally {
      setLoading(false);
    }
  };

  const loadThreshold = async () => {
    try {
      const res = await api.get("/community/alert-threshold");
      setThreshold(String(res.data.dailyAlertThresholdLitres));
    } catch (err) {
      console.error(err);
    }
  };

  const loadPersisted = async () => {
    setLoadingPersisted(true);
    try {
      const res = await api.get("/community/alerts/persisted");
      setPersisted(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPersisted(false);
    }
  };

  const handleScanNow = async () => {
    setScanning(true);
    setScanMessage("");
    try {
      await api.post("/community/alerts/scan-now");
      setScanMessage("Scan complete - checked threshold breaches and unusual spikes.");
      loadPersisted();
    } catch (err) {
      console.error(err);
      setScanMessage(err.response?.data?.message || "Scan failed.");
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    loadAlerts();
    loadThreshold();
    loadPersisted();
  }, []);

  const handleSaveThreshold = async (e) => {
    e.preventDefault();
    setSavingThreshold(true);
    setThresholdMessage("");
    try {
      await api.put("/community/alert-threshold", {
        dailyAlertThresholdLitres: parseFloat(threshold),
      });
      setThresholdMessage("Alert threshold updated.");
      loadAlerts();
    } catch (err) {
      console.error(err);
      setThresholdMessage(err.response?.data?.message || "Failed to update threshold.");
    } finally {
      setSavingThreshold(false);
    }
  };

  const dangerCount = alerts.filter((a) => a.severity === "DANGER").length;
  const warningCount = alerts.filter((a) => a.severity === "WARNING").length;

  return (
    <>
      <Sidebar />
      <TopNavbar title="Alerts" subtitle="Residents whose usage crossed the daily threshold" />

      <div className="wm-page">
        <div className="wm-card mb-3">
          <div className="d-flex align-items-center gap-2 mb-3">
            <GearFill size={16} color="var(--wm-accent-dark)" />
            <h6 className="wm-card-title mb-0">Alert Threshold</h6>
          </div>
          <p className="wm-muted-text mb-3">
            Any resident whose usage on a single day exceeds this value will be flagged below.
          </p>

          <form onSubmit={handleSaveThreshold}>
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="wm-label">Daily Threshold (litres)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  className="wm-input-plain"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <button className="wm-btn-primary w-100" disabled={savingThreshold}>
                  {savingThreshold ? "Saving..." : "Save Threshold"}
                </button>
              </div>
            </div>
          </form>

          {thresholdMessage && (
            <p className="mt-2 mb-0" style={{ fontSize: 13, color: "var(--wm-success)" }}>
              {thresholdMessage}
            </p>
          )}
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <div className="wm-mini-stat wm-mini-danger">
              <span className="wm-mini-value">{dangerCount}</span>
              <span className="wm-mini-label">High severity (1.5x threshold)</span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="wm-mini-stat wm-mini-warn">
              <span className="wm-mini-value">{warningCount}</span>
              <span className="wm-mini-label">Over threshold</span>
            </div>
          </div>
        </div>

        <div className="wm-card">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <ExclamationTriangleFill size={16} color="var(--wm-warn)" />
              <h6 className="wm-card-title mb-0">Recent Alerts (last 7 days)</h6>
            </div>
            <span className="wm-badge wm-badge-accent">{alerts.length} alerts</span>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: "var(--wm-accent)" }} role="status" />
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <p style={{ color: "var(--wm-danger)", fontSize: 14 }}>{error}</p>
              <button className="wm-btn-outline" onClick={loadAlerts}>Retry</button>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-5">
              <ExclamationTriangleFill size={28} color="#c7d0d9" />
              <p className="wm-muted-text mt-3 mb-0">No alerts in the last 7 days. Everything looks normal.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="wm-table">
                <thead>
                  <tr>
                    <th>Resident</th>
                    <th>Flat</th>
                    <th>Date</th>
                    <th>Usage</th>
                    <th>Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((a, i) => (
                    <tr key={i}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <PersonCircle size={22} color="#c7d0d9" />
                          <span style={{ fontWeight: 500 }}>{a.fullName}</span>
                        </div>
                      </td>
                      <td><span className="wm-badge wm-badge-neutral">{a.flatNumber || "—"}</span></td>
                      <td className="wm-muted-text">{a.date}</td>
                      <td style={{ fontWeight: 600 }}>{a.litresUsed} L</td>
                      <td>
                        <span className={`wm-badge ${a.severity === "DANGER" ? "wm-badge-danger" : "wm-badge-warn"}`}>
                          {a.severity === "DANGER" ? "High" : "Warning"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="wm-card mb-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <Radar size={16} color="var(--wm-accent-dark)" />
              <h6 className="wm-card-title mb-0">Automated Scan</h6>
            </div>
            <button className="wm-btn-primary" onClick={handleScanNow} disabled={scanning}>
              {scanning ? "Scanning..." : "Scan Now"}
            </button>
          </div>
          <p className="wm-muted-text mb-0">
            Runs automatically every hour. Checks for threshold breaches and statistically unusual
            spikes (usage more than 2 standard deviations above a resident's own average) - flagged
            spikes are marked "Possible Leak" since a sudden jump for one specific resident often
            means a leak rather than normal use.
          </p>
          {scanMessage && (
            <p className="mt-2 mb-0" style={{ fontSize: 13, color: "var(--wm-success)" }}>{scanMessage}</p>
          )}
        </div>

        <div className="wm-card mb-3">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <GraphUpArrow size={16} color="var(--wm-danger)" />
              <h6 className="wm-card-title mb-0">Detected Alerts (threshold + possible leaks)</h6>
            </div>
            <span className="wm-badge wm-badge-accent">{persisted.length}</span>
          </div>

          {loadingPersisted ? (
            <div className="text-center py-4">
              <div className="spinner-border" style={{ color: "var(--wm-accent)" }} role="status" />
            </div>
          ) : persisted.length === 0 ? (
            <p className="wm-muted-text text-center py-3 mb-0">
              No alerts yet. Click "Scan Now" above, or wait for the next hourly scan.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="wm-table">
                <thead>
                  <tr>
                    <th>Resident</th>
                    <th>Flat</th>
                    <th>Date</th>
                    <th>Usage</th>
                    <th>Type</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {persisted.map((a) => (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 500 }}>{a.fullName}</td>
                      <td><span className="wm-badge wm-badge-neutral">{a.flatNumber || "—"}</span></td>
                      <td className="wm-muted-text">{a.date}</td>
                      <td style={{ fontWeight: 600 }}>{a.litresUsed} L</td>
                      <td>
                        <span className={`wm-badge ${a.alertType === "OUTLIER" ? "wm-badge-danger" : "wm-badge-warn"}`}>
                          {a.alertType === "OUTLIER" ? "Possible Leak" : "Over Threshold"}
                        </span>
                      </td>
                      <td className="wm-muted-text" style={{ fontSize: 12 }}>{a.message}</td>
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
        .wm-muted-text { color: var(--wm-muted, #64748B); font-size: 13px; }
        .wm-label {
          font-size: 12px;
          color: var(--wm-muted, #64748B);
          display: block;
          margin-bottom: 6px;
        }
        .wm-input-plain {
          border: 1px solid var(--wm-border, #E7EBF1);
          border-radius: 8px;
          padding: 0 12px;
          height: 42px;
          width: 100%;
          font-size: 13.5px;
        }
        .wm-btn-primary {
          background: var(--wm-accent);
          color: #fff;
          border: none;
          height: 42px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13.5px;
          cursor: pointer;
        }
        .wm-btn-primary:hover { background: var(--wm-accent-dark); }
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
        .wm-mini-stat {
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
        }
        .wm-mini-danger { background: var(--wm-danger-soft, #FDECEC); }
        .wm-mini-warn { background: var(--wm-warn-soft, #FEF3E2); }
        .wm-mini-value {
          font-family: var(--wm-font-mono, 'JetBrains Mono', monospace);
          font-weight: 600;
          font-size: 24px;
          color: var(--wm-ink, #0F172A);
        }
        .wm-mini-label {
          font-size: 12px;
          color: var(--wm-muted, #64748B);
          margin-top: 2px;
        }
        .wm-badge { font-size: 11.5px; font-weight: 600; padding: 4px 10px; border-radius: 999px; }
        .wm-badge-accent { background: var(--wm-accent-soft); color: var(--wm-accent-dark); }
        .wm-badge-neutral { background: #eef1f5; color: #414d5c; }
        .wm-badge-warn { background: var(--wm-warn-soft, #FEF3E2); color: #B45309; }
        .wm-badge-danger { background: var(--wm-danger-soft, #FDECEC); color: #B91C1C; }
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
        @media (max-width: 991px) {
          .wm-page { margin-left: 0; padding: 90px 16px 24px; }
        }
      `}</style>
    </>
  );
}

export default CommunityAlerts;