import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { loginUser } from "../services/api.js";

function Login() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(form);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.message || "Unable to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=1400&q=80"
          alt=""
        />
        <div className="auth-visual-copy">
          <Link to="/" className="auth-brand">
            CleanLanka
          </Link>
          <p>Sign in to report waste, track pickups, and earn recycling rewards.</p>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-panel-inner">
          <p className="section-label">Welcome back</p>
          <h1 className="auth-title">Log in</h1>
          <p className="auth-subtitle">
            Use the email and password for your CleanLanka account.
          </p>

          <form className="auth-form" onSubmit={onSubmit} noValidate>
            {error ? (
              <p className="auth-error" role="alert">
                {error}
              </p>
            ) : null}

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={onChange}
                required
                placeholder="you@example.com"
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={form.password}
                onChange={onChange}
                required
                minLength={6}
                placeholder="••••••••"
              />
            </label>

            <button className="btn btn-dark auth-submit" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Log in"}
            </button>
          </form>

          <p className="auth-switch">
            New to CleanLanka? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
