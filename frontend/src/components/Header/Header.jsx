import { useState, useEffect } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import CTA from "../CTA/CTA";
import "./header.css";
import headerContent from "../../content/Header/Header.json";
import authService from "../../services/AuthenticationService";

function getRolesFromToken() {
  const getTokenFn = authService.getToken;

  if (typeof getTokenFn !== "function") {
    return [];
  }

  const token = getTokenFn();
  if (!token) {
    return [];
  }

  try {
    const parts = token.split(".");
    if (parts.length < 2) {
      return [];
    }

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonString = atob(base64);
    const data = JSON.parse(jsonString);

    let rawRoles = null;

    if (data && data.roles) {
      rawRoles = data.roles;
    } else if (data && data.authorities) {
      rawRoles = data.authorities;
    } else if (data && typeof data.scope === "string") {
      rawRoles = data.scope.split(" ");
    }

    if (!rawRoles) {
      return [];
    }

    if (Array.isArray(rawRoles)) {
      return rawRoles;
    }

    const arr = [rawRoles];
    return arr.filter(Boolean);
  } catch (error) {
    return [];
  }
}

function getCurrentRole(isAuth, roles) {
  if (!isAuth || !roles || roles.length === 0) {
    return "guest";
  }

  const roleMap = {
    DAWCA: "donor",
    PUNKT_KRWIODAWSTWA: "bloodPoint",
    SZPITAL: "hospital",
    ADMIN: "admin",
  };

  for (let i = 0; i < roles.length; i++) {
    const roleName = roles[i];
    if (roleMap[roleName]) {
      return roleMap[roleName];
    }
  }

  return "guest";
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(authService.isAuthenticated());
  const [roles, setRoles] = useState(getRolesFromToken());

  const location = useLocation();
  const navigate = useNavigate();

  const brand = headerContent.brand || {
    link: "/",
    labelMain: "Blood",
    labelAccent: "Point",
  };

  const actionsConfig = headerContent.actions || {};
  if (!actionsConfig.guest) {
    actionsConfig.guest = { to: "/login", label: "Zaloguj" };
  }

  const currentRole = getCurrentRole(isAuth, roles);

  const commonLinks = headerContent.common || [];
  const rolesConfig = headerContent.roles || {};
  const roleLinks = rolesConfig[currentRole] || [];
  const navLinks = commonLinks.concat(roleLinks);

  useEffect(function () {
    function handleResize() {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return function () {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(
    function () {
      if (menuOpen) {
        document.body.classList.add("no-scroll");
      } else {
        document.body.classList.remove("no-scroll");
      }

      return function () {
        document.body.classList.remove("no-scroll");
      };
    },
    [menuOpen]
  );

  useEffect(function () {
    function handleStorage(event) {
      if (event.key === "userToken") {
        setIsAuth(authService.isAuthenticated());
        setRoles(getRolesFromToken());
      }
    }

    window.addEventListener("storage", handleStorage);
    return function () {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(
    function () {
      setMenuOpen(false);
    },
    [location.pathname]
  );

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleMenu() {
    setMenuOpen(function (prev) {
      return !prev;
    });
  }

  function handleLogout() {
    authService.logout();
    setIsAuth(false);
    setRoles([]);
    navigate("/login");
  }

  function handleOverlayClick() {
    closeMenu();
  }

  function handleMenuPanelClick(event) {
    event.stopPropagation();
  }

  function handleMobileLogout() {
    closeMenu();
    handleLogout();
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link
          to={brand.link}
          className="brand"
          aria-label="Strona główna"
          onClick={closeMenu}
        >
          {brand.labelMain}
          <span className="brand-accent">{brand.labelAccent}</span>
        </Link>

        <button
          className="menu-toggle"
          aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={menuOpen}
          aria-controls="main-menu"
          onClick={toggleMenu}
        >
          <svg
            className="menu-toggle-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M3 6h18M3 12h18M3 18h18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <nav className="main-nav" aria-label="Główna nawigacja">
          {isAuth && (
            <NavLink to="/profil" className="nav-link">
              Profil
            </NavLink>
          )}
          {navLinks.map(function (link) {
            const isRoot = link.to === "/";

            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={isRoot}
                className="nav-link"
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="header-actions">
          {isAuth ? (
            <CTA label="Wyloguj" onClick={handleLogout} />
          ) : (
            <CTA
              to={actionsConfig.guest.to}
              label={actionsConfig.guest.label}
            />
          )}
        </div>
      </div>

      <div
        className={"menu-overlay" + (menuOpen ? " is-open" : "")}
        onClick={handleOverlayClick}
      >
        <div
          className="menu-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
          onClick={handleMenuPanelClick}
        >
          <div className="menu-head">
            <span id="mobile-menu-title" className="menu-title">
              Menu
            </span>
            <button
              className="menu-close"
              aria-label="Zamknij menu"
              onClick={closeMenu}
            >
              ✕
            </button>
          </div>

          <nav
            id="main-menu"
            className="menu-list"
            aria-label="Menu mobilne"
          >
            {isAuth && (
              <NavLink to="/profil" className="menu-link" onClick={closeMenu}>
                Profil
              </NavLink>
            )}

            {navLinks.map(function (link) {
              const isRoot = link.to === "/";

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={isRoot}
                  className="menu-link"
                  onClick={closeMenu}
                >
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="menu-footer">
            {isAuth ? (
              <CTA label="Wyloguj" onClick={handleMobileLogout} />
            ) : (
              <CTA
                to={actionsConfig.guest.to}
                label={actionsConfig.guest.label}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
