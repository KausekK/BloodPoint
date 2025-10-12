import Header from "../../../components/Header/Header";
import Footer from "../../Footer/Footer";
import GeneralLoginForm from "../GeneralLoginForm";
import "./BloodPointLoginPage.css";

export default function BloodPointLoginPage() {
    return (
        <>
            <Header />
            <main className="bp-section login point-login">
                <div className="bp-container">
                    <header className="login-head">
                        <h1 className="login-title">LOGOWANIE PUNKTU KRWIODAWSTWA</h1>
                        <p className="login-lead">Podaj numer punktu i hasło.</p>
                    </header>

                    <section className="login-grid" aria-label="Logowanie punktu krwiodawstwa">
                        <GeneralLoginForm
                            loginType="LOGOWANIE PUNKTU KRWIODAWSTWA"
                            idName="pointNumber"
                            idType="text"
                            idPlaceholder="Numer punktu krwiodawstwa"
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
