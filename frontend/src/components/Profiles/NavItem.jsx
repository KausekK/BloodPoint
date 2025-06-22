import { NavLink } from "react-router-dom";

export default function NavItem({ to, icon, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
