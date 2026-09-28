import { useEffect, useRef, useState } from "react";
import api from "../api/api";
import html2pdf from "html2pdf.js";
import AdminSidebar from "../components/layout/AdminSidebar";
import TopNavbar from "../components/layout/TopNavbar";
import StatCard from "../components/layout/StatCard";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  PeopleFill,
  DropletFill,
  CurrencyRupee,
  Building,
  FileEarmarkPdfFill,
  FileEarmarkSpreadsheetFill,
  LifePreserver,
  HourglassSplit,
} from "react-bootstrap-icons";

function downloadCSV(filename, rows) {
  const csvContent = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function AdminReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exportingPdf, setExportingPdf] = useState(false);

  const reportRef = useRef(null);

  const loadReport = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/reports/overview");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load platform report:", err);
      setError("Failed to load the platform report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const handleDownloadPdf = () => {
    setExportingPdf(true);
    html2pdf()
      .set({
        margin: 10,
        filename: `Platform-Report-${new Date().toISOString().slice(0, 10)}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(reportRef.current)
      .save()
      .then(() => setExportingPdf(false));
  };

  const handleDownloadCsv = () => {
    if (!data) return;
    const rows = [
      [
        "Community",
        "Residents",
        "Total Usage (L)",
        "Total Revenue (₹)",
        "Water Purchase Cost (₹)",
      ],
    ];
    data.communityBreakdown.forEach((c) =>
      rows.push([
        c.apartmentName,
        c.residentCount,
        c.totalUsageLitres.toFixed(2),
        c.totalRevenueInr.toFixed(2),
        c.totalWaterPurchaseCostInr.toFixed(2),
      ]),
    );
    downloadCSV("community-comparison.csv", rows);
  };

  return (
    <>
      <AdminSidebar />
      <TopNavbar
        title="Platform Reports"
        subtitle="System-wide usage, revenue, and community comparison"
      />

      <div className="wm-page">
        <div className="d-flex align-items-center justify-content-end gap-2 mb-3">
          <button
            className="wm-btn-outline"
            onClick={handleDownloadCsv}
            disabled={!data}
          >
            <FileEarmarkSpreadsheetFill size={13} className="me-2" />
            Export CSV
          </button>
          <button
            className="wm-btn-primary"
            onClick={handleDownloadPdf}
            disabled={!data || exportingPdf}
          >
            <FileEarmarkPdfFill size={13} className="me-2" />
            {exportingPdf ? "Generating..." : "Download PDF"}
          </button>
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
          <div className="wm-card text-center py-5">
            <p className="wm-muted-text mb-3">{error}</p>
            <button className="wm-btn-outline" onClick={loadReport}>
              Retry
            </button>
          </div>
        ) : (
          <div ref={reportRef}>
            {/* Summary stat cards */}
            <div className="row g-3 mb-3">
              <div className="col-md-3">
                <StatCard
                  icon={Building}
                  label="Total Communities"
                  value={data.totalCommunities}
                  tone="accent"
                />
              </div>
              <div className="col-md-3">
                <StatCard
                  icon={PeopleFill}
                  label="Total Residents"
                  value={data.totalResidents}
                  tone="warn"
                />
              </div>
              <div className="col-md-3">
                <StatCard
                  icon={CurrencyRupee}
                  label="Platform Revenue"
                  value={`₹${data.totalRevenueInr.toFixed(0)}`}
                  tone="success"
                />
              </div>
              <div className="col-md-3">
                <StatCard
                  icon={DropletFill}
                  label="Platform Usage"
                  value={`${data.totalUsageLitres.toFixed(0)} L`}
                  tone="accent"
                />
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <StatCard
                  icon={HourglassSplit}
                  label="Pending Community Admin Approvals"
                  value={data.pendingApprovals}
                  tone="warn"
                />
              </div>
              <div className="col-md-4">
                <StatCard
                  icon={CurrencyRupee}
                  label="Water Purchase Cost (All Communities)"
                  value={`₹${data.totalWaterPurchaseCostInr.toFixed(0)}`}
                  tone="accent"
                />
              </div>
              <div className="col-md-4">
                <StatCard
                  icon={PeopleFill}
                  label="Community Admins"
                  value={data.totalCommunityAdmins}
                  tone="success"
                />
              </div>
            </div>

            {/* Usage trend */}
            <div className="wm-card mb-3">
              <h6 className="wm-card-title mb-1">Platform Usage Trend</h6>
              <p className="wm-muted-text mb-3">
                Total litres used across all communities, by month
              </p>
              {!data.usageTrend || data.usageTrend.length === 0 ? (
                <p className="wm-muted-text">No usage data logged yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart
                    data={data.usageTrend}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E7EBF1"
                    />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(v) => [`${v.toFixed(0)} L`, "Usage"]}
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#0EA5E9"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Revenue trend */}
            <div className="wm-card mb-3">
              <h6 className="wm-card-title mb-1">Platform Revenue Trend</h6>
              <p className="wm-muted-text mb-3">
                Total billed across all communities, by month
              </p>
              {!data.revenueTrend || data.revenueTrend.length === 0 ? (
                <p className="wm-muted-text">
                  No finalized billing cycles yet.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={data.revenueTrend}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E7EBF1"
                    />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(v) => [`₹${v.toFixed(0)}`, "Revenue"]}
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    />
                    <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Ticket queue */}
            <div className="wm-card mb-3">
              <div className="d-flex align-items-center gap-2 mb-3">
                <LifePreserver size={16} color="var(--wm-accent-dark)" />
                <h6 className="wm-card-title mb-0">Super Admin Ticket Queue</h6>
              </div>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="wm-ticket-tile">
                    <span className="wm-badge wm-badge-open">Open</span>
                    <span className="wm-ticket-count">{data.openTickets}</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="wm-ticket-tile">
                    <span className="wm-badge wm-badge-neutral">Escalated</span>
                    <span className="wm-ticket-count">
                      {data.escalatedTickets}
                    </span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="wm-ticket-tile">
                    <span className="wm-badge wm-badge-archived">Resolved</span>
                    <span className="wm-ticket-count">
                      {data.resolvedTickets}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Community comparison */}
            <div className="wm-card mb-3">
              <h6 className="wm-card-title mb-1">
                Community Comparison — Usage
              </h6>
              <p className="wm-muted-text mb-3">
                Total litres used, all-time, by community
              </p>
              {!data.communityBreakdown ||
              data.communityBreakdown.length === 0 ? (
                <p className="wm-muted-text">No communities registered yet.</p>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={Math.max(220, data.communityBreakdown.length * 40)}
                >
                  <BarChart
                    data={data.communityBreakdown}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="#E7EBF1"
                    />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="apartmentName"
                      tick={{ fontSize: 11 }}
                      width={130}
                    />
                    <Tooltip
                      formatter={(v) => [`${v.toFixed(0)} L`, "Usage"]}
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    />
                    <Bar
                      dataKey="totalUsageLitres"
                      fill="#0EA5E9"
                      radius={[0, 6, 6, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="wm-card mb-3">
              <h6 className="wm-card-title mb-1">
                Community Comparison — Revenue vs Water Purchase Cost
              </h6>
              <p className="wm-muted-text mb-3">
                All-time totals, by community
              </p>
              {!data.communityBreakdown ||
              data.communityBreakdown.length === 0 ? (
                <p className="wm-muted-text">No communities registered yet.</p>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={Math.max(240, data.communityBreakdown.length * 48)}
                >
                  <BarChart
                    data={data.communityBreakdown}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="#E7EBF1"
                    />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="apartmentName"
                      tick={{ fontSize: 11 }}
                      width={130}
                    />
                    <Tooltip
                      formatter={(v) => [`₹${v.toFixed(0)}`, ""]}
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar
                      dataKey="totalRevenueInr"
                      name="Revenue"
                      fill="#14B8A6"
                      radius={[0, 6, 6, 0]}
                    />
                    <Bar
                      dataKey="totalWaterPurchaseCostInr"
                      name="Purchase Cost"
                      fill="#F59E0B"
                      radius={[0, 6, 6, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Community table */}
            <div className="wm-card">
              <h6 className="wm-card-title mb-3">Community Breakdown Table</h6>
              <div className="table-responsive">
                <table className="wm-table">
                  <thead>
                    <tr>
                      <th>Community</th>
                      <th>Residents</th>
                      <th>Usage (L)</th>
                      <th>Revenue (₹)</th>
                      <th>Purchase Cost (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.communityBreakdown.map((c, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{c.apartmentName}</td>
                        <td>{c.residentCount}</td>
                        <td>{c.totalUsageLitres.toLocaleString()}</td>
                        <td>₹{c.totalRevenueInr.toLocaleString()}</td>
                        <td>₹{c.totalWaterPurchaseCostInr.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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
          padding: 22px;
        }
        .wm-card-title {
          font-family: var(--wm-font-display, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: 15px;
          color: var(--wm-ink, #0F172A);
        }
        .wm-muted-text { color: var(--wm-muted, #64748B); font-size: 13px; margin: 0; }
        .wm-btn-primary {
          display: inline-flex;
          align-items: center;
          background: var(--wm-accent);
          color: #fff;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
        }
        .wm-btn-primary:hover { background: var(--wm-accent-dark); }
        .wm-btn-primary:disabled { opacity: 0.6; cursor: default; }
        .wm-btn-outline {
          display: inline-flex;
          align-items: center;
          border: 1px solid var(--wm-accent);
          color: var(--wm-accent-dark);
          background: #fff;
          padding: 9px 15px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
        }
        .wm-btn-outline:disabled { opacity: 0.5; cursor: default; }
        .wm-badge {
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 11.5px;
          font-weight: 600;
        }
        .wm-badge-open { background: #E3FBF6; color: #0D9488; }
        .wm-badge-finalized { background: #FEF3E2; color: #B45309; }
        .wm-badge-archived { background: #eef2ff; color: #4F46E5; }
        .wm-badge-neutral { background: #eef1f5; color: #414d5c; }
        .wm-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .wm-table td, .wm-table th { padding: 10px 12px; border-bottom: 1px solid #eee; text-align: left; }
        .wm-table thead th {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          color: var(--wm-muted, #64748B);
          font-weight: 500;
        }
        .wm-ticket-tile {
          background: #F8FAFC;
          border: 1px solid var(--wm-border, #E7EBF1);
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .wm-ticket-count {
          font-size: 22px;
          font-weight: 700;
          color: var(--wm-ink, #0F172A);
        }
        @media (max-width: 991px) {
          .wm-page { margin-left: 0; padding: 90px 16px 24px; }
        }
      `}</style>
    </>
  );
}

export default AdminReports;
