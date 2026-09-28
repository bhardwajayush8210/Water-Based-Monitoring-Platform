import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { ShieldLockFill, PersonFill, KeyFill } from "react-bootstrap-icons";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", form);

      if (response.data.role !== "ADMIN") {
        alert("This login is for Super Admin accounts only.");
        return;
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("username", response.data.username);

      alert("Login Successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Invalid Username or Password");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", background: "#f5f7fb" }}
    >
      <div className="container" style={{ maxWidth: "440px" }}>
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
                background: "#fdeeea",
              }}
            >
              <ShieldLockFill size={24} color="#dc3545" />
            </div>
            <h2 className="mb-1" style={{ fontSize: 22, fontWeight: 700 }}>
              Super Admin Login
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: 13.5 }}>
              Restricted access — authorized personnel only
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-3">
            <div className="mb-3">
              <label
                className="form-label text-muted"
                style={{ fontSize: 12.5 }}
              >
                Username
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <PersonFill size={14} color="#8a94a6" />
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
              className="btn btn-danger w-100"
              style={{ borderRadius: 8, height: 44, fontWeight: 500 }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
