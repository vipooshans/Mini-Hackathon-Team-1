import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const onHome = location.pathname === "/";

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <header className={`site-header${onHome ? "" : " site-header--solid"}`}>
      <Link to="/" className="site-logo" onClick={() => setOpen(false)}>
        CleanLanka
      </Link>

      <button
        type="button"
        className="nav-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "×" : "☰"}
      </button>

      <nav className={`site-nav${open ? " is-open" : ""}`} aria-label="Primary">
        {onHome ? (
          <>
            <a href="#impact" onClick={() => setOpen(false)}>
              Impact
            </a>
            <a href="#features" onClick={() => setOpen(false)}>
              Features
            </a>
            <a href="#who" onClick={() => setOpen(false)}>
              Who it serves
            </a>
          </>
        ) : (
          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>
        )}

        {user?.role === "municipality" && (
          <Link to="/dashboard" onClick={() => setOpen(false)}>
            Dashboard
          </Link>
        )}

        {user ? (
          <>
            <Link to="/my-reports" onClick={() => setOpen(false)}>
              My Reports
            </Link>
            <button type="button" className="nav-cta" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-cta" onClick={() => setOpen(false)}>
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
