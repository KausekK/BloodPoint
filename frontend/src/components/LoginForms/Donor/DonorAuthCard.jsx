import { useEffect, useMemo, useState } from "react";
import CTA from "../../../components/CTA/CTA";
import GeneralLoginForm from "../GeneralLoginForm";
import "./DonorAuthCard.css";

export default function DonorAuthCard({ onModeChange }) {
    const [mode, setMode] = useState("login");

    useEffect(() => {
        onModeChange?.(mode);
    }, [mode, onModeChange]);

    const [reg, setReg] = useState({
        firstName: "",
        lastName: "",
        pesel: "",
        bloodGroup: "",
        phone: "",
        email: "",
        agree: false,
    });

    const [pwd, setPwd] = useState({ pass1: "", pass2: "" });

    const canGoNext = useMemo(() => {
        const { firstName, lastName, pesel, bloodGroup, phone, email, agree } = reg;
        return (
            firstName.trim() &&
            lastName.trim() &&
            pesel.trim().length === 11 &&
            bloodGroup &&
            phone.trim().length >= 6 &&
            /\S+@\S+\.\S+/.test(email) &&
            agree
        );
    }, [reg]);

    const passwordsOk = useMemo(
        () => pwd.pass1.length >= 6 && pwd.pass1 === pwd.pass2,
        [pwd]
    );

    function handleRegChange(e) {
        const { name, value, type, checked } = e.target;
        setReg((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
    }

    function handlePwdChange(e) {
        const { name, value } = e.target;
        setPwd((v) => ({ ...v, [name]: value }));
    }

    function goRegister() {
        setMode("register");
    }
    function backToLogin() {
        setMode("login");
    }
    function goSetPassword(e) {
        e.preventDefault();
        if (canGoNext) setMode("setPassword");
    }
    function submitRegistration(e) {
        e.preventDefault();
        if (!passwordsOk) return;
        // TODO podpiecie backendu
        console.log("REJESTRACJA:", { ...reg, password: pwd.pass1 });
        setMode("login");
    }

    return (
        <div className="donor-auth">
            {mode === "login" && (
                <div className="donor-auth-card">
                    <GeneralLoginForm
                        loginType="LOGOWANIE DAWCY"
                        idName="login"
                        idType="text"
                        idPlaceholder="Login"
                        passwordPlaceholder="Hasło"
                        submitText="Zaloguj się"
                    />
                    <div className="auth-switch">
                        <button type="button" className="auth-link" onClick={goRegister}>
                            Nie masz konta? Zarejestruj się
                        </button>
                    </div>
                </div>
            )}

            {mode === "register" && (
                <article className="bp-card auth-card">
                    <div className="auth-card-cap" aria-hidden="true" />
                    <h2 className="auth-card-title">REJESTRACJA DAWCY</h2>

                    <form className="auth-form" onSubmit={goSetPassword} noValidate>
                        <div className="form-field">
                            <input
                                className="input"
                                name="firstName"
                                placeholder="Imię"
                                value={reg.firstName}
                                onChange={handleRegChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <input
                                className="input"
                                name="lastName"
                                placeholder="Nazwisko"
                                value={reg.lastName}
                                onChange={handleRegChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <input
                                className="input"
                                name="pesel"
                                placeholder="PESEL"
                                maxLength={11}
                                value={reg.pesel}
                                onChange={handleRegChange}
                                required
                                inputMode="numeric"
                            />
                        </div>

                        <div className="form-field">
                            <div className="select-wrap">
                                <select
                                    className="select"
                                    name="bloodGroup"
                                    value={reg.bloodGroup}
                                    onChange={handleRegChange}
                                    required
                                >
                                    <option value="">Grupa krwi</option>
                                    <option>0 Rh+</option><option>0 Rh-</option>
                                    <option>A Rh+</option><option>A Rh-</option>
                                    <option>B Rh+</option><option>B Rh-</option>
                                    <option>AB Rh+</option><option>AB Rh-</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-field">
                            <input
                                className="input"
                                name="phone"
                                placeholder="Numer telefonu"
                                value={reg.phone}
                                onChange={handleRegChange}
                                inputMode="tel"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <input
                                className="input"
                                name="email"
                                type="email"
                                placeholder="E-mail"
                                value={reg.email}
                                onChange={handleRegChange}
                                required
                            />
                        </div>

                        <label className="consent">
                            <input
                                type="checkbox"
                                name="agree"
                                checked={reg.agree}
                                onChange={handleRegChange}
                                required
                            />
                            <span>
                                Oświadczam, że wszystkie podane informacje są zgodne z prawdą.
                            </span>
                        </label>

                        <div className="form-actions">
                            <CTA label="Dalej" type="submit" />
                        </div>

                        <div className="auth-hint">
                            <small>PESEL – 11 cyfr. Hasło ustawisz w następnym kroku.</small>
                        </div>
                    </form>

                    <div className="auth-switch">
                        <button type="button" className="auth-link" onClick={backToLogin}>
                            Masz już konto? Zaloguj się
                        </button>
                    </div>

                    {!canGoNext && (
                        <div className="auth-note">
                            Uzupełnij wymagane pola i zaznacz zgodę.
                        </div>
                    )}
                </article>
            )}

            {mode === "setPassword" && (
                <article className="bp-card auth-card">
                    <div className="auth-card-cap" aria-hidden="true" />
                    <h2 className="auth-card-title">Ustaw hasło</h2>

                    <form className="auth-form" onSubmit={submitRegistration} noValidate>
                        <div className="form-field">
                            <input
                                className="input"
                                type="password"
                                name="pass1"
                                placeholder="Hasło (min. 6 znaków)"
                                value={pwd.pass1}
                                onChange={handlePwdChange}
                                minLength={6}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <input
                                className="input"
                                type="password"
                                name="pass2"
                                placeholder="Powtórz hasło"
                                value={pwd.pass2}
                                onChange={handlePwdChange}
                                minLength={6}
                                required
                            />
                        </div>

                        {!passwordsOk && (
                            <div className="auth-note">
                                Hasła muszą być takie same i mieć co najmniej 6 znaków.
                            </div>
                        )}

                        <div className="form-actions">
                            <CTA label="Zarejestruj się" type="submit" />
                        </div>

                        <div className="auth-switch">
                            <button
                                type="button"
                                className="auth-link"
                                onClick={() => setMode("register")}
                            >
                                Wróć do danych osobowych
                            </button>
                        </div>
                    </form>
                </article>
            )}
        </div>
    );
}
