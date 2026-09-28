import { useState } from "react";
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
  GeoAltFill,
  HouseDoorFill,
} from "react-bootstrap-icons";

function CommunityAdminRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    apartment: "",
    apartmentAddress: "",
    city: "",
    state: "",
    pincode: "",
    totalHouseholds: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        totalHouseholds: form.totalHouseholds
          ? parseInt(form.totalHouseholds, 10)
          : null,
      };

      const response = await api.post("/community/register", payload);

      alert(
        "Registration Successful! Your account is pending approval from a Super Admin before you can manage your community.",
      );

      console.log(response.data);

      navigate("/community/login");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
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
      <div className="container" style={{ maxWidth: "540px" }}>
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
              Community Admin Registration
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: 13.5 }}>
              Register your community to start managing residents and billing
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-3">
            {/* Section: Personal Details */}
            <p
              className="text-uppercase text-muted mb-2"
              style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}
            >
              Personal Details
            </p>

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

            <div className="row g-3 mb-3">
              <div className="col-md-6">
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

              <div className="col-md-6">
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
            </div>

            {/* Section: Community Details */}
            <p
              className="text-uppercase text-muted mb-2 mt-4"
              style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}
            >
              Community Details
            </p>

            <div className="mb-3">
              <label
                className="form-label text-muted"
                style={{ fontSize: 12.5 }}
              >
                Apartment / Community Name
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Building size={14} color="#8a94a6" />
                </span>
                <input
                  type="text"
                  name="apartment"
                  className="form-control border-start-0 ps-0"
                  placeholder="e.g. Green Meadows"
                  value={form.apartment}
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
                Apartment Address
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <GeoAltFill size={14} color="#8a94a6" />
                </span>
                <input
                  type="text"
                  name="apartmentAddress"
                  className="form-control border-start-0 ps-0"
                  placeholder="Street, locality"
                  value={form.apartmentAddress}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-5">
                <label
                  className="form-label text-muted"
                  style={{ fontSize: 12.5 }}
                >
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label
                  className="form-label text-muted"
                  style={{ fontSize: 12.5 }}
                >
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  className="form-control"
                  value={form.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label
                  className="form-label text-muted"
                  style={{ fontSize: 12.5 }}
                >
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  className="form-control"
                  value={form.pincode}
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
                Total Households
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <HouseDoorFill size={14} color="#8a94a6" />
                </span>
                <input
                  type="number"
                  name="totalHouseholds"
                  min="1"
                  className="form-control border-start-0 ps-0"
                  placeholder="e.g. 120"
                  value={form.totalHouseholds}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Section: Account Credentials */}
            <p
              className="text-uppercase text-muted mb-2 mt-4"
              style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}
            >
              Account Credentials
            </p>

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
                  minLength={6}
                />
              </div>
            </div>

            <button
              className="btn btn-success w-100"
              style={{ borderRadius: 8, height: 44, fontWeight: 500 }}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
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

export default CommunityAdminRegister;
