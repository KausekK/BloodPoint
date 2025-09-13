import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import "./Header.css";
import headerContent from "../../data/Header/Header.json";

export default function Header() {
    const [open, setOpen] = useState(false);

    const currentRole = "guest";
    const { brand, common, roles, actions } = headerContent;
    const navLinks = [...(common || []), ...(roles?.[currentRole] || [])];

    // Zamknij drawer po zmianie rozmiaru na desktop
    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth > 768) setOpen(false);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // Blokuj scroll tła kiedy drawer otwarty
    useEffect(() => {
        document.body.classList.toggle("no-scroll", open);
        return () => document.body.classList.remove("no-scroll");
    }, [open]);

    const close = () => setOpen(false);

    return (
        <header className="header">
            <div className="header__container">
                {/* Brand */}
                <Link
                    to={brand.link}
                    className="header__brand"
                    aria-label="Strona główna"
                    onClick={close}
                >
                    {brand.labelMain}
                    <span className="header__brand-accent">{brand.labelAccent}</span>
                </Link>

                {/* Hamburger (mobile) */}
                <button
                    className="header__toggle"
                    aria-label={open ? "Zamknij menu" : "Otwórz menu"}
                    aria-expanded={open}
                    aria-controls="primary-menu"
                    onClick={() => setOpen(v => !v)}
                >
                    <svg className="header__toggle-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                            d="M3 6h18M3 12h18M3 18h18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>

                {/* Nav (desktop) */}
                <nav className="header__nav" aria-label="Główna nawigacja">
                    {navLinks.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === "/"}
                            className="header__link"
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Actions (desktop) */}
                <div className="header__actions">
                    <Link to={actions.guest.to} className="header__btn">
                        {actions.guest.label}
                    </Link>
                </div>
            </div>

            {/* Drawer (mobile) */}
            <div
                className={`header__drawer ${open ? "is-open" : ""}`}
                onClick={close}
            >
                <div
                    className="header__drawer-inner"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="mobile-menu-title"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="header__drawer-head">
                        <span id="mobile-menu-title" className="header__drawer-title">Menu</span>
                        <button
                            className="header__drawer-close"
                            aria-label="Zamknij menu"
                            onClick={close}
                        >
                            ✕
                        </button>
                    </div>

                    <nav id="primary-menu" className="header__drawer-body" aria-label="Menu mobilne">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === "/"}
                                className="header__drawer-link"
                                onClick={close}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="header__drawer-actions">
                        <Link to={actions.guest.to} className="header__btn" onClick={close}>
                            {actions.guest.label}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
