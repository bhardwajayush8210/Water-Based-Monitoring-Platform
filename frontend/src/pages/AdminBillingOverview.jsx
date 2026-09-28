import { useEffect, useMemo, useState, Fragment } from "react";
import api from "../api/api";
import AdminSidebar from "../components/layout/AdminSidebar";
import TopNavbar from "../components/layout/TopNavbar";
import StatCard from "../components/layout/StatCard";
import {
  CurrencyRupee,
  Building,
  CalendarRange,
  ChevronDown,
  ChevronUp,
  PeopleFill,
} from "react-bootstrap-icons";

function AdminBillingOverview() {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedId, setExpandedId] = useState(null);
  const [invoicesByCycle, setInvoicesByCycle] = useState({});
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  const [communityFilter, setCommunityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchMonth, setSearchMonth] = useState("");

  const loadCycles = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/billing-overview");
      setCycles(res.data);
    } catch (err) {
      console.error("Failed to load billing overview:", err);
      setError("Failed to load billing overview.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCycles();
  }, []);

  const toggleExpand = async (cycle) => {
    if (expandedId === cycle.cycleId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(cycle.cycleId);

    if (!invoicesByCycle[cycle.cycleId]) {
      setLoadingInvoices(true);
      try {
        const res = await api.get(
          `/admin/billing-overview/${cycle.cycleId}/invoices`,
        );
        setInvoicesByCycle((prev) => ({ ...prev, [cycle.cycleId]: res.data }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingInvoices(false);
      }
    }
  };

  const communities = useMemo(() => {
    const set = new Set(cycles.map((c) => c.apartmentName));
    return Array.from(set);
  }, [cycles]);

  const filteredCycles = useMemo(() => {
    return cycles.filter((c) => {
      if (communityFilter !== "ALL" && c.apartmentName !== communityFilter)
        return false;
      if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
      if (
        searchMonth.trim() &&
        !c.periodLabel.toLowerCase().includes(searchMonth.trim().toLowerCase())
      )
        return false;
      return true;
    });
  }, [cycles, communityFilter, statusFilter, searchMonth]);

  const totalRevenue = useMemo(
    () => filteredCycles.reduce((sum, c) => sum + c.totalBilledInr, 0),
    [filteredCycles],
  );
  const totalResidentsBilled = useMemo(
    () => filteredCycles.reduce((sum, c) => sum + c.residentCount, 0),
    [filteredCycles],
  );

  return (
    <>
      <AdminSidebar />
      <TopNavbar
        title="Billing Overview"
        subtitle="Revenue by billing cycle across every community"
      />

      <div className="wm-page">
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
            <button className="wm-btn-outline" onClick={loadCycles}>
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <StatCard
                  icon={CurrencyRupee}
                  label="Revenue (filtered)"
                  value={`₹${totalRevenue.toLocaleString()}`}
                  tone="success"
                />
              </div>
              <div className="col-md-4">
                <StatCard
                  icon={CalendarRange}
                  label="Billing Cycles (filtered)"
                  value={filteredCycles.length}
                  tone="accent"
                />
              </div>
              <div className="col-md-4">
                <StatCard
                  icon={PeopleFill}
                  label="Residents Billed (filtered)"
                  value={totalResidentsBilled}
                  tone="warn"
                />
              </div>
            </div>

            <div className="wm-card mb-3">
              <div className="row g-3 align-items-end">
                <div className="col-md-4">
                  <label className="wm-label">Community</label>
                  <select
                    className="wm-input-plain"
                    value={communityFilter}
                    onChange={(e) => setCommunityFilter(e.target.value)}
                  >
                    <option value="ALL">All Communities</option>
                    {communities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="wm-label">Status</label>
                  <select
                    className="wm-input-plain"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="OPEN">Open</option>
                    <option value="FINALIZED">Finalized</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="wm-label">
                    Search Period (e.g. "July")
                  </label>
                  <input
                    type="text"
                    className="wm-input-plain"
                    placeholder="July 2026"
                    value={searchMonth}
                    onChange={(e) => setSearchMonth(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="wm-card">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="wm-card-title mb-0">
                  <Building size={16} className="me-2" />
                  All Billing Cycles
                </h6>
                <span className="wm-badge wm-badge-neutral">
                  {filteredCycles.length} cycles
                </span>
              </div>

              {filteredCycles.length === 0 ? (
                <p className="wm-muted-text text-center py-4">
                  No billing cycles match these filters.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="wm-table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Community</th>
                        <th>Community Admin</th>
                        <th>Period</th>
                        <th>Dates</th>
                        <th>Status</th>
                        <th>Residents</th>
                        <th>Total Billed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCycles.map((c) => {
                        const isOpen = expandedId === c.cycleId;
                        const invoices = invoicesByCycle[c.cycleId];

                        return (
                          <Fragment key={c.cycleId}>
                            <tr
                              onClick={() => toggleExpand(c)}
                              style={{ cursor: "pointer" }}
                            >
                              <td>
                                {isOpen ? (
                                  <ChevronUp size={13} />
                                ) : (
                                  <ChevronDown size={13} />
                                )}
                              </td>
                              <td style={{ fontWeight: 600 }}>
                                {c.apartmentName}
                              </td>
                              <td>{c.communityAdminName}</td>
                              <td>{c.periodLabel}</td>
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
                              <td style={{ fontWeight: 600 }}>
                                ₹{c.totalBilledInr.toLocaleString()}
                              </td>
                            </tr>

                            {isOpen && (
                              <tr>
                                <td
                                  colSpan={8}
                                  style={{
                                    background: "#F8FAFC",
                                    padding: "16px 20px",
                                  }}
                                >
                                  {loadingInvoices && !invoices ? (
                                    <div className="text-center py-3">
                                      <div
                                        className="spinner-border spinner-border-sm"
                                        style={{ color: "var(--wm-accent)" }}
                                        role="status"
                                      />
                                    </div>
                                  ) : !invoices || invoices.length === 0 ? (
                                    <p className="wm-muted-text mb-0">
                                      No invoices found for this cycle.
                                    </p>
                                  ) : (
                                    <table className="wm-table">
                                      <thead>
                                        <tr>
                                          <th>Resident</th>
                                          <th>Flat</th>
                                          <th>Usage</th>
                                          <th>Base Charge</th>
                                          <th>Shared Allocation</th>
                                          <th>Adjustment</th>
                                          <th>Total</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {invoices.map((inv) => (
                                          <tr key={inv.id}>
                                            <td>{inv.residentFullName}</td>
                                            <td>{inv.flatNumber || "-"}</td>
                                            <td>
                                              {inv.litresUsed.toFixed(1)} L
                                            </td>
                                            <td>
                                              ₹{inv.baseChargeInr.toFixed(2)}
                                            </td>
                                            <td>
                                              ₹
                                              {inv.sharedAreaAllocationInr.toFixed(
                                                2,
                                              )}
                                            </td>
                                            <td>
                                              ₹{inv.adjustmentInr.toFixed(2)}
                                            </td>
                                            <td style={{ fontWeight: 600 }}>
                                              ₹{inv.totalInr.toFixed(2)}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  )}
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
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
        .wm-btn-outline {
          border: 1px solid var(--wm-accent);
          color: var(--wm-accent-dark);
          background: #fff;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
        }
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
        @media (max-width: 991px) {
          .wm-page { margin-left: 0; padding: 90px 16px 24px; }
        }
      `}</style>
    </>
  );
}

export default AdminBillingOverview;
