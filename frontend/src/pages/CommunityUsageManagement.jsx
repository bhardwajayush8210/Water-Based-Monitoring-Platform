import { useEffect, useState, useRef } from "react";
import api from "../api/api";
import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";
import StatCard from "../components/layout/StatCard";
import { HorizontalBarChartMini } from "../components/MiniCharts";
import {
  DropletFill,
  CheckCircleFill,
  Upload,
  CloudArrowUpFill,
  PeopleFill,
  ClockHistory,
  LockFill,
} from "react-bootstrap-icons";

const todayStr = new Date().toISOString().slice(0, 10);

function initials(name) {
  return (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

function CommunityUsageManagement() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [drafts, setDrafts] = useState({});
  const [savingUser, setSavingUser] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const loadSummary = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/usage/community/summary");
      setResidents(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load residents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const handleDraftChange = (username, value) => {
    setDrafts({ ...drafts, [username]: value });
  };

  const handleSave = async (username) => {
    const litres = drafts[username];
    if (!litres) return;

    setSavingUser(username);
    try {
      await api.post(`/usage/community/${username}`, {
        date: todayStr,
        litresUsed: parseFloat(litres),
      });
      setDrafts({ ...drafts, [username]: "" });
      loadSummary();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save usage.");
    } finally {
      setSavingUser(null);
    }
  };

  const processCsvFile = async (file) => {
    if (!file) return;

    const text = await file.text();
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const rows = lines.filter((line) => {
      const [first] = line.split(",");
      return first && first.toLowerCase() !== "username";
    });

    if (rows.length === 0) {
      setUploadResult({
        ok: 0,
        failed: 0,
        error: "No valid rows found in file.",
      });
      return;
    }

    setUploading(true);
    setUploadResult(null);

    let ok = 0;
    let failed = 0;
    const failedRows = [];

    for (const line of rows) {
      const [rawUsername, rawLitres] = line.split(",").map((s) => s?.trim());
      const litresUsed = parseFloat(rawLitres);

      if (!rawUsername || Number.isNaN(litresUsed)) {
        failed++;
        failedRows.push(line);
        continue;
      }

      try {
        await api.post(`/usage/community/${rawUsername}`, {
          date: todayStr,
          litresUsed,
        });
        ok++;
      } catch (err) {
        failed++;
        failedRows.push(
          `${rawUsername} (${err.response?.data?.message || "failed"})`,
        );
      }
    }

    setUploading(false);
    setUploadResult({ ok, failed, failedRows });
    loadSummary();
  };

  const handleCsvUpload = (e) => {
    processCsvFile(e.target.files[0]);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processCsvFile(file);
  };

  const loggedCount = residents.filter((r) => r.todayLitres !== null).length;
  const pendingCount = residents.length - loggedCount;
  const loggedResidents = residents.filter((r) => r.todayLitres !== null);

  return (
    <>
      <Sidebar />
      <TopNavbar
        title="Water Usage"
        subtitle="Log today's meter readings for your residents"
      />

      <div className="wm-page">
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <StatCard
              icon={PeopleFill}
              label="Total Residents"
              value={String(residents.length)}
              tone="accent"
            />
          </div>
          <div className="col-md-4">
            <StatCard
              icon={CheckCircleFill}
              label="Logged Today"
              value={String(loggedCount)}
              percent={
                residents.length ? (loggedCount / residents.length) * 100 : 0
              }
              tone="success"
            />
          </div>
          <div className="col-md-4">
            <StatCard
              icon={ClockHistory}
              label="Pending Today"
              value={String(pendingCount)}
              tone="warn"
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-lg-5">
            <div className="wm-card h-100">
              <h6 className="wm-card-title mb-1">Bulk Upload</h6>
              <p className="wm-muted-text mb-3">
                CSV format: <code>username,litres</code> per line
              </p>

              <div
                className={`wm-dropzone ${dragActive ? "wm-dropzone-active" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
              >
                <div className="wm-dropzone-icon">
                  <CloudArrowUpFill size={26} />
                </div>
                <p className="wm-dropzone-text">
                  {uploading
                    ? "Uploading..."
                    : "Drag & drop a CSV, or click to browse"}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleCsvUpload}
                  disabled={uploading}
                  hidden
                />
              </div>

              {uploadResult && (
                <div className="wm-upload-result">
                  <p
                    className="mb-1"
                    style={{ color: "var(--wm-success)", fontWeight: 600 }}
                  >
                    {uploadResult.ok} reading{uploadResult.ok !== 1 ? "s" : ""}{" "}
                    saved
                  </p>
                  {uploadResult.failed > 0 && (
                    <>
                      <p
                        className="mb-1"
                        style={{ color: "var(--wm-danger)", fontWeight: 600 }}
                      >
                        {uploadResult.failed} row
                        {uploadResult.failed !== 1 ? "s" : ""} failed
                      </p>
                      <ul className="wm-fail-list">
                        {uploadResult.failedRows?.slice(0, 4).map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-7">
            <div className="wm-card h-100">
              <h6 className="wm-card-title mb-1">Today's Readings</h6>
              <p className="wm-muted-text mb-3">
                Residents logged so far today
              </p>
              {loggedResidents.length === 0 ? (
                <div className="wm-chart-empty">
                  <DropletFill size={26} color="#c7d0d9" />
                  <p className="wm-muted-text mt-2 mb-0">
                    No readings logged yet today
                  </p>
                </div>
              ) : (
                <HorizontalBarChartMini
                  data={loggedResidents.map((r) => ({
                    label: r.fullName,
                    value: r.todayLitres,
                  }))}
                  color="#14B8A6"
                  height={Math.max(loggedResidents.length * 34, 100)}
                  unit="L"
                />
              )}
            </div>
          </div>
        </div>

        <div className="wm-card">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <DropletFill size={17} color="var(--wm-accent-dark)" />
              <h6 className="wm-card-title mb-0">All Residents</h6>
            </div>
            <span className="wm-badge wm-badge-accent">
              {residents.length} residents
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
              <button className="wm-btn-outline" onClick={loadSummary}>
                Retry
              </button>
            </div>
          ) : residents.length === 0 ? (
            <div className="text-center py-5">
              <DropletFill size={32} color="#c7d0d9" />
              <p className="wm-muted-text mt-3 mb-0">
                No residents in your community yet.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="wm-table">
                <thead>
                  <tr>
                    <th>Resident</th>
                    <th>Flat</th>
                    <th>Today's Reading</th>
                    <th>Log New Reading (L)</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {residents.map((r) => {
                    const logged = r.todayLitres !== null;
                    return (
                      <tr
                        key={r.username}
                        className={logged ? "wm-row-logged" : "wm-row-pending"}
                      >
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="wm-avatar-sm">
                              {initials(r.fullName)}
                            </div>
                            <span style={{ fontWeight: 500 }}>
                              {r.fullName}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="wm-badge wm-badge-neutral">
                            {r.flatNumber || "—"}
                          </span>
                        </td>
                        <td>
                          {logged ? (
                            <span className="wm-logged-value">
                              <CheckCircleFill size={12} className="me-1" />
                              {r.todayLitres} L
                            </span>
                          ) : (
                            <span className="wm-muted-text">
                              Not logged yet
                            </span>
                          )}
                        </td>
                        <td style={{ width: 160 }}>
                          {logged ? (
                            <span className="wm-locked-note">
                              <LockFill size={11} className="me-1" />
                              Locked for today
                            </span>
                          ) : (
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              className="wm-inline-input"
                              placeholder="e.g. 220"
                              value={drafts[r.username] || ""}
                              onChange={(e) =>
                                handleDraftChange(r.username, e.target.value)
                              }
                            />
                          )}
                        </td>
                        <td>
                          {!logged && (
                            <button
                              className="wm-btn-primary-sm"
                              disabled={
                                !drafts[r.username] || savingUser === r.username
                              }
                              onClick={() => handleSave(r.username)}
                            >
                              {savingUser === r.username ? "Saving..." : "Save"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
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
        .wm-muted-text code {
          background: var(--wm-bg, #F6F8FB);
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 12px;
        }
        .wm-dropzone {
          border: 2px dashed var(--wm-border, #E7EBF1);
          border-radius: 14px;
          padding: 30px 16px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .wm-dropzone:hover, .wm-dropzone-active {
          border-color: var(--wm-accent);
          background: var(--wm-accent-soft);
        }
        .wm-dropzone-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: var(--wm-accent-soft);
          color: var(--wm-accent-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
        }
        .wm-dropzone-text {
          font-size: 13px;
          font-weight: 500;
          color: var(--wm-ink, #0F172A);
          margin: 0;
        }
        .wm-upload-result {
          margin-top: 14px;
          padding: 12px 14px;
          background: var(--wm-bg, #F6F8FB);
          border-radius: 10px;
          font-size: 13px;
        }
        .wm-fail-list {
          margin: 4px 0 0;
          padding-left: 18px;
          color: var(--wm-danger);
          font-size: 12px;
        }
        .wm-chart-empty {
          text-align: center;
          padding: 30px 0;
        }
        .wm-badge { font-size: 11.5px; font-weight: 600; padding: 4px 10px; border-radius: 999px; }
        .wm-badge-accent { background: var(--wm-accent-soft); color: var(--wm-accent-dark); }
        .wm-badge-neutral { background: #eef1f5; color: #414d5c; }
        .wm-logged-value {
          color: var(--wm-success, #22C55E);
          font-weight: 600;
          font-size: 13.5px;
        }
        .wm-locked-note {
          display: inline-flex;
          align-items: center;
          font-size: 12.5px;
          color: var(--wm-muted, #64748B);
          font-style: italic;
        }
        .wm-avatar-sm {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--wm-accent-soft);
          color: var(--wm-accent-dark);
          font-family: var(--wm-font-mono, 'JetBrains Mono', monospace);
          font-size: 11.5px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
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
        .wm-table tbody tr { border-left: 3px solid transparent; transition: background 0.15s ease; }
        .wm-table tbody tr.wm-row-logged { border-left-color: var(--wm-success); }
        .wm-table tbody tr.wm-row-pending { border-left-color: var(--wm-warn); }
        .wm-table tbody tr:hover { background: var(--wm-bg, #F6F8FB); }
        .wm-inline-input {
          border: 1px solid var(--wm-border, #E7EBF1);
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 13px;
          width: 100%;
          height: 36px;
        }
        .wm-inline-input:focus { outline: none; border-color: var(--wm-accent); }
        .wm-btn-primary-sm {
          background: var(--wm-accent);
          color: #fff;
          border: none;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }
        .wm-btn-primary-sm:disabled { opacity: 0.5; cursor: default; }
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
        @media (max-width: 991px) {
          .wm-page { margin-left: 0; padding: 90px 16px 24px; }
        }
      `}</style>
    </>
  );
}

export default CommunityUsageManagement;
