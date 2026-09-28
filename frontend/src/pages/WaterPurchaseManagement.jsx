import { useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";
import StatCard from "../components/layout/StatCard";
import {
  DropletFill,
  CurrencyRupee,
  Calculator,
  TrashFill,
  PlusCircleFill,
} from "react-bootstrap-icons";

const sources = [
  { value: "TANKER", label: "Tanker Delivery" },
  { value: "MUNICIPAL", label: "Municipal Supply" },
  { value: "OTHER", label: "Other" },
];

const todayStr = new Date().toISOString().slice(0, 10);

function WaterPurchaseManagement() {
  const [purchases, setPurchases] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    source: "TANKER",
    purchaseDate: todayStr,
    totalVolumeLitres: "",
    totalCostInr: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [purchasesRes, summaryRes] = await Promise.all([
        api.get("/community/water-purchases"),
        api.get("/community/water-purchases/summary"),
      ]);
      setPurchases(purchasesRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load water purchase records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/community/water-purchases", {
        ...form,
        totalVolumeLitres: parseFloat(form.totalVolumeLitres),
        totalCostInr: parseFloat(form.totalCostInr),
      });
      setForm({
        source: "TANKER",
        purchaseDate: todayStr,
        totalVolumeLitres: "",
        totalCostInr: "",
        notes: "",
      });
      loadData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add purchase record.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this purchase record?")) return;
    try {
      await api.delete(`/community/water-purchases/${id}`);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete record.");
    }
  };

  const previewUnitCost =
    form.totalVolumeLitres && form.totalCostInr
      ? (
          parseFloat(form.totalCostInr) / parseFloat(form.totalVolumeLitres)
        ).toFixed(2)
      : null;

  return (
    <>
      <Sidebar />
      <TopNavbar
        title="Water Purchase"
        subtitle="Track bulk procurement - tanker deliveries & municipal supply"
      />

      <div className="wm-page">
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <StatCard
              icon={DropletFill}
              label="Volume This Month"
              value={
                summary
                  ? `${summary.totalVolumeLitres.toLocaleString()} L`
                  : "—"
              }
              tone="accent"
            />
          </div>
          <div className="col-md-4">
            <StatCard
              icon={CurrencyRupee}
              label="Cost This Month"
              value={
                summary ? `₹${summary.totalCostInr.toLocaleString()}` : "—"
              }
              tone="warn"
            />
          </div>
          <div className="col-md-4">
            <StatCard
              icon={Calculator}
              label="Blended Unit Cost"
              value={
                summary ? `₹${summary.blendedUnitCostInr.toFixed(2)}/L` : "—"
              }
              tone="success"
            />
          </div>
        </div>

        <div className="wm-card mb-3">
          <h6 className="wm-card-title mb-3">Record a Purchase</h6>
          <form onSubmit={handleSubmit}>
            <div className="row g-3 align-items-end">
              <div className="col-md-2">
                <label className="wm-label">Source</label>
                <select
                  className="wm-input-plain"
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                >
                  {sources.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <label className="wm-label">Date</label>
                <input
                  type="date"
                  className="wm-input-plain"
                  name="purchaseDate"
                  value={form.purchaseDate}
                  max={todayStr}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <label className="wm-label">Volume (L)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  className="wm-input-plain"
                  name="totalVolumeLitres"
                  placeholder="e.g. 5000"
                  value={form.totalVolumeLitres}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <label className="wm-label">Cost (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="wm-input-plain"
                  name="totalCostInr"
                  placeholder="e.g. 2500"
                  value={form.totalCostInr}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <label className="wm-label">Notes (optional)</label>
                <input
                  type="text"
                  className="wm-input-plain"
                  name="notes"
                  placeholder="Vendor name, etc."
                  value={form.notes}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-2">
                <button className="wm-btn-primary w-100" disabled={saving}>
                  <PlusCircleFill size={13} className="me-2" />
                  {saving ? "Saving..." : "Add"}
                </button>
              </div>
            </div>
          </form>

          {previewUnitCost && (
            <p className="wm-muted-text mt-2 mb-0">
              This works out to <strong>₹{previewUnitCost}/L</strong>
            </p>
          )}
        </div>

        <div className="wm-card">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="wm-card-title mb-0">Purchase History</h6>
            <span className="wm-badge wm-badge-accent">
              {purchases.length} records
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
              <button className="wm-btn-outline" onClick={loadData}>
                Retry
              </button>
            </div>
          ) : purchases.length === 0 ? (
            <p className="wm-muted-text text-center py-4 mb-0">
              No purchase records yet. Add one above.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="wm-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Source</th>
                    <th>Volume</th>
                    <th>Cost</th>
                    <th>Unit Cost</th>
                    <th>Notes</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((p) => (
                    <tr key={p.id}>
                      <td>{p.purchaseDate}</td>
                      <td>
                        <span className="wm-badge wm-badge-neutral">
                          {p.source}
                        </span>
                      </td>
                      <td>{p.totalVolumeLitres.toLocaleString()} L</td>
                      <td>₹{p.totalCostInr.toLocaleString()}</td>
                      <td style={{ fontFamily: "var(--wm-font-mono)" }}>
                        ₹{p.unitCostInr.toFixed(2)}/L
                      </td>
                      <td className="wm-muted-text">{p.notes || "—"}</td>
                      <td>
                        <button
                          className="wm-btn-danger-sm"
                          onClick={() => handleDelete(p.id)}
                        >
                          <TrashFill size={12} />
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
          padding: 0 10px;
          height: 42px;
          width: 100%;
          font-size: 13px;
        }
        .wm-btn-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--wm-accent);
          color: #fff;
          border: none;
          height: 42px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13px;
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
        .wm-btn-danger-sm {
          border: 1px solid var(--wm-danger);
          color: var(--wm-danger);
          background: #fff;
          padding: 6px 10px;
          border-radius: 8px;
          cursor: pointer;
        }
        .wm-btn-danger-sm:hover { background: var(--wm-danger-soft); }
        .wm-badge { font-size: 11.5px; font-weight: 600; padding: 4px 10px; border-radius: 999px; }
        .wm-badge-accent { background: var(--wm-accent-soft); color: var(--wm-accent-dark); }
        .wm-badge-neutral { background: #eef1f5; color: #414d5c; }
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

export default WaterPurchaseManagement;
