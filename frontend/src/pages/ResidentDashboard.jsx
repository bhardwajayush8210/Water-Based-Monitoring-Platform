import { useEffect, useState, Fragment } from "react";
import api from "../api/api";
import html2pdf from "html2pdf.js";
import ResidentSidebar from "../components/layout/ResidentSidebar";
import TopNavbar from "../components/layout/TopNavbar";
import StatCard from "../components/layout/StatCard";
import { AreaChartMini, BarChartMini } from "../components/MiniCharts";
import PayBill from "../components/PayBill";
import ConsumptionComparison from "../components/ConsumptionComparison";
import WaterTips from "../components/WaterTips";
import Profile from "../components/Profile";
import {
  DropletFill,
  ReceiptCutoff,
  ExclamationTriangleFill,
  InfoCircleFill,
  GraphUpArrow,
  ClockHistory,
  BellFill,
  CheckCircleFill,
  CreditCardFill,
  ChevronDown,
  ChevronUp,
  LifePreserver,
} from "react-bootstrap-icons";

const pageTitles = {
  dashboard: ["Dashboard", "Your water usage at a glance"],
  usage: ["My Usage", "Readings entered by your Community Admin"],
  history: ["Usage History", "Every reading entered for your flat"],
  bills: ["My Bills", "Current month's bill breakdown"],
  notifications: ["Notifications", "Usage alerts flagged for your flat"],
  invoices: ["My Invoices", "Downloadable record of your current bill"],
  tickets: [
    "Support & Concerns",
    "Submit tickets to Admins based on issue type",
  ],
  tips: ["Water-Saving Tips", "Simple habits to lower your usage and bill"],
  profile: ["My Profile", "View and update your account details"],
};

function formatDayLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });
}
function formatDateLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

export default function ResidentDashboard() {
  const [active, setActive] = useState("dashboard");

  const [entries, setEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [bill, setBill] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const todayStr = new Date().toISOString().slice(0, 10);

  const loadBill = async () => {
    try {
      const res = await api.get("/billing/my");
      setBill(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAlerts = async () => {
    try {
      const res = await api.get("/alerts/my");
      setAlerts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const loadNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const res = await api.get("/notifications/my");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Support Tickets State
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setCategory] = useState("METER_LEAK");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketPriority, setTicketPriority] = useState("MEDIUM"); // ADD THIS LINE

  const [submittingTicket, setSubmittingTicket] = useState(false);

  const loadTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await api.get("/tickets/my");
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to load tickets:", err);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setSubmittingTicket(true);
    try {
      await api.post("/tickets", {
        subject: ticketSubject,
        category: ticketCategory,
        description: ticketDescription,
        priority: ticketPriority,
      });
      setTicketSubject("");
      setTicketDescription("");
      setTicketPriority("MEDIUM"); // ADD THIS LINE (resets dropdown after submit)

      alert("✅ Concern raised successfully!");
      loadTickets();
    } catch (err) {
      console.error(err);
      alert("Failed to submit support ticket.");
    } finally {
      setSubmittingTicket(false);
    }
  };

  // Invoices & Payment tracking
  const [pastInvoices, setPastInvoices] = useState([]);
  const [loadingPastInvoices, setLoadingPastInvoices] = useState(true);
  const [expandedInvoiceId, setExpandedInvoiceId] = useState(null);

  const paidStorageKey = `paidInvoices:${localStorage.getItem("username")}`;
  const [paidInvoiceIds, setPaidInvoiceIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(paidStorageKey) || "[]");
    } catch {
      return [];
    }
  });
  const [openPayInvoiceId, setOpenPayInvoiceId] = useState(null);

  const markInvoicePaid = (invoiceId) => {
    const updated = [...paidInvoiceIds, invoiceId];
    setPaidInvoiceIds(updated);
    localStorage.setItem(paidStorageKey, JSON.stringify(updated));
    setOpenPayInvoiceId(null);

    const email = localStorage.getItem("email") || "resident@gmail.com";

    setTimeout(() => {
      alert(
        `✅ Payment Successful!

Invoice No : INV-${invoiceId}
Status : PAID

Invoice has been sent to:
${email}

(This is a demo notification.)`,
      );
    }, 300);
  };

  const loadPastInvoices = async () => {
    setLoadingPastInvoices(true);
    try {
      const res = await api.get("/invoices/my");
      setPastInvoices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPastInvoices(false);
    }
  };

  const downloadInvoice = () => {
    const invoice = document.getElementById("invoice-content");

    html2pdf()
      .set({
        margin: 10,
        filename: `Water-Invoice-${bill.periodLabel}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(invoice)
      .save();
  };

  const loadEntries = async () => {
    setLoadingEntries(true);
    setLoadError("");
    try {
      const res = await api.get("/usage/my");
      setEntries(res.data);
    } catch (err) {
      console.error(err);
      setLoadError("Failed to load your usage history.");
    } finally {
      setLoadingEntries(false);
    }
  };

  useEffect(() => {
    loadEntries();
    loadBill();
    loadAlerts();
    loadNotifications();
    loadPastInvoices();
    loadTickets();
  }, []);

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );
  const last7 = sortedEntries.slice(-7);
  const last30 = sortedEntries.slice(-30);

  const weeklyUsage = last7.map((e) => ({
    label: formatDayLabel(e.date),
    value: e.litresUsed,
  }));
  const monthlyConsumption = last30.map((e) => ({
    label: formatDateLabel(e.date),
    value: e.litresUsed,
  }));

  const todayEntry = entries.find((e) => e.date === todayStr);
  const weeklyAverage =
    last7.length > 0
      ? last7.reduce((s, e) => s + e.litresUsed, 0) / last7.length
      : null;
  const percentVsAverage =
    todayEntry && weeklyAverage
      ? Math.round(
          ((todayEntry.litresUsed - weeklyAverage) / weeklyAverage) * 100,
        )
      : null;

  const usageGaugePercent = todayEntry
    ? Math.min((todayEntry.litresUsed / 300) * 100, 100)
    : 0;

  const avgUsage =
    entries.length > 0
      ? entries.reduce((s, e) => s + e.litresUsed, 0) / entries.length
      : null;
  const highestEntry =
    entries.length > 0
      ? entries.reduce(
          (max, e) => (e.litresUsed > max.litresUsed ? e : max),
          entries[0],
        )
      : null;
  const latestEntry =
    sortedEntries.length > 0 ? sortedEntries[sortedEntries.length - 1] : null;

  const [title, subtitle] = pageTitles[active] || ["Water Billing", ""];

  const downloadPastInvoice = (inv) => {
    const totalLitres = inv.litresUsed || 0;
    const threshold =
      inv.tier1ThresholdLitres || bill?.tier1ThresholdLitres || 1500;
    const tier1Rate = inv.tier1RateInr ?? bill?.tier1RateInr ?? 1;
    const tier2Rate = inv.tier2RateInr ?? bill?.tier2RateInr ?? 3;

    const tier1Litres = Math.min(totalLitres, threshold);
    const tier2Litres = Math.max(0, totalLitres - threshold);

    const tier1Amount = tier1Litres * tier1Rate;
    const tier2Amount = tier2Litres * tier2Rate;

    const meterNo =
      inv.meterNumber ||
      inv.meterNo ||
      bill?.meterNumber ||
      bill?.meterNo ||
      "Not Assigned";

    const invoice = `
      <div style="padding:30px;font-family:Arial, sans-serif;color:#0F172A;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #0EA5E9;padding-bottom:12px;margin-bottom:20px;">
          <div>
            <h2 style="margin:0;color:#0EA5E9;font-size:22px;">WATER BILLING SYSTEM</h2>
            <p style="margin:4px 0 0;font-size:12px;color:#64748B;">Official Tax Invoice & Usage Statement</p>
          </div>
          <div style="text-align:right;">
            <h3 style="margin:0;font-size:16px;">INVOICE #INV-${inv.id}</h3>
            <p style="margin:4px 0 0;font-size:12px;color:#64748B;">Date: ${new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <table style="width:100%;font-size:13px;border-collapse:collapse;margin-bottom:20px;background:#F8FAFC;padding:12px;border-radius:6px;">
          <tr>
            <td style="padding:6px;"><b>Resident:</b> ${localStorage.getItem("username") || "N/A"}</td>
            <td style="padding:6px;"><b>Billing Period:</b> ${inv.periodLabel}</td>
          </tr>
          <tr>
            <td style="padding:6px;"><b>Meter No:</b> ${meterNo}</td>
            <td style="padding:6px;"><b>Total Usage:</b> ${totalLitres.toFixed(1)} L</td>
          </tr>
          <tr>
            <td style="padding:6px;"><b>Payment Status:</b> <span style="color:${paidInvoiceIds.includes(inv.id) ? "#16A34A" : "#DC2626"};font-weight:bold;">${paidInvoiceIds.includes(inv.id) ? "PAID" : "UNPAID"}</span></td>
            <td style="padding:6px;"></td>
          </tr>
        </table>

        <h4 style="margin:16px 0 8px;color:#0EA5E9;border-bottom:1px solid #E2E8F0;padding-bottom:4px;">Itemized Tier Breakdown</h4>
        <table style="width:100%;font-size:13px;border-collapse:collapse;margin-bottom:20px;">
          <thead>
            <tr style="background:#F1F5F9;text-align:left;">
              <th style="padding:8px;border-bottom:1px solid #CBD5E1;">Tier Level</th>
              <th style="padding:8px;border-bottom:1px solid #CBD5E1;">Volume Range</th>
              <th style="padding:8px;border-bottom:1px solid #CBD5E1;text-align:right;">Billed Volume</th>
              <th style="padding:8px;border-bottom:1px solid #CBD5E1;text-align:right;">Rate / Litre</th>
              <th style="padding:8px;border-bottom:1px solid #CBD5E1;text-align:right;">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #E2E8F0;"><b>Tier 1</b> (Base Rate)</td>
              <td style="padding:8px;border-bottom:1px solid #E2E8F0;color:#64748B;">Up to ${threshold.toLocaleString()} L</td>
              <td style="padding:8px;border-bottom:1px solid #E2E8F0;text-align:right;">${tier1Litres.toFixed(1)} L</td>
              <td style="padding:8px;border-bottom:1px solid #E2E8F0;text-align:right;">₹${tier1Rate}</td>
              <td style="padding:8px;border-bottom:1px solid #E2E8F0;text-align:right;">₹${tier1Amount.toFixed(2)}</td>
            </tr>
            ${
              tier2Litres > 0
                ? `
            <tr>
              <td style="padding:8px;border-bottom:1px solid #E2E8F0;"><b>Tier 2</b> (Higher Rate)</td>
              <td style="padding:8px;border-bottom:1px solid #E2E8F0;color:#64748B;">Above ${threshold.toLocaleString()} L</td>
              <td style="padding:8px;border-bottom:1px solid #E2E8F0;text-align:right;">${tier2Litres.toFixed(1)} L</td>
              <td style="padding:8px;border-bottom:1px solid #E2E8F0;text-align:right;">₹${tier2Rate}</td>
              <td style="padding:8px;border-bottom:1px solid #E2E8F0;text-align:right;">₹${tier2Amount.toFixed(2)}</td>
            </tr>
            `
                : `
            <tr>
              <td style="padding:8px;border-bottom:1px solid #E2E8F0;color:#94A3B8;">Tier 2 (Higher Rate)</td>
              <td style="padding:8px;border-bottom:1px solid #E2E8F0;color:#94A3B8;">Above ${threshold.toLocaleString()} L</td>
              <td style="padding:8px;border-bottom:1px solid #E2E8F0;text-align:right;color:#94A3B8;">0.0 L</td>
              <td style="padding:8px;border-bottom:1px solid #E2E8F0;text-align:right;color:#94A3B8;">₹${tier2Rate}</td>
              <td style="padding:8px;border-bottom:1px solid #E2E8F0;text-align:right;color:#94A3B8;">₹0.00</td>
            </tr>
            `
            }
          </tbody>
        </table>

        <h4 style="margin:16px 0 8px;color:#0EA5E9;border-bottom:1px solid #E2E8F0;padding-bottom:4px;">Billing Summary</h4>
        <table style="width:100%;font-size:13px;border-collapse:collapse;margin-bottom:20px;">
          <tr>
            <td style="padding:6px 8px;border-bottom:1px solid #E2E8F0;"><b>Base Usage Charge</b> (Tier 1 + Tier 2)</td>
            <td style="padding:6px 8px;border-bottom:1px solid #E2E8F0;text-align:right;">₹${inv.baseChargeInr.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding:6px 8px;border-bottom:1px solid #E2E8F0;"><b>Shared Area Allocation</b></td>
            <td style="padding:6px 8px;border-bottom:1px solid #E2E8F0;text-align:right;">₹${inv.sharedAreaAllocationInr.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding:6px 8px;border-bottom:1px solid #E2E8F0;">
              <b>Adjustments</b> 
              ${inv.adjustmentReason ? `<span style="font-size:11px;color:#64748B;">(${inv.adjustmentReason})</span>` : ""}
            </td>
            <td style="padding:6px 8px;border-bottom:1px solid #E2E8F0;text-align:right;">₹${inv.adjustmentInr.toFixed(2)}</td>
          </tr>
          <tr style="font-size:15px;background:#F8FAFC;">
            <td style="padding:10px 8px;border-top:2px solid #0F172A;"><b>Total Payable Amount</b></td>
            <td style="padding:10px 8px;border-top:2px solid #0F172A;text-align:right;"><b>₹${inv.totalInr.toFixed(2)}</b></td>
          </tr>
        </table>

        <div style="margin-top:30px;padding-top:12px;border-top:1px solid #CBD5E1;text-align:center;font-size:11px;color:#64748B;">
          <p style="margin:0;">Thank you for conserving water! If you have questions regarding this invoice, please contact your Community Admin.</p>
          <p style="margin:4px 0 0;">Automated System Generated Invoice — Water Billing Management System</p>
        </div>
      </div>
    `;

    html2pdf()
      .set({
        margin: 10,
        filename: `Invoice-${inv.periodLabel}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(invoice)
      .save();
  };

  return (
    <>
      <ResidentSidebar active={active} setActive={setActive} />
      <TopNavbar title={title} subtitle={subtitle} />

      <div className="wm-page">
        {active === "dashboard" && (
          <>
            <div className="row g-3">
              <div className="col-md-6">
                <StatCard
                  icon={DropletFill}
                  label="Today's Usage"
                  value={
                    todayEntry ? `${todayEntry.litresUsed} L` : "Not logged yet"
                  }
                  percent={todayEntry ? usageGaugePercent : null}
                  tone="accent"
                />
              </div>
              <div className="col-md-6">
                <StatCard
                  icon={ReceiptCutoff}
                  label={`Current Bill (${bill?.periodLabel || "This Month"})`}
                  value={bill ? `₹${bill.billAmount.toFixed(2)}` : "—"}
                  tone="warn"
                />
              </div>
            </div>

            {bill && !bill.tariffConfigured && (
              <p className="wm-vs-average" style={{ color: "var(--wm-warn)" }}>
                Your Community Admin hasn't set a water rate yet - this bill
                will show ₹0 until they do.
              </p>
            )}

            {percentVsAverage !== null && (
              <p className="wm-vs-average">
                {percentVsAverage <= 0 ? "▼" : "▲"} {Math.abs(percentVsAverage)}
                % {percentVsAverage <= 0 ? "below" : "above"} your weekly
                average
              </p>
            )}

            <div className="wm-card mt-3">
              <h6 className="wm-card-title">Monthly Consumption</h6>
              <p className="wm-card-subtitle">
                Readings entered by your Community Admin
              </p>
              {monthlyConsumption.length === 0 ? (
                <p className="wm-empty-note">
                  No usage logged yet by your Community Admin.
                </p>
              ) : (
                <AreaChartMini
                  data={monthlyConsumption}
                  color="#0EA5E9"
                  height={230}
                />
              )}
            </div>

            <div className="wm-card mt-3">
              <h6 className="wm-card-title">Weekly Usage</h6>
              <p className="wm-card-subtitle">
                Litres used, last 7 logged days
              </p>
              {weeklyUsage.length === 0 ? (
                <p className="wm-empty-note">No usage logged yet.</p>
              ) : (
                <BarChartMini data={weeklyUsage} color="#0EA5E9" height={200} />
              )}
            </div>

            <div className="wm-card mt-3">
              <h6 className="wm-card-title mb-3">Recent Alerts</h6>
              {alerts.length === 0 ? (
                <p className="wm-empty-note mb-0">
                  No usage alerts in the last 7 days.
                </p>
              ) : (
                <div className="wm-alert-list">
                  {alerts.map((a, i) => (
                    <div
                      key={i}
                      className={`wm-alert-item wm-alert-${a.severity === "DANGER" ? "danger" : "warn"}`}
                    >
                      <ExclamationTriangleFill size={13} />
                      <span className="flex-grow-1">
                        {a.litresUsed} L used on {a.date} — over your{" "}
                        {a.thresholdLitres} L threshold
                      </span>
                      <span className="wm-alert-time">{a.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {active === "usage" && (
          <>
            <div className="wm-info-banner mb-3">
              <InfoCircleFill size={16} />
              <span>
                Usage readings are entered by your Community Admin, not by you.
                This shows your current status - for the full record, see Usage
                History.
              </span>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <StatCard
                  icon={DropletFill}
                  label="Today's Usage"
                  value={
                    todayEntry ? `${todayEntry.litresUsed} L` : "Not logged"
                  }
                  percent={todayEntry ? usageGaugePercent : null}
                  tone="accent"
                />
              </div>
              <div className="col-md-4">
                <StatCard
                  icon={GraphUpArrow}
                  label="Average Daily Usage"
                  value={avgUsage !== null ? `${avgUsage.toFixed(0)} L` : "—"}
                  tone="warn"
                />
              </div>
              <div className="col-md-4">
                <StatCard
                  icon={ClockHistory}
                  label="Latest Entry"
                  value={latestEntry ? formatDateLabel(latestEntry.date) : "—"}
                  tone="success"
                />
              </div>
            </div>

            <div className="wm-card">
              <h6 className="wm-card-title">This Week</h6>
              <p className="wm-card-subtitle">
                Litres logged over the last 7 days
              </p>
              {weeklyUsage.length === 0 ? (
                <p className="wm-empty-note">
                  No usage logged yet by your Community Admin.
                </p>
              ) : (
                <BarChartMini data={weeklyUsage} color="#0EA5E9" height={220} />
              )}
            </div>

            <ConsumptionComparison />
          </>
        )}

        {active === "history" && (
          <>
            <div className="wm-info-banner mb-3">
              <InfoCircleFill size={16} />
              <span>
                The complete record of every reading your Community Admin has
                logged for your flat.
              </span>
            </div>

            <div className="wm-card mb-3">
              <h6 className="wm-card-title">Consumption Trend</h6>
              <p className="wm-card-subtitle">
                Every reading your Community Admin has logged
              </p>
              {monthlyConsumption.length === 0 ? (
                <p className="wm-empty-note">
                  No usage logged yet by your Community Admin.
                </p>
              ) : (
                <AreaChartMini
                  data={monthlyConsumption}
                  color="#0EA5E9"
                  height={240}
                />
              )}
              {highestEntry && (
                <p className="wm-history-highlight">
                  Highest single-day reading:{" "}
                  <strong>{highestEntry.litresUsed} L</strong> on{" "}
                  {formatDateLabel(highestEntry.date)}
                </p>
              )}
            </div>

            <div className="wm-card">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="wm-card-title mb-0">Full History</h6>
                <span className="wm-badge wm-badge-accent">
                  {entries.length} entries
                </span>
              </div>

              {loadingEntries ? (
                <div className="text-center py-4">
                  <div
                    className="spinner-border"
                    style={{ color: "var(--wm-accent)" }}
                    role="status"
                  />
                </div>
              ) : loadError ? (
                <div className="text-center py-4">
                  <p style={{ color: "var(--wm-danger)", fontSize: 14 }}>
                    {loadError}
                  </p>
                  <button className="wm-btn-outline" onClick={loadEntries}>
                    Retry
                  </button>
                </div>
              ) : entries.length === 0 ? (
                <p className="wm-empty-note text-center py-3">
                  No usage has been logged for you yet. Ask your Community Admin
                  to add a reading.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="wm-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Litres Used</th>
                        <th>Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...entries]
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((e, idx, arr) => {
                          const prev = arr[idx + 1];
                          const delta = prev
                            ? e.litresUsed - prev.litresUsed
                            : null;
                          return (
                            <tr key={e.id}>
                              <td style={{ fontWeight: 500 }}>
                                {formatDateLabel(e.date)}
                              </td>
                              <td>{e.litresUsed} L</td>
                              <td>
                                {delta === null ? (
                                  <span className="wm-muted-text">—</span>
                                ) : (
                                  <span
                                    className={
                                      delta > 0
                                        ? "wm-delta-up"
                                        : delta < 0
                                          ? "wm-delta-down"
                                          : "wm-muted-text"
                                    }
                                  >
                                    {delta > 0 ? "▲" : delta < 0 ? "▼" : "•"}{" "}
                                    {Math.abs(delta).toFixed(1)} L
                                  </span>
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
          </>
        )}

        {active === "bills" && (
          <>
            {!bill ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border"
                  style={{ color: "var(--wm-accent)" }}
                  role="status"
                />
              </div>
            ) : (
              <>
                <div className="wm-bill-hero">
                  <div className="wm-bill-hero-top">
                    <span>{bill.periodLabel}</span>
                    <span className="wm-bill-badge">
                      {bill.tariffConfigured
                        ? "Rate configured"
                        : "Rate not set"}
                    </span>
                  </div>
                  <h2 className="wm-bill-amount">
                    ₹{bill.billAmount.toFixed(2)}
                  </h2>
                  <p className="wm-bill-usage">
                    {bill.totalLitres.toFixed(1)} L used this month
                  </p>
                </div>

                {!bill.tariffConfigured ? (
                  <div className="wm-card mt-3 text-center py-4">
                    <p className="wm-empty-note mb-0">
                      Your Community Admin hasn't set a water rate yet. Your
                      bill will show ₹0 until they configure one.
                    </p>
                  </div>
                ) : (
                  (() => {
                    const tier1Litres = Math.min(
                      bill.totalLitres,
                      bill.tier1ThresholdLitres,
                    );
                    const tier2Litres = Math.max(
                      0,
                      bill.totalLitres - bill.tier1ThresholdLitres,
                    );
                    const tier1Amount = tier1Litres * bill.tier1RateInr;
                    const tier2Amount = tier2Litres * bill.tier2RateInr;

                    return (
                      <div className="wm-card mt-3">
                        <h6 className="wm-card-title mb-1">Bill Breakdown</h6>
                        <p className="wm-card-subtitle">
                          Tiered rate — usage up to{" "}
                          {bill.tier1ThresholdLitres.toLocaleString()} L is
                          charged at the base rate; anything beyond that at the
                          higher rate.
                        </p>

                        <div className="table-responsive">
                          <table className="wm-linetable">
                            <thead>
                              <tr>
                                <th>Description</th>
                                <th className="text-end">Volume</th>
                                <th className="text-end">Rate</th>
                                <th className="text-end">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  Tier 1
                                  <span className="wm-linetable-sub">
                                    Up to{" "}
                                    {bill.tier1ThresholdLitres.toLocaleString()}{" "}
                                    L
                                  </span>
                                </td>
                                <td className="text-end">
                                  {tier1Litres.toFixed(1)} L
                                </td>
                                <td className="text-end">
                                  ₹{bill.tier1RateInr}/L
                                </td>
                                <td className="text-end wm-linetable-amount">
                                  {tier1Litres.toFixed(1)} × ₹
                                  {bill.tier1RateInr} = ₹
                                  {tier1Amount.toFixed(2)}
                                </td>
                              </tr>
                              {tier2Litres > 0 && (
                                <tr>
                                  <td>
                                    Tier 2
                                    <span className="wm-linetable-sub">
                                      Beyond threshold
                                    </span>
                                  </td>
                                  <td className="text-end">
                                    {tier2Litres.toFixed(1)} L
                                  </td>
                                  <td className="text-end">
                                    ₹{bill.tier2RateInr}/L
                                  </td>
                                  <td className="text-end wm-linetable-amount">
                                    {tier2Litres.toFixed(1)} × ₹
                                    {bill.tier2RateInr} = ₹
                                    {tier2Amount.toFixed(2)}
                                  </td>
                                </tr>
                              )}
                            </tbody>
                            <tfoot>
                              <tr className="wm-linetable-total">
                                <td colSpan={3}>Total Bill</td>
                                <td className="text-end">
                                  ₹{bill.billAmount.toFixed(2)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    );
                  })()
                )}
              </>
            )}
          </>
        )}

        {active === "invoices" && (
          <>
            {loadingPastInvoices ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border"
                  style={{ color: "var(--wm-accent)" }}
                  role="status"
                />
              </div>
            ) : (
              <div id="invoice-content" className="wm-invoice-card">
                <div className="wm-invoice-header">
                  <div>
                    <h5 className="wm-invoice-title">Water Usage Invoice</h5>
                    <p className="wm-invoice-sub">{bill.periodLabel}</p>
                  </div>
                  <button className="wm-btn-outline" onClick={downloadInvoice}>
                    Download Invoice PDF
                  </button>
                </div>
                <div className="wm-invoice-row">
                  <span>Billed To</span>
                  <span style={{ fontWeight: 600 }}>
                    {localStorage.getItem("username")}
                  </span>
                </div>
                <div className="wm-invoice-row">
                  <span>Billing Period</span>
                  <span>{bill.periodLabel}</span>
                </div>
                <div className="wm-invoice-row">
                  <span>Total Usage</span>
                  <span>{bill.totalLitres.toFixed(1)} L</span>
                </div>
                <div className="wm-invoice-row">
                  <span>Meter Number</span>
                  <span>
                    {bill.meterNumber || bill.meterNo || "Not Assigned"}
                  </span>
                </div>
                <div className="wm-invoice-row">
                  <span>Resident</span>
                  <span>{localStorage.getItem("username")}</span>
                </div>
                <div className="wm-invoice-row">
                  <span>Invoice Date</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="wm-invoice-row">
                  <span>Status</span>
                  <span>Unpaid</span>
                </div>
                <div className="wm-invoice-row">
                  <span>Base Charge</span>
                  <span>₹{bill.billAmount.toFixed(2)}</span>
                </div>
                <div className="wm-invoice-row">
                  <span>Shared Area</span>
                  <span>₹{(bill.sharedAreaAllocationInr || 0).toFixed(2)}</span>
                </div>
                <div className="wm-invoice-row">
                  <span>Adjustment</span>
                  <span>
                    ₹{(bill.adjustmentInr || 0).toFixed(2)}{" "}
                    {bill.adjustmentReason && (
                      <small> ({bill.adjustmentReason})</small>
                    )}
                  </span>
                </div>
                <div className="wm-invoice-total-row">
                  <span>Total Due</span>
                  <span>₹{bill.billAmount.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="wm-card mt-3">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="wm-card-title mb-0">Past Invoices</h6>
                <span className="wm-badge wm-badge-accent">
                  {pastInvoices.length}
                </span>
              </div>

              {loadingPastInvoices ? (
                <div className="text-center py-4">
                  <div
                    className="spinner-border"
                    style={{ color: "var(--wm-accent)" }}
                    role="status"
                  />
                </div>
              ) : pastInvoices.length === 0 ? (
                <p className="wm-empty-note text-center py-3 mb-0">
                  No finalized invoices yet.
                </p>
              ) : (
                <>
                  <div className="wm-sandbox-note">
                    <CreditCardFill size={13} className="me-2" />
                    Payments use PayPal Sandbox (test mode) - no real money is
                    charged. Paid status is stored in this browser only.
                  </div>

                  <div className="table-responsive">
                    <table className="wm-table">
                      <thead>
                        <tr>
                          <th>Period</th>
                          <th>Usage</th>
                          <th>Base Charge</th>
                          <th>Shared Allocation</th>
                          <th>Adjustment</th>
                          <th className="text-end">Total</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pastInvoices.map((inv) => {
                          const isPaid = paidInvoiceIds.includes(inv.id);
                          const isPayOpen = openPayInvoiceId === inv.id;
                          const isExpanded = expandedInvoiceId === inv.id;

                          return (
                            <Fragment key={inv.id}>
                              <tr>
                                <td style={{ fontWeight: 500 }}>
                                  <button
                                    className="btn btn-sm btn-link p-0 me-2 text-decoration-none"
                                    style={{ color: "var(--wm-ink)" }}
                                    onClick={() =>
                                      setExpandedInvoiceId(
                                        isExpanded ? null : inv.id,
                                      )
                                    }
                                  >
                                    {isExpanded ? (
                                      <ChevronUp size={14} />
                                    ) : (
                                      <ChevronDown size={14} />
                                    )}
                                  </button>
                                  {inv.periodLabel}
                                </td>
                                <td>{inv.litresUsed.toFixed(1)} L</td>
                                <td>₹{inv.baseChargeInr.toFixed(2)}</td>
                                <td>
                                  ₹{inv.sharedAreaAllocationInr.toFixed(2)}
                                </td>
                                <td>₹{inv.adjustmentInr.toFixed(2)}</td>
                                <td
                                  className="text-end"
                                  style={{ fontWeight: 600 }}
                                >
                                  ₹{inv.totalInr.toFixed(2)}
                                </td>
                                <td className="text-end">
                                  {isPaid ? (
                                    <span className="wm-badge wm-badge-success">
                                      <CheckCircleFill
                                        size={10}
                                        className="me-1"
                                      />
                                      Paid
                                    </span>
                                  ) : (
                                    <button
                                      className="wm-btn-primary-sm"
                                      onClick={() =>
                                        setOpenPayInvoiceId(
                                          isPayOpen ? null : inv.id,
                                        )
                                      }
                                    >
                                      {isPayOpen ? "Cancel" : "Pay Now"}
                                    </button>
                                  )}
                                </td>
                              </tr>

                              {isPayOpen && (
                                <tr>
                                  <td
                                    colSpan={7}
                                    style={{ background: "#F6F8FB" }}
                                  >
                                    <PayBill
                                      amount={inv.totalInr}
                                      onSuccess={() => markInvoicePaid(inv.id)}
                                    />
                                  </td>
                                </tr>
                              )}
                            </Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {active === "notifications" && (
          <div className="wm-card">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <BellFill size={16} color="var(--wm-accent-dark)" />
                <h6 className="wm-card-title mb-0">Notifications</h6>
              </div>
              <span className="wm-badge wm-badge-accent">
                {notifications.filter((n) => !n.isRead).length} unread
              </span>
            </div>

            {loadingNotifications ? (
              <div className="text-center py-4">
                <div
                  className="spinner-border"
                  style={{ color: "var(--wm-accent)" }}
                  role="status"
                />
              </div>
            ) : notifications.length === 0 ? (
              <p className="wm-empty-note text-center py-3 mb-0">
                No notifications yet.
              </p>
            ) : (
              <div className="wm-notif-list">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`wm-notif-item ${n.isRead ? "wm-notif-read" : ""}`}
                  >
                    <span
                      className={`wm-badge ${n.alertType === "OUTLIER" ? "wm-badge-danger" : "wm-badge-warn"}`}
                    >
                      {n.alertType === "OUTLIER"
                        ? "Possible Leak"
                        : "Threshold"}
                    </span>
                    <div className="flex-grow-1">
                      <p className="mb-0">{n.message}</p>
                      <span className="wm-notif-date">{n.date}</span>
                    </div>
                    {!n.isRead && (
                      <button
                        className="wm-mark-read-btn"
                        onClick={() => handleMarkRead(n.id)}
                      >
                        <CheckCircleFill size={12} className="me-1" />
                        Mark read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {active === "tickets" && (
          <div className="wm-card">
            <div className="d-flex align-items-center gap-2 mb-3">
              <LifePreserver size={18} color="var(--wm-accent-dark)" />
              <h6 className="wm-card-title mb-0">Raise a Concern / Support</h6>
            </div>

            <form onSubmit={handleCreateTicket} className="mb-4 p-3 style-form">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Category</label>
                  <select
                    className="form-select"
                    value={ticketCategory}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="METER_LEAK">
                      Meter Leak / Hardware Issue (Community Admin)
                    </option>
                    <option value="BILLING_DISCREPANCY">
                      Billing Discrepancy (Community Admin)
                    </option>
                    <option value="SYSTEM_BUG">
                      App Bug / Login Issue (Super Admin)
                    </option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Priority</label>
                  <select
                    className="form-select"
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value)}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="e.g. Water meter leaking near main valve"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    required
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    placeholder="Provide specific details about the issue..."
                  ></textarea>
                </div>
              </div>
              <button
                type="submit"
                className="wm-btn-primary-sm mt-3"
                disabled={submittingTicket}
              >
                {submittingTicket ? "Submitting..." : "Submit Concern"}
              </button>
            </form>

            <h6 className="wm-card-title mb-3">Your Support Tickets</h6>
            {loadingTickets ? (
              <div className="text-center py-4">
                <div
                  className="spinner-border"
                  style={{ color: "var(--wm-accent)" }}
                  role="status"
                />
              </div>
            ) : tickets.length === 0 ? (
              <p className="wm-empty-note text-center py-3 mb-0">
                You haven't raised any concerns yet.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="wm-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Subject & Description</th>
                      <th>Priority</th>
                      <th>Assigned To</th>
                      <th>Status</th>
                      <th>Admin Resolution / Notes</th>
                      <th>Submitted Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((t) => (
                      <tr key={t.id}>
                        <td style={{ fontWeight: 600 }}>#TCK-{t.id}</td>
                        <td>
                          <strong>{t.subject}</strong>
                          <br />
                          <small className="text-muted">{t.description}</small>
                        </td>
                        <td>
                          <span
                            className={`wm-badge ${
                              t.priority === "HIGH"
                                ? "wm-badge-danger"
                                : t.priority === "LOW"
                                  ? "wm-badge-neutral"
                                  : "wm-badge-warn"
                            }`}
                          >
                            {t.priority}
                          </span>
                        </td>
                        <td>
                          <span className="wm-badge wm-badge-accent">
                            {t.targetRole === "SUPER_ADMIN"
                              ? "Super Admin"
                              : "Community Admin"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`wm-badge ${
                              t.status === "RESOLVED"
                                ? "wm-badge-success"
                                : t.status === "ESCALATED"
                                  ? "wm-badge-danger"
                                  : "wm-badge-warn"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td>
                          {t.adminResponse ? (
                            <div className="wm-resident-reply-box">
                              💬 <b>Admin Reply:</b> {t.adminResponse}
                            </div>
                          ) : t.status === "ESCALATED" ? (
                            <div className="wm-resident-escalated-box">
                              ⚠️ Escalated to Super Admin for technical review.
                            </div>
                          ) : (
                            <span
                              className="text-muted"
                              style={{ fontSize: 12 }}
                            >
                              Awaiting admin reply...
                            </span>
                          )}
                        </td>
                        <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {active === "tips" && <WaterTips />}
        {active === "profile" && <Profile />}

        {active !== "dashboard" &&
          active !== "usage" &&
          active !== "history" &&
          active !== "bills" &&
          active !== "invoices" &&
          active !== "notifications" &&
          active !== "tickets" && (
            <div className="wm-card text-center py-5">
              <p className="wm-empty-note mb-0">
                This module isn't built yet — coming soon.
              </p>
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
        .wm-vs-average {
          font-size: 13px;
          color: var(--wm-muted, #64748B);
          margin: 10px 2px 0;
        }
        .wm-card {
          background: #fff;
          border: 1px solid var(--wm-border, #E7EBF1);
          border-radius: 16px;
          padding: 20px 22px;
        }
        .style-form {
          background: #F8FAFC;
          border: 1px solid var(--wm-border, #E7EBF1);
          border-radius: 12px;
        }
        .wm-info-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--wm-accent-soft);
          color: var(--wm-accent-dark);
          border: none;
          font-size: 13.5px;
          font-weight: 500;
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
        .wm-empty-note {
          font-size: 13px;
          color: var(--wm-muted, #64748B);
        }
        .wm-history-highlight {
          font-size: 12.5px;
          color: var(--wm-muted, #64748B);
          margin: 12px 0 0;
          padding-top: 12px;
          border-top: 1px dashed var(--wm-border, #E7EBF1);
        }
        .wm-history-highlight strong { color: var(--wm-accent-dark, #0D9488); }
        .wm-alert-list { display: flex; flex-direction: column; gap: 10px; }
        .wm-alert-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
        }
        .wm-alert-warn { background: var(--wm-warn-soft); color: #B45309; }
        .wm-alert-accent { background: var(--wm-accent-soft); color: var(--wm-accent-dark); }
        .wm-alert-danger { background: var(--wm-danger-soft); color: #B91C1C; }
        .wm-alert-time { font-size: 11.5px; color: var(--wm-muted, #64748B); font-weight: 400; }
        .wm-badge { font-size: 11.5px; font-weight: 600; padding: 4px 10px; border-radius: 999px; }
        .wm-badge-accent { background: var(--wm-accent-soft); color: var(--wm-accent-dark); }
        .wm-badge-success { background: var(--wm-success-soft, #E9F9EF); color: #15803D; }
        .wm-badge-warn { background: var(--wm-warn-soft, #FEF3C7); color: #B45309; }
        .wm-badge-danger { background: #FEE2E2; color: #991B1B; }
        .wm-badge-neutral { background: var(--wm-border, #E7EBF1); color: var(--wm-muted, #64748B); }
        .wm-resident-reply-box {
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 12.5px;
          color: #166534;
        }
        .wm-resident-escalated-box {
          background: #FEF2F2;
          border: 1px solid #FCA5A5;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 12.5px;
          color: #991B1B;
        }
        .wm-sandbox-note {
          display: flex;
          align-items: center;
          background: var(--wm-accent-soft);
          color: var(--wm-accent-dark);
          font-size: 12px;
          padding: 9px 14px;
          border-radius: 10px;
          margin-bottom: 14px;
        }
        .wm-btn-primary-sm {
          background: var(--wm-accent);
          color: #fff;
          border: none;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }
        .wm-btn-primary-sm:hover { background: var(--wm-accent-dark); }
        .wm-invoice-card {
          background: #fff;
          border: 1px solid var(--wm-border, #E7EBF1);
          border-radius: 16px;
          padding: 28px 30px;
          max-width: 640px;
        }
        .wm-linetable {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .wm-linetable thead th {
          text-align: left;
          font-weight: 500;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          color: var(--wm-muted, #64748B);
          padding: 0 8px 10px;
          border-bottom: 1px solid var(--wm-border, #E7EBF1);
        }
        .wm-linetable tbody td {
          padding: 12px 8px;
          border-bottom: 1px solid var(--wm-border, #E7EBF1);
          color: var(--wm-ink, #0F172A);
          vertical-align: top;
        }
        .wm-linetable-sub {
          display: block;
          font-size: 11.5px;
          color: var(--wm-muted, #64748B);
          font-weight: 400;
          margin-top: 2px;
        }
        .wm-linetable-amount {
          font-family: var(--wm-font-mono, 'JetBrains Mono', monospace);
          font-weight: 600;
          color: var(--wm-accent-dark, #0D9488);
          white-space: nowrap;
        }
        .wm-linetable-total td {
          padding: 14px 8px 4px;
          font-weight: 700;
          font-size: 14.5px;
          color: var(--wm-ink, #0F172A);
          border-bottom: none;
        }
        .wm-invoice-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding-bottom: 16px;
          margin-bottom: 12px;
          border-bottom: 2px solid var(--wm-ink, #0F172A);
        }
        .wm-invoice-title {
          font-family: var(--wm-font-display, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: 18px;
          color: var(--wm-ink, #0F172A);
          margin: 0;
        }
        .wm-invoice-sub {
          font-size: 12.5px;
          color: var(--wm-muted, #64748B);
          margin: 2px 0 0;
        }
        .wm-invoice-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 0;
          font-size: 13px;
          color: var(--wm-ink, #0F172A);
          border-bottom: 1px dashed var(--wm-border, #E7EBF1);
        }
        .wm-invoice-total-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0 6px;
          margin-top: 4px;
          font-family: var(--wm-font-mono, 'JetBrains Mono', monospace);
          font-weight: 700;
          font-size: 18px;
          color: var(--wm-ink, #0F172A);
        }
        .wm-bill-hero {
          background: linear-gradient(135deg, var(--wm-navy, #0B1C2C) 0%, #14283b 100%);
          border-radius: 18px;
          padding: 26px 28px;
          color: #fff;
        }
        .wm-bill-hero-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12.5px;
          color: rgba(255,255,255,0.6);
          margin-bottom: 10px;
        }
        .wm-bill-badge {
          background: rgba(255,255,255,0.1);
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
        }
        .wm-bill-amount {
          font-family: var(--wm-font-mono, 'JetBrains Mono', monospace);
          font-weight: 600;
          font-size: 34px;
          margin: 0 0 4px;
        }
        .wm-bill-usage {
          font-size: 13px;
          color: rgba(255,255,255,0.55);
          margin: 0;
        }
        .wm-delta-up { color: var(--wm-danger, #EF4444); font-weight: 600; font-size: 12.5px; }
        .wm-delta-down { color: var(--wm-success, #22C55E); font-weight: 600; font-size: 12.5px; }
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
