import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useApp();
  const location = useLocation();
  const onHome = location.pathname === "/";

  return (
<<<<<<< HEAD
    <header className="site-header">
      <a className="brand" href="/" aria-label="CleanLanka home">
        <span className="brand-mark" aria-hidden="true">♻</span>
        <span>CleanLanka</span>
      </a>
      <span className="header-label">Collection schedule</span>
=======
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
        )}
      </nav>
>>>>>>> origin/main
    </header>
  );
}

export default Header;
