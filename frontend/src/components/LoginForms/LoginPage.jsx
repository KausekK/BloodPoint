import { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../Footer/Footer";
import GeneralLoginForm from "./GeneralLoginForm";
import DonorAuthCard from "./Donor/DonorAuthCard";
import "../SharedCSS/LoginForms.css";

export default function LoginPage() {
  const [tab, setTab] = useState("login");

  return (
    <>
      <Header />
      <main className="bp-section login">
        <div className="bp-container">
          <header className="login-head">
            <h1 className="login-title">
              {tab === "login" ? "Zaloguj się" : "Rejestracja dawcy"}
            </h1>
            <p className="login-lead">
              {tab === "login"
                ? "Po zalogowaniu automatycznie przeniesiemy Cię do właściwego panelu."
                : "Uzupełnij dane, a następnie ustaw hasło."}
            </p>
          </header>

          <div className="auth-tabs" role="tablist" aria-label="Logowanie lub rejestracja">
            <button
              role="tab"
              aria-selected={tab === "login"}
              className={`auth-tab ${tab === "login" ? "active" : ""}`}
              onClick={() => setTab("login")}
            >
              Logowanie
            </button>
            <button
              role="tab"
              aria-selected={tab === "register"}
              className={`auth-tab ${tab === "register" ? "active" : ""}`}
              onClick={() => setTab("register")}
            >
              Rejestracja dawcy
            </button>
          </div>

          <section className="login-grid" aria-label={tab === "login" ? "Formularz logowania" : "Formularz rejestracji dawcy"}>
            {tab === "login" ? (
              <GeneralLoginForm />
            ) : (
              <DonorAuthCard initialMode="register" hideLogin />
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
