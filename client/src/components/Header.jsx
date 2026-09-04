import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <header className="site-header">
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
        <a href="#impact" onClick={() => setOpen(false)}>
          Impact
        </a>
        <a href="#features" onClick={() => setOpen(false)}>
          Features
        </a>
        <a href="#who" onClick={() => setOpen(false)}>
          Who it serves
        </a>
        
        {user ? (
          <>
            <Link to="/my-reports" onClick={() => setOpen(false)}>
              My Reports
            </Link>
            <button className="nav-cta" onClick={handleLogout}>
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
