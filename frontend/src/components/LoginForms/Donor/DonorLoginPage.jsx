import { useState, useMemo } from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../Footer/Footer";
import DonorAuthCard from "./DonorAuthCard";
// import "./DonorLoginPage.css";
import '../../SharedCSS/LoginForms.css'

export default function DonorLoginPage() {
  const [mode, setMode] = useState("login");

  const meta = useMemo(() => {
    switch (mode) {
      case "register":
        return {
          title: "REJESTRACJA DAWCY",
          lead: "Uzupełnij dane, aby założyć konto."
        };
      case "setPassword":
        return {
          title: "USTAW HASŁO",
          lead: "Wpisz hasło dwa razy, aby potwierdzić."
        };
      default:
        return {
          title: "LOGOWANIE DAWCY",
        };
    }
  }, [mode]);

  return (
    <>
      <Header />
      <main className="bp-section login donor-login">
        <div className="bp-container">
          <header className="login-head">
            <h1 className="login-title">{meta.title}</h1>
            <p className="login-lead">{meta.lead}</p>
          </header>

          <div className="auth-center">
            <DonorAuthCard onModeChange={setMode} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
