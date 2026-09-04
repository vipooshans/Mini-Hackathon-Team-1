import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { login as loginService } from "../services/authService.js";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (status === "error") setStatus("idle");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setStatus("error");
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setStatus("loading");
    try {
      const data = await loginService(formData.email, formData.password);
      login(data.token, data.user);
      navigate("/my-reports");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <main className="interior-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-card__header">
            <h1 className="auth-card__title">Welcome back</h1>
            <p className="auth-card__subtitle">Sign in to track your waste reports.</p>
          </div>

          {status === "error" && (
            <div className="rf-alert rf-alert--error">
              <span>!</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="rf-group">
              <label className="rf-label" htmlFor="email">Email</label>
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
              <label className="rf-label" htmlFor="password">Password</label>
              <input
                className="rf-input"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="rf-btn rf-btn--primary auth-btn"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
