import { Link } from "react-router-dom";
import "./CTA.css";

export default function CTA({ label, to }) {
    return (
        <Link to={to} className="cta">
            {label}
        </Link>
    );
}