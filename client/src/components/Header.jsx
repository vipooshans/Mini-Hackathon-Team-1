import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const onHome = location.pathname === "/";
  const role = user?.role || "citizen";

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  const close = () => setOpen(false);

  const citizenLinks = (
    <>
      <Link to="/report" onClick={close}>
        Report Waste
      </Link>
      <Link to="/schedule" onClick={close}>
        Schedule
      </Link>
      <Link to="/recycling-guide" onClick={close}>
        Recycling Guide
      </Link>
      {user && (
        <>
          <Link to="/my-reports" onClick={close}>
            My Reports
          </Link>
          <Link to="/recycling-centers" onClick={close}>
            Centers
          </Link>
          <Link to="/saved" onClick={close}>
            Saved
          </Link>
          <Link to="/recycler" onClick={close}>
            Pickup
          </Link>
          <Link to="/profile" onClick={close}>
            Profile
          </Link>
        </>
      )}
    </>
  );

  const municipalityLinks = (
    <>
      <Link to="/dashboard" onClick={close}>
        Issue Dashboard
      </Link>
      <Link to="/admin/recycling-dashboard" onClick={close}>
        Recycling Admin
      </Link>
    </>
  );

  const recyclerLinks = (
    <>
      <Link to="/recycler" onClick={close}>
        Pickups
      </Link>
      <Link to="/recycler/center" onClick={close}>
        Center Profile
      </Link>
    </>
  );

  return (
    <header className={`site-header${onHome ? "" : " site-header--solid"}`}>
      <Link to="/" className="site-logo" onClick={close}>
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
            <a href="#impact" onClick={close}>
              Impact
            </a>
            <a href="#features" onClick={close}>
              Features
            </a>
            <a href="#who" onClick={close}>
              Who it serves
            </a>
          </>
        ) : (
          <Link to="/" onClick={close}>
            Home
          </Link>
        )}

        {!user && (
          <>
            <Link to="/report" onClick={close}>
              Report Waste
            </Link>
            <Link to="/schedule" onClick={close}>
              Schedule
            </Link>
            <Link to="/recycling-guide" onClick={close}>
              Recycling Guide
            </Link>
            <Link to="/recycling-centers" onClick={close}>
              Centers
            </Link>
          </>
        )}

        {user && role === "citizen" && citizenLinks}
        {user && role === "municipality" && municipalityLinks}
        {user && role === "recycler" && recyclerLinks}

        {user ? (
          <button type="button" className="nav-cta" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/login" className="nav-cta" onClick={close}>
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
