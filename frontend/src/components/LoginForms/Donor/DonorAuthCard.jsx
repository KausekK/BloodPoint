import { useMemo, useState } from "react";
import CTA from "../../../components/CTA/CTA";
import "../../SharedCSS/LoginForms.css";
import authService from "../../../services/AuthenticationService";
import { showMessage, showError } from "../../shared/services/MessageService";
import { ROLES } from "../../shared/const/Roles";
import { MessageType } from "../../shared/const/MessageType.model";

export default function DonorAuthCard() {
  const [mode, setMode] = useState("register");
  const [submitting, setSubmitting] = useState(false);

  const [reg, setReg] = useState({
    firstName: "",
    lastName: "",
    pesel: "",
    phone: "",
    email: "",
    gender: "",
    birthDate: "",
    agree: false,
  });

  const [pwd, setPwd] = useState({ pass1: "", pass2: "" });

  const canGoNext = useMemo(() => {
    const { firstName, lastName, pesel, phone, email, agree, gender, birthDate } = reg;
    return (
      firstName.trim() &&
      lastName.trim() &&
      pesel.trim().length === 11 &&
      phone.trim().length >= 6 &&
      /\S+@\S+\.\S+/.test(email) &&
      (gender === "K" || gender === "M") &&
      birthDate.trim() &&
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

  function goSetPassword(e) {
    e.preventDefault();
    if (canGoNext) setMode("setPassword");
  }

  async function submitRegistration(e) {
    e.preventDefault();
    if (!passwordsOk || submitting) return;

    setSubmitting(true);
    try {
      await authService.register({
        firstName: reg.firstName.trim(),
        lastName: reg.lastName.trim(),
        email: reg.email.trim(),
        pesel: reg.pesel.trim(),
        phone: reg.phone.trim(),
        gender: reg.gender,
        birthDate: reg.birthDate,
        role: ROLES.DAWCA,
        password: pwd.pass1,
      });
      showMessage("Konto zostało utworzone. Możesz się teraz zalogować.", MessageType.SUCCESS);

      setReg({
        firstName: "",
        lastName: "",
        pesel: "",
        phone: "",
        email: "",
        gender: "",
        birthDate: "",
        agree: false,
      });
      setPwd({ pass1: "", pass2: "" });
      setMode("register");
      window.location.assign("/login");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Rejestracja nie powiodła się.";
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="donor-auth">
      {mode === "register" && (
        <article className="bp-card auth-card">
          <div className="auth-card-cap" aria-hidden="true" />
          <h2 className="auth-card-title">REJESTRACJA DAWCY</h2>

          <form className="auth-form" onSubmit={goSetPassword} noValidate>
            <div className="form-field">
              <input className="input" name="firstName" placeholder="Imię" value={reg.firstName} onChange={handleRegChange} required />
            </div>

            <div className="form-field">
              <input className="input" name="lastName" placeholder="Nazwisko" value={reg.lastName} onChange={handleRegChange} required />
            </div>

            <div className="form-field">
              <input className="input" name="pesel" placeholder="PESEL" maxLength={11} value={reg.pesel} onChange={handleRegChange} required inputMode="numeric" />
            </div>

            <div className="form-field">
              <input className="input" name="phone" placeholder="Numer telefonu" value={reg.phone} onChange={handleRegChange} inputMode="tel" required />
            </div>

            <div className="form-field">
              <input className="input" name="email" type="email" placeholder="E-mail" value={reg.email} onChange={handleRegChange} required />
            </div>

            <div className="form-field">
              <div className="select-wrap">
                <select id="gender" name="gender" className="select" value={reg.gender} onChange={handleRegChange} required>
                  <option value="" disabled>Wybierz płeć</option>
                  <option value="K">Kobieta</option>
                  <option value="M">Mężczyzna</option>
                </select>
              </div>
            </div>

            <div className="form-field">
            <label className="field-label" htmlFor="birthDate">
              Data urodzenia
            </label>

            <input
              className="input"
              id="birthDate"
              name="birthDate"
              type="date"
              value={reg.birthDate}
              onChange={handleRegChange}
              max={new Date().toISOString().split("T")[0]}
              aria-describedby="birthDateHelp"
              required
            />
          </div>

            <label className="consent">
              <input type="checkbox" name="agree" checked={reg.agree} onChange={handleRegChange} required />
              <span>Oświadczam, że wszystkie podane informacje są zgodne z prawdą.</span>
            </label>

            <div className="form-actions">
              <CTA label="Dalej" type="submit" />
            </div>

            <div className="auth-hint">
              <small>PESEL – 11 cyfr. Hasło ustawisz w następnym kroku.</small>
            </div>
          </form>

          <div className="auth-switch" style={{textAlign:"center", marginTop:8}}>
            <a className="auth-link" href="/login">Masz już konto? Zaloguj się</a>
          </div>

          {!canGoNext && (
            <div className="auth-note">Uzupełnij wymagane pola, wybierz płeć i podaj datę urodzenia.</div>
          )}
        </article>
      )}

      {mode === "setPassword" && (
        <article className="bp-card auth-card">
          <div className="auth-card-cap" aria-hidden="true" />
          <h2 className="auth-card-title">Ustaw hasło</h2>

          <form className="auth-form" onSubmit={submitRegistration} noValidate>
            <div className="form-field">
              <input className="input" type="password" name="pass1" placeholder="Hasło (min. 6 znaków)" value={pwd.pass1} onChange={handlePwdChange} minLength={6} required />
            </div>

            <div className="form-field">
              <input className="input" type="password" name="pass2" placeholder="Powtórz hasło" value={pwd.pass2} onChange={handlePwdChange} minLength={6} required />
            </div>

            <div
              className={`auth-note ${passwordsOk ? 'hidden' : ''}`}
              aria-live="polite"
            >
              Hasła muszą być takie same i mieć co najmniej 6 znaków.
            </div>


            <div className="form-actions">
              <CTA label={submitting ? "Rejestruję..." : "Zarejestruj się"} type="submit" disabled={!passwordsOk || submitting} />
            </div>

            <div className="auth-switch" style={{textAlign:"center", marginTop:8}}>
              <button type="button" className="auth-link" onClick={() => setMode("register")} disabled={submitting}>
                Wróć do danych osobowych
              </button>
            </div>
          </form>
        </article>
      )}
    </div>
  );
}
