import Header from "../../../components/Header/Header";
import Footer from "../../Footer/Footer";
import GeneralLoginForm from "../GeneralLoginForm";
import "../../SharedCSS/LoginForms.css";
import { useState } from "react";
import authService from "../../../services/AuthenticationService";
import { showMessage, showError } from "../../shared/services/MessageService";

export default function HospitalLoginPage() {
    const [submitting, setSubmitting] = useState(false);
  
    async function handleLoginSubmit({ identifier, password }) {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await authService.login({
        email: String(identifier || "").trim(),
        password,
      });
      if (res?.token) {
        showMessage("Zalogowano pomyślnie.", "success");
        window.location.assign("/szpital/dashboard");
      } else {
        showError("Logowanie nie powiodło się.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Logowanie nie powiodło się.";
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="bp-section login hospital-login">
        <div className="bp-container">
          <header className="login-head">
            <h1 className="login-title">LOGOWANIE PLACÓWKI SZPITALNEJ</h1>
            <p className="login-lead">Podaj numer placówki i hasło.</p>
          </header>

          <section
            className="login-grid"
            aria-label="Logowanie placówki szpitalnej"
          >
            <GeneralLoginForm
              loginType="LOGOWANIE PLACÓWKI SZPITALNEJ"
              idName="email"
              idType="email"
              idPlaceholder="E-mail placówki szpitalnej"
              passwordPlaceholder="Hasło"
              submitText={submitting ? "Loguję..." : "Zaloguj się"}
              onSubmit={handleLoginSubmit}
            />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
