import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./BackButton.css";

export default function BackButton({ label = "Wróć", to = null }) {
  const navigate = useNavigate();

  function handleClick() {
    if (to) navigate(to);
    else navigate(-1);
  }

  return (
    <button className="bp-back-btn" onClick={handleClick}>
      <ArrowLeft className="bp-back-icon" />
      <span>{label}</span>
    </button>
  );
}
