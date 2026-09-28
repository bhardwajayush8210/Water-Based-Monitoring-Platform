import { useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";

import {
  CurrencyRupee,
  ReceiptCutoff,
  CalendarRange,
  PlusCircleFill,
  LockFill,
  ArchiveFill,
  EyeFill,
  PencilFill,
  DropletFill,
  PersonCircle,
  XCircleFill,
} from "react-bootstrap-icons";

function BillingManagement() {
  const [tariff, setTariff] = useState(null);

  const [tariffForm, setTariffForm] = useState({
    tier1RateInr: "",
    tier1ThresholdLitres: "10000",
    tier2RateInr: "",
  });

  const [tariffMessage, setTariffMessage] = useState("");
  const [savingTariff, setSavingTariff] = useState(false);

  const [residentBills, setResidentBills] = useState([]);
  const [loadingBills, setLoadingBills] = useState(true);

  const [cycles, setCycles] = useState([]);
  const [loadingCycles, setLoadingCycles] = useState(true);

  const [showCycleForm, setShowCycleForm] = useState(false);

  const [cycleForm, setCycleForm] = useState({
    periodLabel: "",
    startDate: "",
    endDate: "",
  });

  const [selectedCycle, setSelectedCycle] = useState(null);

  const [invoices, setInvoices] = useState([]);

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [showAdjustment, setShowAdjustment] = useState(false);

  const [adjustment, setAdjustment] = useState({
    adjustmentInr: "",
    reason: "",
  });

  const [busy, setBusy] = useState(false);

  // -------------------------
  // LOAD TARIFF
  // -------------------------

  const loadTariff = async () => {
    try {
      const res = await api.get("/community/tariff");

      if (res.data) {
        setTariff(res.data);

        setTariffForm({
          tier1RateInr: res.data.tier1RateInr,
          tier1ThresholdLitres: res.data.tier1ThresholdLitres,
          tier2RateInr: res.data.tier2RateInr,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // -------------------------
  // SAVE TARIFF
  // -------------------------

  const saveTariff = async (e) => {
    e.preventDefault();

    try {
      setSavingTariff(true);

      const res = await api.put("/community/tariff", {
        tier1RateInr: Number(tariffForm.tier1RateInr),

        tier1ThresholdLitres: Number(tariffForm.tier1ThresholdLitres),

        tier2RateInr: Number(tariffForm.tier2RateInr),
      });

      setTariff(res.data);

      setTariffMessage("Tariff saved successfully");
    } catch (err) {
      setTariffMessage(err.response?.data?.message || "Failed saving tariff");
    } finally {
      setSavingTariff(false);
    }
  };

  // -------------------------
  // LOAD MONTH BILL PREVIEW
  // -------------------------

  const loadResidentBills = async () => {
    try {
      setLoadingBills(true);

      const res = await api.get("/community/billing");

      setResidentBills(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingBills(false);
    }
  };

  // -------------------------
  // LOAD BILLING CYCLES
  // -------------------------

  const loadCycles = async () => {
    try {
      setLoadingCycles(true);

      const res = await api.get("/community/billing-cycles");

      setCycles(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingCycles(false);
    }
  };

  // -------------------------
  // OPEN BILLING CYCLE
  // -------------------------

  const createCycle = async (e) => {
    e.preventDefault();

    try {
      await api.post("/community/billing-cycles", cycleForm);

      setCycleForm({
        periodLabel: "",
        startDate: "",
        endDate: "",
      });

      setShowCycleForm(false);

      loadCycles();
    } catch (err) {
      alert(err.response?.data?.message || "Failed creating cycle");
    }
  };

  // -------------------------
  // FINALIZE
  // -------------------------

  const finalizeCycle = async (id) => {
    if (!window.confirm("Finalize cycle and generate invoices?")) return;

    try {
      setBusy(true);

      await api.post(`/community/billing-cycles/${id}/finalize`);

      loadCycles();
    } catch (err) {
      alert(err.response?.data?.message || "Finalize failed");
    } finally {
      setBusy(false);
    }
  };

  // -------------------------
  // ARCHIVE
  // -------------------------

  const archiveCycle = async (id) => {
    try {
      await api.post(`/community/billing-cycles/${id}/archive`);

      loadCycles();
    } catch (err) {
      alert(err.response?.data?.message || "Archive failed");
    }
  };

  // -------------------------
  // LOAD INVOICES
  // -------------------------

  const openInvoices = async (cycle) => {
    try {
      const res = await api.get(
        `/community/billing-cycles/${cycle.id}/invoices`,
      );

      setInvoices(res.data);

      setSelectedCycle(cycle);
    } catch (err) {
      console.log(err);
    }
  };

  // -------------------------
  // APPLY ADJUSTMENT
  // -------------------------

  const applyAdjustment = async () => {
    try {
      await api.put(
        `/community/invoices/${selectedInvoice.id}/adjustment`,

        {
          adjustmentInr: Number(adjustment.adjustmentInr),

          reason: adjustment.reason,
        },
      );

      setShowAdjustment(false);

      openInvoices(selectedCycle);

      setAdjustment({
        adjustmentInr: "",
        reason: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Adjustment failed");
    }
  };

  useEffect(() => {
    loadTariff();

    loadResidentBills();

    loadCycles();
  }, []);

  return (
    <>
      <Sidebar />

      <TopNavbar
        title="Billing"
        subtitle="Water usage billing, invoices & cycle management"
      />

      <div className="wm-page">
        {/* =========================
            TARIFF CONFIGURATION
        ========================== */}

        <div className="wm-card mb-3">
          <div className="d-flex align-items-center gap-2 mb-3">
            <CurrencyRupee size={18} color="var(--wm-accent-dark)" />

            <h6 className="wm-card-title">Tiered Water Tariff</h6>
          </div>

          <form onSubmit={saveTariff}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="wm-label">First Tier Rate (₹ / litre)</label>

                <input
                  className="wm-input-plain"
                  type="number"
                  step="0.01"
                  value={tariffForm.tier1RateInr}
                  onChange={(e) =>
                    setTariffForm({
                      ...tariffForm,
                      tier1RateInr: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="wm-label">Threshold Litres</label>

                <input
                  className="wm-input-plain"
                  type="number"
                  value={tariffForm.tier1ThresholdLitres}
                  onChange={(e) =>
                    setTariffForm({
                      ...tariffForm,
                      tier1ThresholdLitres: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="wm-label">Higher Tier Rate</label>

                <input
                  className="wm-input-plain"
                  type="number"
                  step="0.01"
                  value={tariffForm.tier2RateInr}
                  onChange={(e) =>
                    setTariffForm({
                      ...tariffForm,
                      tier2RateInr: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <button className="wm-btn-primary mt-3" disabled={savingTariff}>
              {savingTariff ? "Saving..." : "Save Tariff"}
            </button>
          </form>

          {tariffMessage && <p className="mt-2 wm-success">{tariffMessage}</p>}
        </div>

        {/* =========================
             MONTH BILL PREVIEW
        ========================== */}

        <div className="wm-card mb-3">
          <div className="d-flex align-items-center gap-2 mb-3">
            <ReceiptCutoff size={18} color="var(--wm-accent-dark)" />

            <h6 className="wm-card-title">Current Resident Billing Preview</h6>
          </div>

          {loadingBills ? (
            <p>Loading...</p>
          ) : (
            <div className="table-responsive">
              <table className="wm-table">
                <thead>
                  <tr>
                    <th>Resident</th>

                    <th>Flat</th>

                    <th>Usage</th>

                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {residentBills.map((b) => (
                    <tr key={b.username}>
                      <td>
                        <PersonCircle size={20} /> {b.fullName}
                      </td>

                      <td>{b.flatNumber || "-"}</td>

                      <td>
                        <DropletFill size={14} />{" "}
                        {Number(b.periodLitres).toFixed(1)}L
                      </td>

                      <td>₹{Number(b.billAmount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* =========================
             BILLING CYCLES
        ========================== */}

        <div className="wm-card">
          <div className="d-flex justify-content-between mb-3">
            <h6 className="wm-card-title">
              <CalendarRange size={17} /> Billing Cycles
            </h6>

            <button
              className="wm-btn-primary"
              onClick={() => setShowCycleForm(!showCycleForm)}
            >
              <PlusCircleFill />
              Open Cycle
            </button>
          </div>

          {showCycleForm && (
            <form onSubmit={createCycle} className="mb-3">
              <input
                className="wm-input-plain mb-2"
                placeholder="July 2026"
                value={cycleForm.periodLabel}
                onChange={(e) =>
                  setCycleForm({
                    ...cycleForm,
                    periodLabel: e.target.value,
                  })
                }
              />

              <input
                type="date"
                className="wm-input-plain mb-2"
                value={cycleForm.startDate}
                onChange={(e) =>
                  setCycleForm({
                    ...cycleForm,
                    startDate: e.target.value,
                  })
                }
              />

              <input
                type="date"
                className="wm-input-plain mb-2"
                value={cycleForm.endDate}
                onChange={(e) =>
                  setCycleForm({
                    ...cycleForm,
                    endDate: e.target.value,
                  })
                }
              />

              <button className="wm-btn-primary">Create</button>
            </form>
          )}

          {loadingCycles ? (
            <div className="text-center py-4">
              <div
                className="spinner-border"
                style={{ color: "var(--wm-accent)" }}
                role="status"
              />
            </div>
          ) : cycles.length === 0 ? (
            <p className="wm-muted-text text-center py-3">
              No billing cycles yet. Open your first one above.
            </p>
          ) : (
            <table className="wm-table">
              <thead>
                <tr>
                  <th>Period</th>

                  <th>Dates</th>

                  <th>Status</th>

                  <th>Total</th>

                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {cycles.map((c) => (
                  <tr key={c.id}>
                    <td>{c.periodLabel}</td>

                    <td>
                      {c.startDate}
                      {" - "}
                      {c.endDate}
                    </td>

                    <td>
                      <span
                        className={`wm-badge wm-badge-${c.status.toLowerCase()}`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td>
                      {c.totalBilledInr != null ? `₹${c.totalBilledInr}` : "-"}
                    </td>

                    <td>
                      <button
                        className="wm-btn-outline me-2"
                        onClick={() => {
                          openInvoices(c);
                          setShowInvoiceModal(true);
                        }}
                      >
                        <EyeFill />
                      </button>

                      {c.status === "OPEN" && (
                        <button
                          className="wm-btn-primary"
                          disabled={busy}
                          onClick={() => finalizeCycle(c.id)}
                        >
                          <LockFill />
                          Finalize
                        </button>
                      )}

                      {c.status === "FINALIZED" && (
                        <button
                          className="wm-btn-outline"
                          onClick={() => archiveCycle(c.id)}
                        >
                          <ArchiveFill />
                          Archive
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* =========================
          INVOICE MODAL
      ========================== */}

      {showInvoiceModal && (
        <div className="wm-modal">
          <div className="wm-modal-box">
            <div className="d-flex justify-content-between mb-3">
              <h5>Invoice Details</h5>

              <XCircleFill
                size={22}
                cursor="pointer"
                onClick={() => setShowInvoiceModal(false)}
              />
            </div>

            {invoices.map((inv) => (
              <div className="wm-invoice-card" key={inv.id}>
                <h6>{inv.residentFullName}</h6>

                <p>Flat :{inv.flatNumber}</p>

                <hr />

                <p>
                  Water Used :<b>{inv.litresUsed} L</b>
                </p>

                <p>Water Charge : ₹{inv.baseChargeInr}</p>

                <p>Bulk Water Share : ₹{inv.sharedAreaAllocationInr}</p>

                <p>Adjustment : ₹{inv.adjustmentInr}</p>

                <h5>Total : ₹{inv.totalInr}</h5>

                {inv.cycleStatus === "FINALIZED" && (
                  <button
                    className="wm-btn-outline"
                    onClick={() => {
                      setSelectedInvoice(inv);

                      setShowAdjustment(true);
                    }}
                  >
                    <PencilFill />
                    Adjustment
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================
          ADJUSTMENT MODAL
      ========================== */}

      {showAdjustment && (
        <div className="wm-modal">
          <div className="wm-modal-box">
            <h5>Apply Adjustment</h5>

            <input
              className="wm-input-plain mb-2"
              placeholder="Amount"
              value={adjustment.adjustmentInr}
              onChange={(e) =>
                setAdjustment({
                  ...adjustment,
                  adjustmentInr: e.target.value,
                })
              }
            />

            <textarea
              className="wm-input-plain mb-2"
              placeholder="Reason"
              value={adjustment.reason}
              onChange={(e) =>
                setAdjustment({
                  ...adjustment,
                  reason: e.target.value,
                })
              }
            />

            <button className="wm-btn-primary" onClick={applyAdjustment}>
              Save
            </button>
          </div>
        </div>
      )}

      <style>{`

.wm-page{
margin-left:252px;
padding:96px 28px 32px;
background:var(--wm-bg,#F6F8FB);
min-height:100vh;
}


.wm-card{

background:white;
border:1px solid var(--wm-border);
border-radius:16px;
padding:22px;

}


.wm-card-title{

font-weight:700;
font-size:15px;

}


.wm-label{

font-size:12px;
color:#64748B;

}


.wm-input-plain{

height:42px;
width:100%;
border:1px solid #ddd;
border-radius:8px;
padding:10px;

}


.wm-btn-primary{

background:var(--wm-accent);
color:white;
border:none;
padding:10px 16px;
border-radius:8px;

}
.wm-btn-primary:disabled{ opacity:0.6; cursor:default; }


.wm-btn-outline{

background:white;
border:1px solid var(--wm-accent);
padding:8px 14px;
border-radius:8px;

}
.wm-muted-text{ color:#64748B; font-size:13.5px; }


.wm-table{

width:100%;
border-collapse:collapse;

}


.wm-table td,
.wm-table th{

padding:12px;
border-bottom:1px solid #eee;

}


.wm-badge{

padding:5px 10px;
border-radius:20px;
font-size:11.5px;
font-weight:600;

}
.wm-badge-open{ background:#E3FBF6; color:#0D9488; }
.wm-badge-finalized{ background:#FEF3E2; color:#B45309; }
.wm-badge-archived{ background:#eef2ff; color:#4F46E5; }



.wm-modal{

position:fixed;
inset:0;
background:rgba(0,0,0,.4);
display:flex;
justify-content:center;
align-items:center;
z-index:999;

}


.wm-modal-box{

background:white;
width:600px;
max-height:80vh;
overflow:auto;
padding:25px;
border-radius:16px;

}



.wm-invoice-card{

border:1px solid #eee;
padding:15px;
border-radius:12px;
margin-bottom:12px;

}



@media(max-width:991px){

.wm-page{

margin-left:0;

}

}


`}</style>
    </>
  );
}

export default BillingManagement;
