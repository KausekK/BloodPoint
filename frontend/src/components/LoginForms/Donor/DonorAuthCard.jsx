import { useMemo, useState } from "react";
import CTA from "../../../components/CTA/CTA";
import "../../SharedCSS/LoginForms.css";
import authService from "../../../services/AuthenticationService";
import {
  showMessages, 
  showError 
} from "../../shared/services/MessageService";

const DONOR_ROLE = "DAWCA";

import { MessageType } from "../../shared/const/MessageType.model";
import { EARLIEST_BIRTH_DATE, getTodayDate } from "../../shared/const/dateLimits";

import { useFormValidation } from "../../shared/utils/useFormValidation";
import { validators } from "../../shared/utils/validators";
import { fieldClass, shouldShowError } from "../../shared/utils/formValidation";



export default function DonorAuthCard() {
  const [mode, setMode] = useState("register");
  const [submitting, setSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  

  const [form, setForm] = useState({
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

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function handlePwdChange(e) {
    const { name, value } = e.target;
    setPwd((v) => ({ ...v, [name]: value }));
  }
  const birthDateError = validators.birthDate(form.birthDate);

  const rules = {
    firstName: [validators.required],
    lastName: [validators.required],
    pesel: [validators.required, validators.pesel],
    phone: [validators.required, validators.phone],
    email: [validators.required, validators.email],
    gender: [validators.required, validators.gender],
    birthDate: [validators.required, validators.birthDate],
    agree: [(v) => v === true],
  };

  const { fields, isValid } = useFormValidation(form, rules);
  const canGoNext = isValid;

  const passwordsOk = useMemo(() => pwd.pass1.length >= 6 && pwd.pass1 === pwd.pass2, [pwd]);

  async function submitRegistration(e) {
    e.preventDefault();
    if (!passwordsOk || submitting) return;

    setSubmitting(true);
    try {
      const data = await authService.register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        pesel: form.pesel.trim(),
        phone: form.phone.trim(),
        gender: form.gender,
        birthDate: form.birthDate,
        role: DONOR_ROLE,
        password: pwd.pass1,
      });

      const messages = Array.isArray(data?.messages) ? data.messages : [];

      showMessages(
        messages.map((m) => ({
          msg: m.msg,
          type: MessageType[m.type] || MessageType.INFO,
        }))
      );

      const hasError = messages.some((m) => m.type === "ERROR");

      if (!hasError) {
        setForm({
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

        setTimeout(() => {
          window.location.assign("/login");
        }, 1000);
      }
    } catch (err) {
      const backendData = err?.response?.data;
      const backendMessages = backendData?.messages;

      if (Array.isArray(backendMessages) && backendMessages.length > 0) {
        showMessages(
          backendMessages.map((m) => ({
            msg: m.msg,
            type: MessageType[m.type] || MessageType.INFO,
          }))
        );
      } else {
        showError(
          backendData?.message ||
            backendData?.error ||
            err?.message ||
            "Rejestracja nie powiodła się."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  function goSetPassword(e) {
    e.preventDefault();
    setSubmitAttempted(true);
    if (canGoNext) setMode("setPassword");
  }

  return (
    <div className="donor-auth">
      {mode === "register" && (
        <article className="bp-card auth-card">
          <div className="auth-card-cap" aria-hidden="true" />
          <h2 className="auth-card-title">REJESTRACJA DAWCY</h2>

          <form className="auth-form" onSubmit={goSetPassword} noValidate>
            <div className="form-field">
              <input
                name="firstName"
                placeholder="Imię"
                value={form.firstName}
                onChange={handleChange}
                className={fieldClass(fields.firstName, submitAttempted)}
              />
              {shouldShowError(fields.firstName, submitAttempted, form.firstName) && (
                <div className="field-error">Podaj poprawne imię.</div>
              )}
            </div>

            <div className="form-field">
              <input
                name="lastName"
                placeholder="Nazwisko"
                value={form.lastName}
                onChange={handleChange}
                className={fieldClass(fields.lastName, submitAttempted)}
              />
              {shouldShowError(fields.lastName, submitAttempted, form.lastName) && (
                <div className="field-error">Podaj poprawne nazwisko.</div>
              )}
            </div>

            <div className="form-field">
              <input
                name="pesel"
                placeholder="PESEL"
                maxLength={11}
                value={form.pesel}
                onChange={handleChange}
                className={fieldClass(fields.pesel, submitAttempted)}
              />
              {shouldShowError(fields.pesel, submitAttempted, form.pesel) && (
                <div className="field-error">PESEL musi składać się z 11 cyfr.</div>
              )}
            </div>

            <div className="form-field">
              <input
                name="phone"
                placeholder="Numer telefonu"
                value={form.phone}
                onChange={handleChange}
                className={fieldClass(fields.phone, submitAttempted)}
              />
              {shouldShowError(fields.phone, submitAttempted, form.phone) && (
                <div className="field-error">Numer telefonu musi mieć 9 cyfr.</div>
              )}
            </div>

            <div className="form-field">
              <input
                name="email"
                type="email"
                placeholder="E-mail"
                value={form.email}
                onChange={handleChange}
                className={fieldClass(fields.email, submitAttempted)}
              />
              {shouldShowError(fields.email, submitAttempted, form.email) && (
                <div className="field-error">Podaj poprawny adres e-mail.</div>
              )}
            </div>

            <div className="form-field">
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={fieldClass(fields.gender, submitAttempted, "select")}
              >
                <option value="" disabled>
                  Wybierz płeć
                </option>
                <option value="K">Kobieta</option>
                <option value="M">Mężczyzna</option>
              </select>
              {shouldShowError(fields.gender, submitAttempted, form.gender) && (
                <div className="field-error">Wybierz poprawną płeć.</div>
              )}
            </div>

            <div className="form-field">
              <input
                name="birthDate"
                type="date"
                value={form.birthDate}
                onChange={handleChange}
                min={EARLIEST_BIRTH_DATE}
                max={getTodayDate()}
                className={fieldClass(fields.birthDate, submitAttempted)}
              />
              {submitAttempted && birthDateError === "REQUIRED" && (
                <div className="field-error">Podaj datę urodzenia.</div>
              )}
              {submitAttempted && birthDateError === "TOO_YOUNG" && (
                <div className="field-error">Musisz mieć co najmniej 18 lat.</div>
              )}
              {submitAttempted && birthDateError === "TOO_OLD" && (
                <div className="field-error">Wybrana data jest zbyt odległa w przeszłość.</div>
              )}
              {submitAttempted && birthDateError === "FUTURE_DATE" && (
                <div className="field-error">Data nie może być w przyszłości.</div>
              )}
            </div>

            <label className="consent">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
              />
              <span>Oświadczam, że wszystkie podane informacje są zgodne z prawdą.</span>
            </label>

            <div className="form-actions">
              <CTA label="Dalej" type="submit" />
            </div>

            {!canGoNext && submitAttempted && (
              <div className="auth-note">
                Uzupełnij wszystkie wymagane pola i popraw błędy.
              </div>
            )}
          </form>
        </article>
      )}

      {mode === "setPassword" && (
        <article className="bp-card auth-card">
          <div className="auth-card-cap" aria-hidden="true" />
          <h2 className="auth-card-title">Ustaw hasło</h2>

          <form className="auth-form" onSubmit={submitRegistration} noValidate>
            <div className="form-field">
              <input
                type="password"
                name="pass1"
                placeholder="Hasło (min. 6 znaków)"
                value={pwd.pass1}
                onChange={handlePwdChange}
                minLength={6}
                required
                className={fieldClass(passwordsOk, false)}
              />
            </div>

            <div className="form-field">
              <input
                type="password"
                name="pass2"
                placeholder="Powtórz hasło"
                value={pwd.pass2}
                onChange={handlePwdChange}
                minLength={6}
                required
                className={fieldClass(passwordsOk, false)}
              />
            </div>

            {!passwordsOk && (
              <div className="auth-note" aria-live="polite">
                Hasła muszą być takie same i mieć co najmniej 6 znaków.
              </div>
            )}

            <div className="form-actions">
              <CTA
                label={submitting ? "Rejestruję..." : "Zarejestruj się"}
                type="submit"
                disabled={!passwordsOk || submitting}
              />
            </div>

            <div className="auth-switch" style={{ textAlign: "center", marginTop: 8 }}>
              <button
                type="button"
                className="auth-link"
                onClick={() => setMode("register")}
                disabled={submitting}
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