import { useEffect, useRef, useState } from "react";
import api from "../api/api";
import html2pdf from "html2pdf.js";
import Sidebar from "../components/layout/Sidebar";
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
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  DropletFill,
  CurrencyRupee,
  PeopleFill,
  Calculator,
  FileEarmarkPdfFill,
  FileEarmarkSpreadsheetFill,
  LifePreserver,
  CalendarRange,
} from "react-bootstrap-icons";

const BAR_COLORS = [
  "#14B8A6",
  "#0EA5E9",
  "#6366F1",
  "#F59E0B",
  "#EC4899",
  "#22C55E",
  "#EF4444",
  "#8B5CF6",
];

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

function CommunityReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exportingPdf, setExportingPdf] = useState(false);

  const reportRef = useRef(null);

  const loadReport = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/community/reports/overview");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load report:", err);
      setError("Failed to load the report.");
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
        filename: `Community-Report-${new Date().toISOString().slice(0, 10)}.pdf`,
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
        "Flat / Household",
        "Total Litres Used (All Time)",
        "Total Revenue Billed (₹)",
      ],
    ];
    data.residentBreakdown.forEach((r) => {
      const rev = data.residentRevenueBreakdown.find(
        (x) => x.label === r.label,
      );
      rows.push([
        r.label,
        r.litres.toFixed(2),
        rev ? rev.litres.toFixed(2) : "0.00",
      ]);
    });
    downloadCSV("resident-usage-and-revenue.csv", rows);
  };

  return (
    <>
      <Sidebar />
      <TopNavbar
        title="Reports"
        subtitle="All-time usage, revenue, and ticket overview for your community"
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
                  icon={PeopleFill}
                  label="Total Residents"
                  value={data.totalResidents}
                  tone="accent"
                />
              </div>
              <div className="col-md-3">
                <StatCard
                  icon={DropletFill}
                  label="Total Usage (All Time)"
                  value={`${data.totalUsageLitres.toFixed(0)} L`}
                  tone="warn"
                />
              </div>
              <div className="col-md-3">
                <StatCard
                  icon={CurrencyRupee}
                  label="Total Revenue Billed"
                  value={`₹${data.totalRevenueInr.toFixed(0)}`}
                  tone="success"
                />
              </div>
              <div className="col-md-3">
                <StatCard
                  icon={Calculator}
                  label="Avg. Usage / Household"
                  value={`${data.averageUsagePerHouseholdLitres.toFixed(0)} L`}
                  tone="accent"
                />
              </div>
            </div>

            {/* Usage trend */}
            <div className="wm-card mb-3">
              <h6 className="wm-card-title mb-1">Usage Trend</h6>
              <p className="wm-muted-text mb-3">
                Total community litres used, by month
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
                      dataKey="litres"
                      stroke="#0EA5E9"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="row g-3 mb-3">
              {/* Revenue trend */}
              <div className="col-md-7">
                <div className="wm-card h-100">
                  <h6 className="wm-card-title mb-1">
                    Revenue by Billing Cycle
                  </h6>
                  <p className="wm-muted-text mb-3">
                    Total billed per finalized cycle
                  </p>
                  {!data.revenueTrend || data.revenueTrend.length === 0 ? (
                    <p className="wm-muted-text">
                      No billing cycles finalized yet.
                    </p>
                  ) : (
                    <ResponsiveContainer width="100%" height={230}>
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
                        <Bar
                          dataKey="totalInr"
                          fill="#14B8A6"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Water purchase by source */}
              <div className="col-md-5">
                <div className="wm-card h-100">
                  <h6 className="wm-card-title mb-1">
                    Water Purchases by Source
                  </h6>
                  <p className="wm-muted-text mb-3">
                    Total ₹{data.totalWaterPurchaseCostInr.toFixed(0)} spent
                    all-time
                  </p>
                  {!data.purchaseBySource ||
                  data.purchaseBySource.length === 0 ? (
                    <p className="wm-muted-text">
                      No water purchases logged yet.
                    </p>
                  ) : (
                    <div className="table-responsive">
                      <table className="wm-table">
                        <thead>
                          <tr>
                            <th>Source</th>
                            <th>Volume</th>
                            <th>Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.purchaseBySource.map((s, i) => (
                            <tr key={i}>
                              <td>
                                <span className="wm-badge wm-badge-neutral">
                                  {s.source}
                                </span>
                              </td>
                              <td>{s.totalVolumeLitres.toLocaleString()} L</td>
                              <td>₹{s.totalCostInr.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Billing cycle detail table */}
            <div className="wm-card mb-3">
              <div className="d-flex align-items-center gap-2 mb-1">
                <CalendarRange size={16} color="var(--wm-accent-dark)" />
                <h6 className="wm-card-title mb-0">Billing Cycle Detail</h6>
              </div>
              <p className="wm-muted-text mb-3">
                Every billing cycle created for your community
              </p>
              {!data.cycleDetails || data.cycleDetails.length === 0 ? (
                <p className="wm-muted-text">No billing cycles created yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="wm-table">
                    <thead>
                      <tr>
                        <th>Period</th>
                        <th>Dates</th>
                        <th>Status</th>
                        <th>Residents Billed</th>
                        <th>Total Billed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.cycleDetails.map((c, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600 }}>{c.periodLabel}</td>
                          <td>
                            {c.startDate} – {c.endDate}
                          </td>
                          <td>
                            <span
                              className={`wm-badge wm-badge-${c.status.toLowerCase()}`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td>{c.residentCount}</td>
                          <td>₹{c.totalBilledInr.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Ticket resolution summary */}
            <div className="wm-card mb-3">
              <div className="d-flex align-items-center gap-2 mb-3">
                <LifePreserver size={16} color="var(--wm-accent-dark)" />
                <h6 className="wm-card-title mb-0">
                  Ticket Resolution Summary
                </h6>
              </div>
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="wm-ticket-tile">
                    <span className="wm-badge wm-badge-open">Open</span>
                    <span className="wm-ticket-count">{data.openTickets}</span>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="wm-ticket-tile">
                    <span className="wm-badge wm-badge-finalized">
                      In Progress
                    </span>
                    <span className="wm-ticket-count">
                      {data.inProgressTickets}
                    </span>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="wm-ticket-tile">
                    <span className="wm-badge wm-badge-archived">Resolved</span>
                    <span className="wm-ticket-count">
                      {data.resolvedTickets}
                    </span>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="wm-ticket-tile">
                    <span className="wm-badge wm-badge-neutral">Escalated</span>
                    <span className="wm-ticket-count">
                      {data.escalatedTickets}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resident usage breakdown */}
            <div className="wm-card mb-3">
              <h6 className="wm-card-title mb-1">Resident Usage Breakdown</h6>
              <p className="wm-muted-text mb-3">
                All-time total litres used, per household
              </p>
              {!data.residentBreakdown ||
              data.residentBreakdown.length === 0 ? (
                <p className="wm-muted-text">No usage data logged yet.</p>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={Math.max(220, data.residentBreakdown.length * 34)}
                >
                  <BarChart
                    data={data.residentBreakdown}
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
                      dataKey="label"
                      tick={{ fontSize: 11 }}
                      width={90}
                    />
                    <Tooltip
                      formatter={(v) => [`${v.toFixed(0)} L`, "Usage"]}
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    />
                    <Bar dataKey="litres" radius={[0, 6, 6, 0]}>
                      {data.residentBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={BAR_COLORS[index % BAR_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Resident revenue breakdown */}
            <div className="wm-card">
              <h6 className="wm-card-title mb-1">Resident Revenue Breakdown</h6>
              <p className="wm-muted-text mb-3">
                All-time total billed, per household
              </p>
              {!data.residentRevenueBreakdown ||
              data.residentRevenueBreakdown.length === 0 ? (
                <p className="wm-muted-text">No invoices generated yet.</p>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={Math.max(
                    220,
                    data.residentRevenueBreakdown.length * 34,
                  )}
                >
                  <BarChart
                    data={data.residentRevenueBreakdown}
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
                      dataKey="label"
                      tick={{ fontSize: 11 }}
                      width={90}
                    />
                    <Tooltip
                      formatter={(v) => [`₹${v.toFixed(0)}`, "Revenue"]}
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    />
                    <Bar dataKey="litres" radius={[0, 6, 6, 0]} fill="#14B8A6">
                      {data.residentRevenueBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={BAR_COLORS[(index + 3) % BAR_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
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

export default CommunityReports;
