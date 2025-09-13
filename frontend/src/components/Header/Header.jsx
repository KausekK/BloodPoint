import { NavLink, Link } from "react-router-dom";
import "./Header.css";
import headerContent from "../../data/Header/Header.json";

export default function Header() {
    const currentRole = "guest";
    const { brand, common, roles, actions } = headerContent;

    const navLinks = [
        ...(common || []),
        ...(roles?.[currentRole] || [])
    ];

    return (
        <header className="header">
            <div className="header__container">
                <Link to={brand.link} className="header__brand" aria-label="Strona główna">
                    {brand.labelMain}
                    <span className="header__brand-accent">{brand.labelAccent}</span>
                </Link>

                <nav className="header__nav" aria-label="Główna nawigacja">
                    {navLinks.map((link) => (
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

                <div className="header__actions">
                    <Link to={actions.guest.to} className="header__btn">
                        {actions.guest.label}
                    </Link>
                </div>
            </div>
        </header>
    );
}
