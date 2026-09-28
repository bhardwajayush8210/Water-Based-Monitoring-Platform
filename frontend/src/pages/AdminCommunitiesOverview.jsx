import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import AdminSidebar from "../components/layout/AdminSidebar";
import TopNavbar from "../components/layout/TopNavbar";
import {
  Building,
  PeopleFill,
  PersonCircle,
  TelephoneFill,
  EnvelopeFill,
  ArrowLeft,
  GeoAltFill,
  DropletFill,
  PencilFill,
  TrashFill,
  CheckLg,
  XLg,
} from "react-bootstrap-icons";

function AdminCommunitiesOverview() {
  const navigate = useNavigate();

  const [apartments, setApartments] = useState([]);
  const [loadingApartments, setLoadingApartments] = useState(true);
  const [apartmentsError, setApartmentsError] = useState("");

  const [selectedApartment, setSelectedApartment] = useState(null);
  const [residents, setResidents] = useState([]);
  const [loadingResidents, setLoadingResidents] = useState(false);
  const [residentsError, setResidentsError] = useState("");

  const [editingAdmin, setEditingAdmin] = useState(false);
  const [adminForm, setAdminForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [savingAdmin, setSavingAdmin] = useState(false);

  const [editingResidentId, setEditingResidentId] = useState(null);
  const [residentForm, setResidentForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    flatNumber: "",
  });
  const [savingResident, setSavingResident] = useState(false);

  const loadApartments = async () => {
    setLoadingApartments(true);
    setApartmentsError("");
    try {
      const res = await api.get("/apartments");
      setApartments(res.data);
    } catch (err) {
      console.error(err);
      setApartmentsError("Failed to load communities.");
    } finally {
      setLoadingApartments(false);
    }
  };

  useEffect(() => {
    loadApartments();
  }, []);

  const openCommunity = async (apartment) => {
    setSelectedApartment(apartment);
    setEditingAdmin(false);
    setAdminForm({
      fullName: apartment.communityAdmin?.fullName || "",
      email: apartment.communityAdmin?.email || "",
      phone: apartment.communityAdmin?.phone || "",
    });
    setLoadingResidents(true);
    setResidentsError("");
    setResidents([]);
    try {
      const res = await api.get(`/admin/apartments/${apartment.id}/residents`);
      setResidents(res.data);
    } catch (err) {
      console.error(err);
      setResidentsError(
        err.response?.data?.message || "Failed to load residents.",
      );
    } finally {
      setLoadingResidents(false);
    }
  };

  const backToList = () => {
    setSelectedApartment(null);
    setResidents([]);
    setResidentsError("");
  };

  const handleSaveAdmin = async () => {
    setSavingAdmin(true);
    try {
      await api.put(
        `/admin/community-admins/${selectedApartment.communityAdmin.id}`,
        adminForm,
      );
      setSelectedApartment({
        ...selectedApartment,
        communityAdmin: { ...selectedApartment.communityAdmin, ...adminForm },
      });
      setEditingAdmin(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update Community Admin.");
    } finally {
      setSavingAdmin(false);
    }
  };

  const handleDeleteAdmin = async () => {
    if (
      !window.confirm(
        `Delete ${selectedApartment.communityAdmin?.fullName || "this admin"} and their community "${selectedApartment.apartmentName}"? This cannot be undone. Residents will remain in the system but unassigned.`,
      )
    )
      return;
    try {
      await api.delete(
        `/admin/community-admins/${selectedApartment.communityAdmin.id}`,
      );
      backToList();
      loadApartments();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete Community Admin.");
    }
  };

  const startEditResident = (r) => {
    setEditingResidentId(r.id);
    setResidentForm({
      fullName: r.fullName || "",
      email: r.email || "",
      phone: r.phone || "",
      flatNumber: r.flatNumber || "",
    });
  };

  const handleSaveResident = async (id) => {
    setSavingResident(true);
    try {
      await api.put(`/admin/residents/${id}`, residentForm);
      setResidents(
        residents.map((r) => (r.id === id ? { ...r, ...residentForm } : r)),
      );
      setEditingResidentId(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update resident.");
    } finally {
      setSavingResident(false);
    }
  };

  const handleDeleteResident = async (r) => {
    if (
      !window.confirm(`Delete resident ${r.fullName}? This cannot be undone.`)
    )
      return;
    try {
      await api.delete(`/auth/residents/${r.id}`);
      setResidents(residents.filter((x) => x.id !== r.id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete resident.");
    }
  };

  return (
    <>
      <AdminSidebar />
      <TopNavbar
        title={
          selectedApartment ? selectedApartment.apartmentName : "Communities"
        }
        subtitle={
          selectedApartment
            ? "Full community detail"
            : "Select a community to view details"
        }
      />

      <div className="wm-page">
        {selectedApartment ? (
          <>
            <button className="wm-back-btn mb-3" onClick={backToList}>
              <ArrowLeft size={13} />
              Back to all communities
            </button>

            {/* Community Admin detail card */}
            <div className="wm-card mb-3">
              <div className="d-flex align-items-start justify-content-between flex-wrap gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="wm-community-icon-lg">
                    <Building size={22} />
                  </div>
                  <div>
                    <h5 className="wm-apt-name">
                      {selectedApartment.apartmentName}
                    </h5>
                    <p className="wm-muted-text mb-0">
                      <GeoAltFill size={11} className="me-1" />
                      {selectedApartment.address
                        ? `${selectedApartment.address}, `
                        : ""}
                      {selectedApartment.city}
                      {selectedApartment.state
                        ? `, ${selectedApartment.state}`
                        : ""}
                      {selectedApartment.pincode
                        ? ` - ${selectedApartment.pincode}`
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="wm-badge wm-badge-neutral">
                    {selectedApartment.totalFlats ?? "—"} total flats
                  </span>
                  {!editingAdmin && (
                    <button
                      className="wm-icon-btn"
                      title="Delete Community Admin"
                      onClick={handleDeleteAdmin}
                    >
                      <TrashFill size={13} />
                    </button>
                  )}
                </div>
              </div>

              {editingAdmin ? (
                <div className="wm-admin-edit-row">
                  <input
                    className="wm-inline-input"
                    placeholder="Full name"
                    value={adminForm.fullName}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, fullName: e.target.value })
                    }
                  />
                  <input
                    className="wm-inline-input"
                    placeholder="Email"
                    value={adminForm.email}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, email: e.target.value })
                    }
                  />
                  <input
                    className="wm-inline-input"
                    placeholder="Phone"
                    value={adminForm.phone}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, phone: e.target.value })
                    }
                  />
                  <button
                    className="wm-icon-btn wm-icon-btn-success"
                    onClick={handleSaveAdmin}
                    disabled={savingAdmin}
                  >
                    <CheckLg size={13} />
                  </button>
                  <button
                    className="wm-icon-btn"
                    onClick={() => setEditingAdmin(false)}
                  >
                    <XLg size={13} />
                  </button>
                </div>
              ) : (
                <div className="wm-admin-detail-row">
                  <PersonCircle size={16} color="#c7d0d9" />
                  <span>
                    Managed by{" "}
                    <strong>
                      {selectedApartment.communityAdmin?.fullName || "—"}
                    </strong>
                  </span>
                  {selectedApartment.communityAdmin?.email && (
                    <span className="wm-admin-contact">
                      <EnvelopeFill size={11} className="me-1" />
                      {selectedApartment.communityAdmin.email}
                    </span>
                  )}
                  {selectedApartment.communityAdmin?.phone && (
                    <span className="wm-admin-contact">
                      <TelephoneFill size={11} className="me-1" />
                      {selectedApartment.communityAdmin.phone}
                    </span>
                  )}
                  <button
                    className="wm-icon-btn ms-auto"
                    title="Edit Community Admin"
                    onClick={() => setEditingAdmin(true)}
                  >
                    <PencilFill size={12} />
                  </button>
                </div>
              )}
            </div>

            <div className="wm-card">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <PeopleFill size={17} color="var(--wm-accent-dark)" />
                  <h6 className="wm-card-title mb-0">Residents</h6>
                </div>
                <span className="wm-badge wm-badge-accent">
                  {residents.length} total
                </span>
              </div>

              {loadingResidents ? (
                <div className="text-center py-5">
                  <div
                    className="spinner-border"
                    style={{ color: "var(--wm-accent)" }}
                    role="status"
                  />
                </div>
              ) : residentsError ? (
                <div className="text-center py-5">
                  <p style={{ color: "var(--wm-danger)", fontSize: 14 }}>
                    {residentsError}
                  </p>
                  <button
                    className="wm-btn-outline"
                    onClick={() => openCommunity(selectedApartment)}
                  >
                    Retry
                  </button>
                </div>
              ) : residents.length === 0 ? (
                <div className="text-center py-5">
                  <PeopleFill size={32} color="#c7d0d9" />
                  <p className="wm-muted-text mt-3 mb-0">
                    No residents registered under this community yet.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="wm-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Flat</th>
                        <th>Phone</th>
                        <th>Today's Usage</th>
                        <th>7-Day Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {residents.map((r) =>
                        editingResidentId === r.id ? (
                          <tr key={r.id}>
                            <td>
                              <input
                                className="wm-inline-input"
                                value={residentForm.fullName}
                                onChange={(e) =>
                                  setResidentForm({
                                    ...residentForm,
                                    fullName: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td className="wm-muted-text">@{r.username}</td>
                            <td>
                              <input
                                className="wm-inline-input"
                                style={{ width: 70 }}
                                value={residentForm.flatNumber}
                                onChange={(e) =>
                                  setResidentForm({
                                    ...residentForm,
                                    flatNumber: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                className="wm-inline-input"
                                value={residentForm.phone}
                                onChange={(e) =>
                                  setResidentForm({
                                    ...residentForm,
                                    phone: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td colSpan={2}>
                              <input
                                className="wm-inline-input"
                                placeholder="Email"
                                value={residentForm.email}
                                onChange={(e) =>
                                  setResidentForm({
                                    ...residentForm,
                                    email: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <button
                                  className="wm-icon-btn wm-icon-btn-success"
                                  onClick={() => handleSaveResident(r.id)}
                                  disabled={savingResident}
                                >
                                  <CheckLg size={13} />
                                </button>
                                <button
                                  className="wm-icon-btn"
                                  onClick={() => setEditingResidentId(null)}
                                >
                                  <XLg size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <tr key={r.id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <PersonCircle size={24} color="#c7d0d9" />
                                <span style={{ fontWeight: 500 }}>
                                  {r.fullName}
                                </span>
                              </div>
                            </td>
                            <td className="wm-muted-text">@{r.username}</td>
                            <td>
                              <span className="wm-badge wm-badge-neutral">
                                {r.flatNumber || "—"}
                              </span>
                            </td>
                            <td className="wm-muted-text">
                              <TelephoneFill size={11} className="me-1" />
                              {r.phone}
                            </td>
                            <td>
                              {r.todayUsage != null ? (
                                <span className="wm-usage-value">
                                  <DropletFill size={11} className="me-1" />
                                  {r.todayUsage} L
                                </span>
                              ) : (
                                <span className="wm-muted-text">
                                  Not logged
                                </span>
                              )}
                            </td>
                            <td>
                              {r.weeklyTotalUsage != null ? (
                                <span className="wm-usage-value">
                                  {r.weeklyTotalUsage} L
                                </span>
                              ) : (
                                <span className="wm-muted-text">—</span>
                              )}
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <button
                                  className="wm-icon-btn"
                                  title="Edit"
                                  onClick={() => startEditResident(r)}
                                >
                                  <PencilFill size={12} />
                                </button>
                                <button
                                  className="wm-icon-btn"
                                  title="Delete"
                                  onClick={() => handleDeleteResident(r)}
                                >
                                  <TrashFill size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {loadingApartments ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border"
                  style={{ color: "var(--wm-accent)" }}
                  role="status"
                />
              </div>
            ) : apartmentsError ? (
              <div className="text-center py-5">
                <p style={{ color: "var(--wm-danger)", fontSize: 14 }}>
                  {apartmentsError}
                </p>
                <button className="wm-btn-outline" onClick={loadApartments}>
                  Retry
                </button>
              </div>
            ) : apartments.length === 0 ? (
              <div className="text-center py-5">
                <Building size={32} color="#c7d0d9" />
                <p className="wm-muted-text mt-3 mb-0">
                  No communities registered yet.
                </p>
              </div>
            ) : (
              <div className="row g-3">
                {apartments.map((apt) => (
                  <div className="col-md-6 col-lg-4" key={apt.id}>
                    <div
                      className="wm-community-card"
                      onClick={() => openCommunity(apt)}
                    >
                      <div className="d-flex align-items-start justify-content-between mb-3">
                        <div className="wm-community-icon">
                          <Building size={18} />
                        </div>
                        <span className="wm-badge wm-badge-neutral">
                          {apt.totalFlats ?? "—"} flats
                        </span>
                      </div>

                      <h6 className="wm-community-name">{apt.apartmentName}</h6>

                      <p className="wm-community-loc">
                        <GeoAltFill size={11} />
                        {apt.city || "—"}
                        {apt.state ? `, ${apt.state}` : ""}
                      </p>

                      <div className="wm-community-admin">
                        <PersonCircle size={15} color="#c7d0d9" />
                        Admin:{" "}
                        <strong>
                          {apt.communityAdmin?.fullName ||
                            apt.communityAdmin?.username ||
                            "—"}
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
        .wm-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          border: 1px solid var(--wm-border, #E7EBF1);
          color: var(--wm-ink, #0F172A);
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
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
        .wm-apt-name {
          font-family: var(--wm-font-display, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: 18px;
          color: var(--wm-ink, #0F172A);
          margin-bottom: 2px;
        }
        .wm-community-icon-lg {
          width: 48px;
          height: 48px;
          border-radius: 13px;
          background: var(--wm-accent-soft);
          color: var(--wm-accent-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wm-admin-detail-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          font-size: 13px;
          color: var(--wm-muted, #64748B);
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--wm-border, #E7EBF1);
        }
        .wm-admin-edit-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--wm-border, #E7EBF1);
        }
        .wm-admin-contact {
          margin-left: 14px;
          padding-left: 14px;
          border-left: 1px solid var(--wm-border, #E7EBF1);
        }
        .wm-muted-text { color: var(--wm-muted, #64748B); font-size: 13.5px; }
        .wm-usage-value { font-family: var(--wm-font-mono, monospace); font-weight: 600; font-size: 13px; color: var(--wm-ink, #0F172A); }
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
        .wm-icon-btn {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          border: 1px solid var(--wm-border, #E7EBF1);
          background: #fff;
          color: var(--wm-muted, #64748B);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
        }
        .wm-icon-btn:hover { border-color: var(--wm-danger); color: var(--wm-danger); background: var(--wm-danger-soft, #FDECEC); }
        .wm-icon-btn-success { border-color: var(--wm-success, #22C55E); color: var(--wm-success, #22C55E); }
        .wm-icon-btn-success:hover { background: var(--wm-success-soft, #E9F9EF); border-color: var(--wm-success, #22C55E); color: var(--wm-success, #22C55E); }
        .wm-inline-input {
          border: 1px solid var(--wm-border, #E7EBF1);
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 13px;
          height: 34px;
          flex: 1;
          min-width: 100px;
        }
        .wm-inline-input:focus { outline: none; border-color: var(--wm-accent); }
        .wm-community-card {
          background: #fff;
          border: 1px solid var(--wm-border, #E7EBF1);
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          transition: border-color 0.15s ease, transform 0.15s ease;
        }
        .wm-community-card:hover { border-color: var(--wm-accent); transform: translateY(-1px); }
        .wm-community-icon {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          background: var(--wm-accent-soft);
          color: var(--wm-accent-dark);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wm-community-name {
          font-family: var(--wm-font-display, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: 15.5px;
          color: var(--wm-ink, #0F172A);
          margin-bottom: 6px;
        }
        .wm-community-loc {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          color: var(--wm-muted, #64748B);
          margin-bottom: 12px;
        }
        .wm-community-admin {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          color: var(--wm-muted, #64748B);
          padding-top: 12px;
          border-top: 1px solid var(--wm-border, #E7EBF1);
        }
        @media (max-width: 991px) {
          .wm-page { margin-left: 0; padding: 90px 16px 24px; }
        }
      `}</style>
    </>
  );
}

export default AdminCommunitiesOverview;
