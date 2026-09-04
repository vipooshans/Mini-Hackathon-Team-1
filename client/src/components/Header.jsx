import { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [open, setOpen] = useState(false);

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
        <a href="#join" className="nav-cta" onClick={() => setOpen(false)}>
          Get started
        </a>
      </nav>
    </header>
  );
}

export default Header;
