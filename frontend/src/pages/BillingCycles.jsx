import { useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";
import {
  CalendarRange,
  PlusCircleFill,
  LockFill,
  ArchiveFill,
  PersonCircle,
  PencilFill,
} from "react-bootstrap-icons";

const statusStyle = {
  OPEN: { badge: "wm-badge-accent", label: "Open" },
  FINALIZED: { badge: "wm-badge-warn", label: "Finalized" },
  ARCHIVED: { badge: "wm-badge-neutral", label: "Archived" },
};

function BillingCycles() {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showOpenForm, setShowOpenForm] = useState(false);
  const [openForm, setOpenForm] = useState({
    periodLabel: "",
    startDate: "",
    endDate: "",
  });
  const [opening, setOpening] = useState(false);

  const [busyCycleId, setBusyCycleId] = useState(null);

  const [selectedCycle, setSelectedCycle] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  const [adjustDrafts, setAdjustDrafts] = useState({});
  const [savingAdjustment, setSavingAdjustment] = useState(null);

  const hasOpenCycle = cycles.some((c) => c.status === "OPEN");

  const loadCycles = async (selectedId = null) => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/community/billing-cycles");

      setCycles(res.data);

      const cycleId = selectedId ?? selectedCycle?.id;

      if (cycleId) {
        const updated = res.data.find((c) => c.id === cycleId);

        if (updated) {
          setSelectedCycle(updated);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load billing cycles.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (e) =>
    setOpenForm({ ...openForm, [e.target.name]: e.target.value });

  const handleOpenCycle = async (e) => {
    e.preventDefault();
    setOpening(true);
    try {
      await api.post("/community/billing-cycles", openForm);
      setOpenForm({ periodLabel: "", startDate: "", endDate: "" });
      setShowOpenForm(false);
      loadCycles();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to open cycle.");
    } finally {
      setOpening(false);
    }
  };

 const handleFinalize = async (id) => {
   if (
     !window.confirm(
       "Finalize this billing cycle?\n\nInvoices will be generated and cannot be undone.",
     )
   ) {
     return;
   }

   try {
     setBusyCycleId(id);

     await api.post(`/community/billing-cycles/${id}/finalize`);

     await loadCycles(id);

     await loadInvoices(id);
   } catch (err) {
     console.error(err);

     alert(err.response?.data?.message || "Failed to finalize billing cycle.");
   } finally {
     setBusyCycleId(null);
   }
 };

  const handleArchive = async (id) => {
    if (
      !window.confirm(
        "Archive this billing cycle?\n\nNo more adjustments can be made afterwards.",
      )
    ) {
      return;
    }

    try {
      setBusyCycleId(id);

      await api.post(`/community/billing-cycles/${id}/archive`);

      await loadCycles(id);

      await loadInvoices(id);
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Failed to archive billing cycle.");
    } finally {
      setBusyCycleId(null);
    }
  };

  const loadInvoices = async (cycleId) => {
    setLoadingInvoices(true);
    try {
      const res = await api.get(
        `/community/billing-cycles/${cycleId}/invoices`,
      );
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInvoices(false);
    }
  };

  const handleSelectCycle = (cycle) => {
    setSelectedCycle(cycle);
    setAdjustDrafts({});
    loadInvoices(cycle.id);
  };

  const handleAdjustDraftChange = (invoiceId, field, value) => {
    setAdjustDrafts({
      ...adjustDrafts,
      [invoiceId]: { ...adjustDrafts[invoiceId], [field]: value },
    });
  };

  const handleSaveAdjustment = async (invoiceId) => {
    const draft = adjustDrafts[invoiceId];
    if (!draft?.amount) return;

    setSavingAdjustment(invoiceId);
    try {
      await api.put(`/community/invoices/${invoiceId}/adjustment`, {
        adjustmentInr: parseFloat(draft.amount),
        reason: draft.reason || "",
      });
      await loadInvoices(selectedCycle.id);
      await loadCycles();
      setAdjustDrafts({ ...adjustDrafts, [invoiceId]: undefined });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save adjustment.");
    } finally {
      setSavingAdjustment(null);
    }
  };

  return (
    <>
      <Sidebar />
      <TopNavbar
        title="Billing Cycles"
        subtitle="Open, finalize, and archive billing periods"
      />

      <div className="wm-page">
        <div className="wm-card mb-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <CalendarRange size={16} color="var(--wm-accent-dark)" />
              <h6 className="wm-card-title mb-0">Billing Periods</h6>
            </div>
            {!hasOpenCycle && (
              <button
                className="wm-btn-primary"
                onClick={() => setShowOpenForm(!showOpenForm)}
              >
                <PlusCircleFill size={13} className="me-2" />
                Open New Cycle
              </button>
            )}
          </div>

          {hasOpenCycle && (
            <p className="wm-muted-text mb-0">
              An OPEN cycle already exists below - finalize it before opening a
              new one.
            </p>
          )}

          {showOpenForm && (
            <form onSubmit={handleOpenCycle} className="wm-open-form">
              <div className="row g-3 align-items-end">
                <div className="col-md-4">
                  <label className="wm-label">Period Label</label>
                  <input
                    className="wm-input-plain"
                    name="periodLabel"
                    placeholder="e.g. July 2026"
                    value={openForm.periodLabel}
                    onChange={handleOpenChange}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="wm-label">Start Date</label>
                  <input
                    type="date"
                    className="wm-input-plain"
                    name="startDate"
                    value={openForm.startDate}
                    onChange={handleOpenChange}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="wm-label">End Date</label>
                  <input
                    type="date"
                    className="wm-input-plain"
                    name="endDate"
                    value={openForm.endDate}
                    onChange={handleOpenChange}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <button className="wm-btn-primary w-100" disabled={opening}>
                    {opening ? "Opening..." : "Confirm"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="wm-card mb-3">
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
              <button className="wm-btn-outline" onClick={loadCycles}>
                Retry
              </button>
            </div>
          ) : cycles.length === 0 ? (
            <p className="wm-muted-text text-center py-4 mb-0">
              No billing cycles yet. Open your first one above.
            </p>
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
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cycles.map((c) => {
                    const st = statusStyle[c.status];
                    return (
                      <tr
                        key={c.id}
                        onClick={() => handleSelectCycle(c)}
                        className={
                          selectedCycle?.id === c.id ? "wm-row-selected" : ""
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <td style={{ fontWeight: 500 }}>{c.periodLabel}</td>
                        <td className="wm-muted-text">
                          {c.startDate} → {c.endDate}
                        </td>
                        <td>
                          <span className={`wm-badge ${st.badge}`}>
                            {st.label}
                          </span>
                        </td>
                        <td>{c.invoiceCount}</td>
                        <td>
                          {c.totalBilledInr !== null
                            ? `₹${c.totalBilledInr.toFixed(2)}`
                            : "—"}
                        </td>
                        <td
                          className="text-end"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {c.status === "OPEN" && (
                            <button
                              className="wm-btn-warn-sm"
                              disabled={busyCycleId === c.id}
                              onClick={() => handleFinalize(c.id)}
                            >
                              <LockFill size={11} className="me-1" />
                              Finalize
                            </button>
                          )}
                          {c.status === "FINALIZED" && (
                            <button
                              className="wm-btn-outline"
                              disabled={busyCycleId === c.id}
                              onClick={() => handleArchive(c.id)}
                            >
                              <ArchiveFill size={11} className="me-1" />
                              Archive
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

        {selectedCycle && (
          <div className="wm-card">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="wm-card-title mb-0">
                Invoices - {selectedCycle.periodLabel}
              </h6>
              <span
                className={`wm-badge ${statusStyle[selectedCycle.status].badge}`}
              >
                {statusStyle[selectedCycle.status].label}
              </span>
            </div>

            {selectedCycle.status === "OPEN" ? (
              <p className="wm-muted-text text-center py-3 mb-0">
                This cycle hasn't been finalized yet - no invoices exist until
                you finalize it.
              </p>
            ) : loadingInvoices ? (
              <div className="text-center py-4">
                <div
                  className="spinner-border"
                  style={{ color: "var(--wm-accent)" }}
                  role="status"
                />
              </div>
            ) : invoices.length === 0 ? (
              <p className="wm-muted-text text-center py-3 mb-0">
                No residents were billed in this cycle.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="wm-table">
                  <thead>
                    <tr>
                      <th>Resident</th>
                      <th>Usage</th>
                      <th>Base Charge</th>
                      <th>Shared Allocation</th>
                      <th>Adjustment</th>
                      <th className="text-end">Total</th>
                      {selectedCycle.status === "FINALIZED" && <th></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <PersonCircle size={20} color="#c7d0d9" />
                            <div>
                              <div style={{ fontWeight: 500 }}>
                                {inv.residentFullName}
                              </div>
                              <span className="wm-badge wm-badge-neutral">
                                {inv.flatNumber || "—"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>{inv.litresUsed.toFixed(1)} L</td>
                        <td>₹{inv.baseChargeInr.toFixed(2)}</td>
                        <td>₹{inv.sharedAreaAllocationInr.toFixed(2)}</td>
                        <td>
                          {selectedCycle.status === "FINALIZED" ? (
                            <div className="d-flex gap-1">
                              <input
                                type="number"
                                step="0.01"
                                placeholder="₹0.00"
                                className="wm-mini-input"
                                value={
                                  adjustDrafts[inv.id]?.amount ??
                                  inv.adjustmentInr
                                }
                                onChange={(e) =>
                                  handleAdjustDraftChange(
                                    inv.id,
                                    "amount",
                                    e.target.value,
                                  )
                                }
                              />
                              <input
                                type="text"
                                placeholder="Reason"
                                className="wm-mini-input"
                                value={
                                  adjustDrafts[inv.id]?.reason ??
                                  (inv.adjustmentReason || "")
                                }
                                onChange={(e) =>
                                  handleAdjustDraftChange(
                                    inv.id,
                                    "reason",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          ) : (
                            <span>₹{inv.adjustmentInr.toFixed(2)}</span>
                          )}
                        </td>
                        <td
                          className="text-end"
                          style={{
                            fontFamily: "var(--wm-font-mono)",
                            fontWeight: 600,
                          }}
                        >
                          ₹{inv.totalInr.toFixed(2)}
                        </td>
                        {selectedCycle.status === "FINALIZED" && (
                          <td className="text-end">
                            <button
                              className="wm-btn-primary-sm"
                              disabled={
                                !adjustDrafts[inv.id] ||
                                savingAdjustment === inv.id
                              }
                              onClick={() => handleSaveAdjustment(inv.id)}
                            >
                              <PencilFill size={10} className="me-1" />
                              {savingAdjustment === inv.id
                                ? "Saving..."
                                : "Save"}
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
        .wm-muted-text { color: var(--wm-muted, #64748B); font-size: 13px; }
        .wm-label {
          font-size: 12px;
          color: var(--wm-muted, #64748B);
          display: block;
          margin-bottom: 6px;
        }
        .wm-open-form {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--wm-border, #E7EBF1);
        }
        .wm-input-plain {
          border: 1px solid var(--wm-border, #E7EBF1);
          border-radius: 8px;
          padding: 0 12px;
          height: 42px;
          width: 100%;
          font-size: 13.5px;
        }
        .wm-mini-input {
          border: 1px solid var(--wm-border, #E7EBF1);
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 12px;
          width: 90px;
          height: 30px;
        }
        .wm-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--wm-accent);
          color: #fff;
          border: none;
          height: 42px;
          padding: 0 16px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13.5px;
          cursor: pointer;
        }
        .wm-btn-primary:hover { background: var(--wm-accent-dark); }
        .wm-btn-primary-sm {
          background: var(--wm-accent);
          color: #fff;
          border: none;
          padding: 6px 12px;
          border-radius: 7px;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }
        .wm-btn-primary-sm:disabled { opacity: 0.5; }
        .wm-btn-warn-sm {
          background: var(--wm-warn, #F59E0B);
          color: #fff;
          border: none;
          padding: 6px 12px;
          border-radius: 7px;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }
        .wm-btn-outline {
          border: 1px solid var(--wm-accent);
          color: var(--wm-accent-dark);
          background: #fff;
          padding: 6px 12px;
          border-radius: 7px;
          font-size: 11.5px;
          font-weight: 500;
          cursor: pointer;
        }
        .wm-badge { font-size: 11.5px; font-weight: 600; padding: 4px 10px; border-radius: 999px; }
        .wm-badge-accent { background: var(--wm-accent-soft); color: var(--wm-accent-dark); }
        .wm-badge-neutral { background: #eef1f5; color: #414d5c; }
        .wm-badge-warn { background: var(--wm-warn-soft, #FEF3E2); color: #B45309; }
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
        .wm-table tbody tr:hover { background: var(--wm-bg, #F6F8FB); }
        .wm-row-selected { background: var(--wm-accent-soft) !important; }
        @media (max-width: 991px) {
          .wm-page { margin-left: 0; padding: 90px 16px 24px; }
        }
      `}</style>
    </>
  );
}

export default BillingCycles;
