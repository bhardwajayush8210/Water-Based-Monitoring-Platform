import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  PersonPlusFill,
  PersonFill,
  EnvelopeFill,
  TelephoneFill,
  At,
  KeyFill,
  Building,
  HouseDoorFill,
} from "react-bootstrap-icons";

function ResidentRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    apartment: "",
    flatNumber: "",
  });

  const [apartments, setApartments] = useState([]);
  const [loadingApartments, setLoadingApartments] = useState(true);

  useEffect(() => {
    const loadApartments = async () => {
      try {
        const res = await api.get("/apartments");
        setApartments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingApartments(false);
      }
    };

    loadApartments();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/register", form);

      alert("Registration Successful!");

      console.log(response.data);

      navigate("/resident/login");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 16px",
      }}
    >
      <div className="container" style={{ maxWidth: "500px" }}>
        <div
          className="card border-0 shadow-sm p-4"
          style={{ borderRadius: 18 }}
        >
          <div className="text-center mb-3">
            <div
              className="d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#e9f9ef",
              }}
            >
              <PersonPlusFill size={24} color="#198754" />
            </div>
            <h2 className="mb-1" style={{ fontSize: 22, fontWeight: 700 }}>
              Resident Registration
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: 13.5 }}>
              Create an account to track your water usage and bills
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-3">
            <div className="mb-3">
              <label
                className="form-label text-muted"
                style={{ fontSize: 12.5 }}
              >
                Full Name
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <PersonFill size={14} color="#8a94a6" />
                </span>
                <input
                  type="text"
                  name="fullName"
                  className="form-control border-start-0 ps-0"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label
                className="form-label text-muted"
                style={{ fontSize: 12.5 }}
              >
                Email
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <EnvelopeFill size={14} color="#8a94a6" />
                </span>
                <input
                  type="email"
                  name="email"
                  className="form-control border-start-0 ps-0"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label
                className="form-label text-muted"
                style={{ fontSize: 12.5 }}
              >
                Phone
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <TelephoneFill size={14} color="#8a94a6" />
                </span>
                <input
                  type="text"
                  name="phone"
                  className="form-control border-start-0 ps-0"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-7">
                <label
                  className="form-label text-muted"
                  style={{ fontSize: 12.5 }}
                >
                  Apartment / Community
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <Building size={14} color="#8a94a6" />
                  </span>
                  <select
                    name="apartment"
                    className="form-select border-start-0 ps-0"
                    value={form.apartment}
                    onChange={handleChange}
                    required
                    disabled={loadingApartments}
                  >
                    <option value="" disabled>
                      {loadingApartments
                        ? "Loading apartments..."
                        : apartments.length === 0
                          ? "No apartments available"
                          : "Select your apartment"}
                    </option>
                    {apartments.map((apt) => (
                      <option key={apt.id} value={apt.apartmentName}>
                        {apt.apartmentName}
                        {apt.city ? ` — ${apt.city}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                {!loadingApartments && apartments.length === 0 && (
                  <small className="text-danger">
                    No apartments have been registered yet. Ask your Community
                    Admin to register their community first.
                  </small>
                )}
              </div>

              <div className="col-md-5">
                <label
                  className="form-label text-muted"
                  style={{ fontSize: 12.5 }}
                >
                  Flat Number
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <HouseDoorFill size={14} color="#8a94a6" />
                  </span>
                  <input
                    type="text"
                    name="flatNumber"
                    className="form-control border-start-0 ps-0"
                    placeholder="e.g. A-101"
                    value={form.flatNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label
                className="form-label text-muted"
                style={{ fontSize: 12.5 }}
              >
                Username
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <At size={14} color="#8a94a6" />
                </span>
                <input
                  type="text"
                  name="username"
                  className="form-control border-start-0 ps-0"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                className="form-label text-muted"
                style={{ fontSize: 12.5 }}
              >
                Password
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <KeyFill size={14} color="#8a94a6" />
                </span>
                <input
                  type="password"
                  name="password"
                  className="form-control border-start-0 ps-0"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              className="btn btn-success w-100"
              style={{ borderRadius: 8, height: 44, fontWeight: 500 }}
            >
              Register
            </button>
          </form>

          <p className="text-center mt-4 mb-0" style={{ fontSize: 13.5 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ fontWeight: 500 }}>
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResidentRegister;
