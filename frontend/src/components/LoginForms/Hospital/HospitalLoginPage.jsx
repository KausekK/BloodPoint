import Header from "../../../components/Header/Header";
import Footer from "../../Footer/Footer";
import GeneralLoginForm from "../GeneralLoginForm";
import '../../SharedCSS/LoginForms.css'

export default function HospitalLoginPage() {
  return (
    <>
      <Header />
      <main className="bp-section login hospital-login">
        <div className="bp-container">
          <header className="login-head">
            <h1 className="login-title">LOGOWANIE PLACÓWKI SZPITALNEJ</h1>
            <p className="login-lead">Podaj numer placówki i hasło.</p>
          </header>

          <section className="login-grid" aria-label="Logowanie placówki szpitalnej">
            <GeneralLoginForm
              loginType="LOGOWANIE PLACÓWKI SZPITALNEJ"
              idName="facilityNumber"
              idType="text"
              idPlaceholder="Numer placówki"
              passwordPlaceholder="Hasło"
              submitText="Zaloguj się"
            />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
