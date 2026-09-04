import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { register as registerService } from "../services/authService.js";
import { roleHome } from "../utils/roleHome.js";

const ROLES = [
  { value: "citizen", label: "Citizen" },
  { value: "municipality", label: "Municipality" },
  { value: "recycler", label: "Recycler" },
];

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "citizen",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (status === "error") setStatus("idle");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setStatus("error");
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setStatus("loading");
    try {
      const data = await registerService(formData);
      login(data.token, data.user);
      navigate(roleHome(data.user.role));
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <main className="interior-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-card__header">
            <h1 className="auth-card__title">Create an account</h1>
            <p className="auth-card__subtitle">
              Join CleanLanka to track and manage your reports.
            </p>
          </div>

          {status === "error" && (
            <div className="rf-alert rf-alert--error">
              <span>!</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="rf-group">
              <label className="rf-label" htmlFor="name">
                Name
              </label>
              <input
                className="rf-input"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="rf-group">
              <label className="rf-label" htmlFor="email">
                Email
              </label>
              <input
                className="rf-input"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="rf-group">
              <label className="rf-label" htmlFor="role">
                Account type
              </label>
              <select
                className="rf-input"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="rf-group">
              <label className="rf-label" htmlFor="password">
                Password
              </label>
              <input
                className="rf-input"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password (min 6 characters)"
              />
            </div>

            <button
              type="submit"
              className="rf-btn rf-btn--primary auth-btn"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;
