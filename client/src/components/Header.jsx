import { useState } from "react";
<<<<<<< HEAD
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
=======
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useApp();
  const location = useLocation();
  const onHome = location.pathname === "/";
>>>>>>> origin/vipooshan

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
<<<<<<< HEAD
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
=======
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

        {user ? (
          <>
            <span className="nav-user">{user.name}</span>
            <button
              type="button"
              className="nav-cta"
              onClick={() => {
                setOpen(false);
                logout();
              }}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setOpen(false)}>
              Log in
            </Link>
            <Link to="/register" className="nav-cta" onClick={() => setOpen(false)}>
              Register
            </Link>
          </>
>>>>>>> origin/vipooshan
        )}
      </nav>
    </header>
  );
}

export default Header;
