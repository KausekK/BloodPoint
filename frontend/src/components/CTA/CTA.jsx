import { Link } from "react-router-dom";
import "./CTA.css";

export default function CTA({ label, to, onClick, type = "button" }) {
    if (onClick || type === "submit") {
        return (
            <button type={type} className="cta" onClick={onClick}>
                {label}
            </button>
        );
    }
    return (
        <Link to={to} className="cta">
            {label}
        </Link>
    );
}