import { useEffect, useState, Fragment } from "react";
import api from "../api/api";
import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";
import {
  LifePreserver,
  CheckCircleFill,
  ChatDotsFill,
  ChevronDown,
  ChevronUp,
  SendFill,
  ArrowRightSquareFill,
  ExclamationCircleFill,
} from "react-bootstrap-icons";

export default function CommunityTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tracks active expandable actions per ticket row
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [activeForwardId, setActiveForwardId] = useState(null);

  const [replyText, setReplyText] = useState("");
  const [forwardNote, setForwardNote] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tickets/community");
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to load community tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleOpenReply = (ticket) => {
    setActiveForwardId(null);
    if (activeReplyId === ticket.id) {
      setActiveReplyId(null);
      setReplyText("");
    } else {
      setActiveReplyId(ticket.id);
      setReplyText(ticket.adminResponse || "");
    }
  };

  const handleOpenForward = (ticket) => {
    setActiveReplyId(null);
    if (activeForwardId === ticket.id) {
      setActiveForwardId(null);
      setForwardNote("");
    } else {
      setActiveForwardId(ticket.id);
      setForwardNote("");
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

  const handleForwardToSuperAdmin = async (ticketId) => {
    if (!forwardNote.trim()) {
      alert("Please state the reason why this issue is being forwarded.");
      return;
    }

    setProcessing(true);
    try {
     await api.put(`/tickets/${ticketId}/escalate`, {
       escalationNote: forwardNote,
     });
      alert("✅ Ticket forwarded to Super Admin successfully!");
      setActiveForwardId(null);
      setForwardNote("");
      fetchTickets();
    } catch (err) {
      console.error("Failed to forward ticket:", err);
      alert("Failed to forward ticket to Super Admin.");
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleStatus = async (ticketId, currentStatus) => {
    const newStatus = currentStatus === "RESOLVED" ? "OPEN" : "RESOLVED";
    try {
      await api.put(`/tickets/${ticketId}/status`, { status: newStatus });
      fetchTickets();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status.");
    }
  };

  return (
    <>
      <Sidebar />
      <TopNavbar
        title="Support Tickets"
        subtitle="Resolve resident concerns or forward complex issues to Super Admin"
      />

      <div className="wm-page">
        <div className="wm-card">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="wm-card-title mb-0">Community Concerns & Tickets</h6>
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
              No open concerns or support tickets reported in your community.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="wm-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Resident</th>
                    <th>Flat / Apartment</th>
                    <th>Issue & Description</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => {
                    const isReplyOpen = activeReplyId === t.id;
                    const isForwardOpen = activeForwardId === t.id;

                    return (
                      <Fragment key={t.id}>
                        <tr>
                          <td style={{ fontWeight: 600 }}>#TCK-{t.id}</td>
                          <td>@{t.username}</td>
                          <td>
                            {t.apartment || "N/A"} - Flat{" "}
                            {t.flatNumber || "N/A"}
                          </td>
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
                            <span
                              className={`wm-badge ${
                                t.status === "RESOLVED"
                                  ? "wm-badge-success"
                                  : t.status === "IN_PROGRESS"
                                    ? "wm-badge-info"
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

                            <button
                              className="wm-btn-warn-sm me-2"
                              onClick={() => handleOpenForward(t)}
                              title="Transfer ticket to Super Admin dashboard"
                            >
                              <ArrowRightSquareFill
                                size={12}
                                className="me-1"
                              />
                              Forward
                            </button>

                            {t.status !== "RESOLVED" && (
                              <button
                                className="wm-btn-primary-sm"
                                onClick={() =>
                                  handleToggleStatus(t.id, t.status)
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
                              colSpan={6}
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
                                  Reply to Resident (@{t.username})
                                </label>
                                <textarea
                                  className="form-control mb-3"
                                  rows="3"
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Write resolution steps or information for the resident..."
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

                        {/* Expandable Forward Form */}
                        {isForwardOpen && (
                          <tr>
                            <td
                              colSpan={6}
                              style={{
                                background: "#FEF2F2",
                                padding: "16px 20px",
                              }}
                            >
                              <div className="wm-forward-box">
                                <div
                                  className="d-flex align-items-center gap-2 mb-2 text-danger fw-semibold"
                                  style={{ fontSize: "13.5px" }}
                                >
                                  <ExclamationCircleFill size={15} />
                                  Forward Ticket #TCK-{t.id} to Super Admin
                                </div>
                                <p
                                  className="text-muted mb-2"
                                  style={{ fontSize: "12.5px" }}
                                >
                                  Use this if the issue cannot be resolved at
                                  the community level. The ticket will move to
                                  the Super Admin Dashboard.
                                </p>
                                <textarea
                                  className="form-control mb-3"
                                  rows="2"
                                  value={forwardNote}
                                  onChange={(e) =>
                                    setForwardNote(e.target.value)
                                  }
                                  placeholder="Provide reason for escalation (e.g. System glitch, software bug, platform policy exception)..."
                                ></textarea>
                                <div className="d-flex justify-content-end gap-2">
                                  <button
                                    className="wm-btn-outline"
                                    onClick={() => setActiveForwardId(null)}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    className="wm-btn-danger-sm"
                                    disabled={processing}
                                    onClick={() =>
                                      handleForwardToSuperAdmin(t.id)
                                    }
                                  >
                                    <ArrowRightSquareFill
                                      size={12}
                                      className="me-1"
                                    />
                                    Confirm & Forward to Super Admin
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
        .wm-badge-info { background: #E0F2FE; color: #0369A1; }
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
        .wm-forward-box {
          background: #fff;
          border: 1px solid #FCA5A5;
          border-radius: 12px;
          padding: 16px;
        }
        .wm-btn-primary-sm {
          background: var(--wm-accent, #14B8A6);
          color: #fff;
          border: none;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .wm-btn-warn-sm {
          background: #F59E0B;
          color: #fff;
          border: none;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .wm-btn-danger-sm {
          background: #DC2626;
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
