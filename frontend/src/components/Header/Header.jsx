import { useState, useEffect, useMemo } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import CTA from "../CTA/CTA";
import "./header.css";
import headerContent from "../../content/Header/Header.json";
import authService from "../../services/AuthenticationService";

function getRolesFromToken() {
  const t = authService.getToken?.();
  if (!t) return [];
  try {
    const [, payload] = t.split(".");
    const json = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
    const raw =
      json?.roles ??
      json?.authorities ??
      (typeof json?.scope === "string" ? json.scope.split(" ") : []);
    return Array.isArray(raw) ? raw : [raw].filter(Boolean);
  } catch {
    return [];
  }
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(authService.isAuthenticated());
  const [roles, setRoles] = useState(getRolesFromToken());
  const location = useLocation();
  const navigate = useNavigate();

  const brand = headerContent.brand;
  const common = headerContent.common || [];
  const rolesCfg = headerContent.roles || {};
  const actionsCfg = headerContent.actions;

  const isDonor =
    isAuth &&
    roles.some((r) => r === "DAWCA");

  const currentRole = isDonor ? "donor" : "guest";
  const roleLinks = rolesCfg[currentRole] || [];
  const navLinks = useMemo(() => [...common, ...roleLinks], [common, roleLinks]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", menuOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [menuOpen]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "userToken") {
        setIsAuth(authService.isAuthenticated());
        setRoles(getRolesFromToken());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    authService.logout();
    setIsAuth(false);
    setRoles([]);
    navigate("/login-info");
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to={brand.link} className="brand" aria-label="Strona główna" onClick={closeMenu}>
          {brand.labelMain}
          <span className="brand-accent">{brand.labelAccent}</span>
        </Link>

        <button
          className="menu-toggle"
          aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={menuOpen}
          aria-controls="main-menu"
          onClick={() => setMenuOpen(v => !v)}
        >
          <svg className="menu-toggle-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <nav className="main-nav" aria-label="Główna nawigacja">
          {navLinks.map(link => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"} className="nav-link">
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          {isDonor ? (
            <CTA label="Wyloguj" onClick={handleLogout} />
          ) : (
            <CTA to={actionsCfg.guest.to} label={actionsCfg.guest.label} />
          )}
        </div>
      </div>

      <div className={"menu-overlay" + (menuOpen ? " is-open" : "")} onClick={closeMenu}>
        <div
          className="menu-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="menu-head">
            <span id="mobile-menu-title" className="menu-title">Menu</span>
            <button className="menu-close" aria-label="Zamknij menu" onClick={closeMenu}>✕</button>
          </div>

          <nav id="main-menu" className="menu-list" aria-label="Menu mobilne">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} end={link.to === "/"} className="menu-link" onClick={closeMenu}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="menu-footer">
            {isDonor ? (
              <CTA label="Wyloguj" onClick={() => { closeMenu(); handleLogout(); }} />
            ) : (
              <CTA to={actionsCfg.guest.to} label={actionsCfg.guest.label} onClick={closeMenu} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
