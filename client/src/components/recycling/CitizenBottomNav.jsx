import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

/**
 * Mobile bottom nav for citizen recycling flows.
 */
export default function CitizenBottomNav() {
  const { user } = useAuth();
  if (user && user.role !== "citizen") return null;

  return (
    <nav className="citizen-bottom-nav" aria-label="Recycling shortcuts">
      <NavLink to="/" end>
        Home
      </NavLink>
      <NavLink to="/recycling-guide">Guide</NavLink>
      <NavLink to="/recycling-centers">Centers</NavLink>
      <NavLink to="/saved">Saved</NavLink>
      <NavLink to={user ? "/profile" : "/login"}>Profile</NavLink>
    </nav>
  );
}
