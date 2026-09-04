import { useState } from "react";
import { NavLink } from "react-router-dom";

/**
 * Navbar — site-wide navigation for CleanLanka.
 *
 * Links to all 5 routes (Home, Report, Schedule, Guide, Dashboard).
 * Collapses to a hamburger menu below 600px (handled via CSS).
 * All touch targets ≥ 44×44px.
 *
 * Teammates: to add a new route, just add another <li> + <NavLink>.
 */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand" onClick={closeMenu}>
          🌿 CleanLanka
        </NavLink>

        {/* Hamburger toggle — visible below 600px via CSS */}
        <button
          className="navbar__toggle"
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <ul className={`navbar__links${menuOpen ? " navbar__links--open" : ""}`}>
          <li>
            <NavLink to="/" end onClick={closeMenu}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/report" onClick={closeMenu}>
              Report Issue
            </NavLink>
          </li>
          <li>
            <NavLink to="/schedule" onClick={closeMenu}>
              Schedule
            </NavLink>
          </li>
          <li>
            <NavLink to="/guide" onClick={closeMenu}>
              Disposal Guide
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" onClick={closeMenu}>
              Dashboard
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
