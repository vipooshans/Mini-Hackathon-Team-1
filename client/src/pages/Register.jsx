import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { registerUser } from "../services/api.js";

const ROLES = [
  { value: "citizen", label: "Citizen" },
  { value: "municipality", label: "Municipality" },
  { value: "recycler", label: "Recycler" },
];

function Register() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "citizen",
    phone: "",
    district: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      const data = await registerUser(payload);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1400&q=80"
          alt=""
        />
        <div className="auth-visual-copy">
          <Link to="/" className="auth-brand">
            CleanLanka
          </Link>
          <p>
            Join citizens, councils, and recyclers building a cleaner Sri Lanka.
          </p>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-panel-inner">
          <p className="section-label">Get started</p>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">
            Register once — report issues, follow collection schedules, and
            connect with recyclers.
          </p>

          <form className="auth-form" onSubmit={onSubmit} noValidate>
            {error ? (
              <p className="auth-error" role="alert">
                {error}
              </p>
            ) : null}

            <label className="field">
              <span>Full name</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={onChange}
                required
                placeholder="Your name"
              />
            </label>

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

            <div className="field-row">
              <label className="field">
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={onChange}
                  required
                  minLength={6}
                  placeholder="Min. 6 characters"
                />
              </label>

              <label className="field">
                <span>Confirm password</span>
                <input
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={onChange}
                  required
                  minLength={6}
                  placeholder="Repeat password"
                />
              </label>
            </div>

            <fieldset className="role-fieldset">
              <legend>I am a</legend>
              <div className="role-options">
                {ROLES.map((role) => (
                  <label key={role.value} className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={form.role === role.value}
                      onChange={onChange}
                    />
                    <span>{role.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="field-row">
              <label className="field">
                <span>Phone (optional)</span>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="07X XXX XXXX"
                />
              </label>

              <label className="field">
                <span>District (optional)</span>
                <input
                  type="text"
                  name="district"
                  value={form.district}
                  onChange={onChange}
                  placeholder="e.g. Colombo"
                />
              </label>
            </div>

            <button className="btn btn-dark auth-submit" type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
