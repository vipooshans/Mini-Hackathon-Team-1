import { Link, useLocation } from "react-router-dom";

const LINKS = [
  { to: "/dashboard", label: "Issue Dashboard" },
  { to: "/admin/recycling-dashboard", label: "Recycling Admin" },
  { to: "/admin/waste-guides", label: "Waste Guides" },
  { to: "/admin/recycling-centers", label: "Recycling Centers" },
  { to: "/admin/center-reports", label: "Center Reports" },
];

/**
 * Shared municipality nav: issue dashboard + recycler management.
 */
function MunicipalityAdminSubnav({ children }) {
  const { pathname } = useLocation();

  return (
    <nav className="admin-subnav" aria-label="Municipality admin">
      {LINKS.map(({ to, label }) => {
        const active =
          to === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === to || pathname.startsWith(`${to}/`);
        return (
          <Link
            key={to}
            to={to}
            className={active ? "admin-subnav__link is-active" : "admin-subnav__link"}
            aria-current={active ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
      {children}
    </nav>
  );
}

export default MunicipalityAdminSubnav;
