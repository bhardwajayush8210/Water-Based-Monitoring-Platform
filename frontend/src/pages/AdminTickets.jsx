import { useEffect, useState, Fragment } from "react";
import api from "../api/api";
import AdminSidebar from "../components/layout/AdminSidebar";
import TopNavbar from "../components/layout/TopNavbar";
import { ChatDotsFill, SendFill } from "react-bootstrap-icons";

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tracks which ticket's reply box is open
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tickets/superadmin");
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // FIX: status now sent in the request body (JSON), not as a URL query param.
  // The backend's updateStatus endpoint expects @RequestBody StatusTicketRequest,
  // so sending it as ?status=... left the body empty and caused a 403
  // (via a failed /error redirect that isn't permitAll()).
  const handleStatusChange = async (id, status) => {
    setProcessing(true);
    try {
      await api.put(`/tickets/${id}/status`, { status });
      fetchTickets();
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenReply = (ticket) => {
    if (activeReplyId === ticket.id) {
      setActiveReplyId(null);
      setReplyText("");
    } else {
      setActiveReplyId(ticket.id);
      setReplyText(ticket.adminResponse || "");
    }
  };

  const handleSendReply = async (ticketId, markResolved = false) => {
    if (!replyText.trim()) {
      alert("Please write a reply message.");
      return;
    }

    setProcessing(true);
    try {
      const status = markResolved ? "RESOLVED" : "IN_PROGRESS";
      await api.put(`/tickets/${ticketId}/status`, {
        status,
        adminResponse: replyText,
      });
      setActiveReplyId(null);
      setReplyText("");
      fetchTickets();
    } catch (err) {
      console.error("Failed to send reply:", err);
      alert("Failed to send reply.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <AdminSidebar />
      <TopNavbar
        title="System & Escalated Tickets"
        subtitle="Manage app bugs and community escalated tickets"
      />

      <div className="wm-page">
        <div className="wm-card">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="wm-card-title mb-0">Super Admin Ticket Queue</h6>
            <span className="wm-badge wm-badge-accent">
              {tickets.length} total
            </span>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div
                className="spinner-border"
                style={{ color: "var(--wm-accent)" }}
                role="status"
              />
            </div>
          ) : tickets.length === 0 ? (
            <p className="wm-empty-note text-center py-4 mb-0">
              No system bug reports or forwarded tickets outstanding.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="wm-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>User</th>
                    <th>Community / Apartment</th>
                    <th>Issue Description</th>
                    <th>Escalation Note</th>
                    <th>Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => {
                    const isReplyOpen = activeReplyId === t.id;

                    return (
                      <Fragment key={t.id}>
                        <tr>
                          <td style={{ fontWeight: 600 }}>#TCK-{t.id}</td>
                          <td>@{t.username}</td>
                          <td>{t.apartment || "Global System"}</td>
                          <td>
                            <strong>{t.subject}</strong>
                            <br />
                            <small className="text-muted">
                              {t.description}
                            </small>
                            {t.adminResponse && (
                              <div className="wm-admin-reply-preview mt-1">
                                💬 <b>Your Reply:</b> {t.adminResponse}
                              </div>
                            )}
                          </td>
                          <td>
                            {t.escalationNote ? (
                              <span className="wm-escalation-preview">
                                ⚠️ <b>Community Admin Note:</b>{" "}
                                {t.escalationNote}
                              </span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
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
                          <td className="text-end">
                            <button
                              className="wm-btn-outline me-2"
                              onClick={() => handleOpenReply(t)}
                            >
                              <ChatDotsFill size={12} className="me-1" />
                              Reply
                            </button>

                            {t.status !== "RESOLVED" && (
                              <button
                                className="wm-btn-primary-sm"
                                disabled={processing}
                                onClick={() =>
                                  handleStatusChange(t.id, "RESOLVED")
                                }
                              >
                                Mark Resolved
                              </button>
                            )}
                          </td>
                        </tr>

                        {/* Expandable Reply Form */}
                        {isReplyOpen && (
                          <tr>
                            <td
                              colSpan={7}
                              style={{
                                background: "#F8FAFC",
                                padding: "16px 20px",
                              }}
                            >
                              <div className="wm-action-box">
                                <label
                                  className="fw-semibold mb-2 d-block"
                                  style={{ fontSize: "13px" }}
                                >
                                  Reply to @{t.username}
                                </label>
                                <textarea
                                  className="form-control mb-3"
                                  rows="3"
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Write resolution steps or information for the user..."
                                ></textarea>
                                <div className="d-flex justify-content-end gap-2">
                                  <button
                                    className="wm-btn-outline"
                                    disabled={processing}
                                    onClick={() => handleSendReply(t.id, false)}
                                  >
                                    Send Reply (In Progress)
                                  </button>
                                  <button
                                    className="wm-btn-primary-sm"
                                    disabled={processing}
                                    onClick={() => handleSendReply(t.id, true)}
                                  >
                                    <SendFill size={11} className="me-1" />
                                    Reply & Mark Resolved
                                  </button>
                                </div>
                              </div>
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
      </div>

      <style>{`
        .wm-page {
          margin-left: 252px;
          padding: 96px 28px 32px;
          background: var(--wm-bg, #F6F8FB);
          min-height: 100vh;
        }
        .wm-card {
          background: #fff;
          border: 1px solid var(--wm-border, #E7EBF1);
          border-radius: 16px;
          padding: 20px 22px;
        }
        .wm-card-title {
          font-family: var(--wm-font-display, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: 15.5px;
          color: var(--wm-ink, #0F172A);
        }
        .wm-badge { font-size: 11.5px; font-weight: 600; padding: 4px 10px; border-radius: 999px; }
        .wm-badge-accent { background: var(--wm-accent-soft); color: var(--wm-accent-dark); }
        .wm-badge-success { background: var(--wm-success-soft, #E9F9EF); color: #15803D; }
        .wm-badge-warn { background: var(--wm-warn-soft, #FEF3C7); color: #B45309; }
        .wm-badge-danger { background: #FEE2E2; color: #991B1B; }
        .wm-escalation-preview {
          display: inline-block;
          background: #FEF2F2;
          border: 1px solid #FCA5A5;
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 12px;
          color: #991B1B;
        }
        .wm-admin-reply-preview {
          background: #F0FDF4;
          border: 1px solid #DCFCE7;
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 12px;
          color: #166534;
        }
        .wm-action-box {
          background: #fff;
          border: 1px solid var(--wm-border, #E7EBF1);
          border-radius: 12px;
          padding: 16px;
        }
        .wm-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .wm-table thead th {
          text-align: left;
          font-weight: 500;
          font-size: 11.5px;
          text-transform: uppercase;
          color: var(--wm-muted, #64748B);
          padding: 0 12px 10px;
          border-bottom: 1px solid var(--wm-border, #E7EBF1);
        }
        .wm-table tbody td {
          padding: 12px;
          border-bottom: 1px solid var(--wm-border, #E7EBF1);
          color: var(--wm-ink, #0F172A);
          vertical-align: top;
        }
        .wm-btn-primary-sm {
          background: var(--wm-accent, #6366F1);
          color: #fff;
          border: none;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .wm-btn-outline {
          border: 1px solid var(--wm-border, #CBD5E1);
          color: var(--wm-muted, #64748B);
          background: #fff;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 12px;
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
