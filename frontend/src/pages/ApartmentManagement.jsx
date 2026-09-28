import { useEffect, useState } from "react";
import api from "../api/api";
import AdminSidebar from "../components/layout/AdminSidebar";
import TopNavbar from "../components/layout/TopNavbar";
import {
  Building,
  GeoAltFill,
  HouseDoorFill,
  PlusCircleFill,
  TrashFill,
} from "react-bootstrap-icons";

function ApartmentManagement() {
  const [apartments, setApartments] = useState([]);
  const [form, setForm] = useState({
    apartmentName: "",
    address: "",
    totalFlats: "",
  });

  const loadApartments = async () => {
    try {
      const res = await api.get("/apartments");
      setApartments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadApartments();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/apartments", form);
      alert("Apartment Added Successfully");
      setForm({ apartmentName: "", address: "", totalFlats: "" });
      loadApartments();
    } catch (err) {
      console.log(err);
      alert("Failed");
    }
  };

  const deleteApartment = async (id) => {
    if (!window.confirm("Delete Apartment?")) return;
    await api.delete(`/apartments/${id}`);
    loadApartments();
  };

  return (
    <>
      <AdminSidebar />
      <TopNavbar
        title="Apartments"
        subtitle="Manage apartment blocks across the platform"
      />

      <div className="wm-page">
        <div className="wm-card mb-3">
          <h6 className="wm-card-title mb-3">Add New Apartment</h6>
          <form onSubmit={handleSubmit}>
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="wm-label">Apartment Name</label>
                <div className="wm-input-group">
                  <Building size={14} className="wm-input-icon" />
                  <input
                    className="wm-input"
                    placeholder="e.g. Green Meadows"
                    name="apartmentName"
                    value={form.apartmentName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-4">
                <label className="wm-label">Address</label>
                <div className="wm-input-group">
                  <GeoAltFill size={14} className="wm-input-icon" />
                  <input
                    className="wm-input"
                    placeholder="Street, city"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-2">
                <label className="wm-label">Total Flats</label>
                <div className="wm-input-group">
                  <HouseDoorFill size={14} className="wm-input-icon" />
                  <input
                    type="number"
                    className="wm-input"
                    placeholder="0"
                    name="totalFlats"
                    value={form.totalFlats}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-2">
                <button className="wm-btn-primary w-100">
                  <PlusCircleFill size={15} />
                  Add
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="wm-card">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <Building size={17} color="var(--wm-accent-dark)" />
              <h6 className="wm-card-title mb-0">All Apartments</h6>
            </div>
            <span className="wm-badge wm-badge-accent">
              {apartments.length} total
            </span>
          </div>

          {apartments.length === 0 ? (
            <div className="text-center py-5">
              <Building size={32} color="#c7d0d9" />
              <p className="wm-muted-text mt-3 mb-0">
                No apartments added yet. Use the form above to add your first
                one.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="wm-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Apartment</th>
                    <th>Address</th>
                    <th>Flats</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {apartments.map((a) => (
                    <tr key={a.id}>
                      <td className="wm-muted-text">#{a.id}</td>
                      <td style={{ fontWeight: 500 }}>{a.apartmentName}</td>
                      <td className="wm-muted-text">{a.address}</td>
                      <td>
                        <span className="wm-badge wm-badge-neutral">
                          {a.totalFlats} flats
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          className="wm-btn-danger-outline"
                          onClick={() => deleteApartment(a.id)}
                        >
                          <TrashFill size={12} />
                          Delete
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
        .wm-label {
          font-size: 12px;
          color: var(--wm-muted, #64748B);
          display: block;
          margin-bottom: 6px;
        }
        .wm-input-group {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--wm-border, #E7EBF1);
          border-radius: 8px;
          padding: 0 10px;
          height: 42px;
        }
        .wm-input-icon { color: #a3adba; flex-shrink: 0; }
        .wm-input {
          border: none;
          outline: none;
          flex: 1;
          font-size: 13.5px;
          height: 100%;
          background: transparent;
        }
        .wm-btn-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--wm-accent);
          color: #fff;
          border: none;
          height: 42px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 13.5px;
          cursor: pointer;
        }
        .wm-btn-primary:hover { background: var(--wm-accent-dark); }
        .wm-muted-text { color: var(--wm-muted, #64748B); font-size: 13.5px; }
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
        .wm-btn-danger-outline {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid var(--wm-danger);
          color: var(--wm-danger);
          background: #fff;
          padding: 5px 12px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 500;
          cursor: pointer;
        }
        .wm-btn-danger-outline:hover { background: var(--wm-danger-soft); }
        @media (max-width: 991px) {
          .wm-page { margin-left: 0; padding: 90px 16px 24px; }
        }
      `}</style>
    </>
  );
}

export default ApartmentManagement;
