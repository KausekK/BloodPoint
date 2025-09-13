import { Link } from "react-router-dom";
import "./CTA.css";

export default function CTA({ label, to, ariaLabel }) {
    return (
        <Link to={to} aria-label={ariaLabel || label} className="cta">
            {label}
        </Link>
    );
}
