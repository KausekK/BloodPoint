import { useState } from "react";
import Header from "../../../../Header/Header";
import Footer from "../../../../Footer/Footer";
import CTA from "../../../../CTA/CTA";
import {
  showMessage,
  showError,
  showMessages,
} from "../../../../shared/services/MessageService";
import { MessageType } from "../../../../shared/const/MessageType.model";
import { registerHospital } from "../../../../../services/AdminHospitalService";

import "../../../../SharedCSS/LoginForms.css";
import "../../../../SharedCSS/MenagePanels.css";
import { PROVINCES } from "../../../../../constants/provinces";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../../BackButton/BackButton";

import {
  EARLIEST_BIRTH_DATE,
  getTodayDate,
} from "../../../../shared/const/dateLimits";
import { isPeselMatchingBirthDate } from "../../../../shared/utils/pesel";

export default function HospitalRegister() {
  const [submitting, setSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    province: "",
    city: "",
    zipCode: "",
    street: "",
    phone: "",
    firstName: "",
    lastName: "",
    email: "",
    contactPhone: "",
    pesel: "",
    birthDate: "",
    gender: "K",
  });

  const today = getTodayDate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  const emailValid = !form.email || /\S+@\S+\.\S+/.test(form.email);
  const peselValid = !form.pesel || /^\d{11}$/.test(form.pesel);
  const phoneValid = !form.phone || /^\d{9}$/.test(form.phone.replace(/\s+/g, ""));
  const contactPhoneValid =
    !form.contactPhone || /^\d{9}$/.test(form.contactPhone.replace(/\s+/g, ""));
  const zipValid = !form.zipCode || /^\d{2}-\d{3}$/.test(form.zipCode);
  const firstNameValid = !form.firstName || form.firstName.trim().length > 0;
  const lastNameValid = !form.lastName || form.lastName.trim().length > 0;
  const cityValid = !form.city || form.city.trim().length > 0;
  const streetValid = !form.street || form.street.trim().length > 0;
  const genderValid = !form.gender || form.gender === "K" || form.gender === "M";

  const birthDateValid =
    !form.birthDate
      ? true
      : /^\d{4}-\d{2}-\d{2}$/.test(form.birthDate) &&
        form.birthDate >= EARLIEST_BIRTH_DATE &&
        form.birthDate <= today;

  const peselMatchesBirthDate = isPeselMatchingBirthDate(
    form.pesel,
    form.birthDate
  );

  const canSubmit =
    form.province &&
    form.city.trim() &&
    form.zipCode.trim() &&
    form.street.trim() &&
    form.phone.trim() &&
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.contactPhone.trim() &&
    form.pesel.trim() &&
    form.birthDate &&
    form.gender &&
    emailValid &&
    peselValid &&
    phoneValid &&
    contactPhoneValid &&
    zipValid &&
    genderValid &&
    birthDateValid &&
    peselMatchesBirthDate &&
    firstNameValid &&
    lastNameValid &&
    cityValid &&
    streetValid;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!canSubmit) {
      setSubmitAttempted(true);
      return;
    }

    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await registerHospital({
        province: form.province,
        city: form.city.trim(),
        zipCode: form.zipCode.trim(),
        street: form.street.trim(),
        phone: form.phone.replace(/\s+/g, "").trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        contactPhone: form.contactPhone.replace(/\s+/g, "").trim(),
        pesel: form.pesel.trim(),
        birthDate: form.birthDate || null,
        gender: form.gender,
      });

      if (Array.isArray(res?.messages) && res.messages.length > 0) {
        showMessages(
          res.messages.map((m) => ({
            msg: m.msg,
            type: MessageType[m.type] || MessageType.INFO,
          }))
        );
      } else {
        showMessage("Placówka została zarejestrowana.", MessageType.SUCCESS);
      }

      setTimeout(() => navigate("/admin/panel/szpital"), 3000);
    } catch (err) {
      showError("Nie udało się zarejestrować placówki.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="bp-section">
        <div className="bp-container">
          <BackButton to="/admin/panel/szpital" label="Powrót do panelu szpitala" />
          <div className="auth-page-center">
            <article className="bp-card auth-card auth-card--wide">
              <div className="auth-card-cap" aria-hidden="true" />
              <h2 className="auth-card-title">Zarejestruj Placówkę Szpitalną</h2>

              <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <h3 className="auth-section-title">Dane placówki</h3>

                <div className="form-field">
                  <label className="label" htmlFor="province">Województwo</label>
                  <div className="select-wrap">
                    <select
                      id="province"
                      name="province"
                      className="select"
                      value={form.province}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>Wybierz województwo</option>
                      {PROVINCES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  {!form.province && submitAttempted && (
                    <div className="field-error">Wybierz województwo.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="city">Miasto</label>
                  <input id="city" name="city" className="input" value={form.city} onChange={handleChange} required />
                  {!cityValid && (form.city || submitAttempted) && (
                    <div className="field-error">Podaj poprawne miasto.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="zipCode">Kod pocztowy</label>
                  <input id="zipCode" name="zipCode" className="input" value={form.zipCode} onChange={handleChange} required />
                  {!zipValid && (form.zipCode || submitAttempted) && (
                    <div className="field-error">Kod pocztowy w formacie 00-000.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="street">Ulica i numer</label>
                  <input id="street" name="street" className="input" value={form.street} onChange={handleChange} required />
                  {!streetValid && (form.street || submitAttempted) && (
                    <div className="field-error">Podaj poprawną ulicę.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="phone">Telefon placówki</label>
                  <input id="phone" name="phone" className="input" value={form.phone} onChange={handleChange} required />
                  {!phoneValid && (form.phone || submitAttempted) && (
                    <div className="field-error">Numer telefonu placówki musi mieć 9 cyfr.</div>
                  )}
                </div>

                <h3 className="auth-section-title">Dane użytkownika szpitala</h3>

                <div className="form-field">
                  <label className="label" htmlFor="firstName">Imię</label>
                  <input id="firstName" name="firstName" className="input" value={form.firstName} onChange={handleChange} required />
                  {!firstNameValid && (form.firstName || submitAttempted) && (
                    <div className="field-error">Podaj poprawne imię.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="lastName">Nazwisko</label>
                  <input id="lastName" name="lastName" className="input" value={form.lastName} onChange={handleChange} required />
                  {!lastNameValid && (form.lastName || submitAttempted) && (
                    <div className="field-error">Podaj poprawne nazwisko.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="email">E-mail</label>
                  <input id="email" name="email" className="input" value={form.email} onChange={handleChange} required />
                  {!emailValid && (form.email || submitAttempted) && (
                    <div className="field-error">Podaj poprawny adres e-mail.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="contactPhone">Telefon użytkownika</label>
                  <input id="contactPhone" name="contactPhone" className="input" value={form.contactPhone} onChange={handleChange} required />
                  {!contactPhoneValid && (form.contactPhone || submitAttempted) && (
                    <div className="field-error">Numer telefonu użytkownika musi mieć 9 cyfr.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="pesel">PESEL</label>
                  <input id="pesel" name="pesel" className="input" value={form.pesel} onChange={handleChange} required />
                  {!peselValid && (form.pesel || submitAttempted) && (
                    <div className="field-error">PESEL musi składać się z 11 cyfr.</div>
                  )}
                  {!peselMatchesBirthDate && (form.birthDate || submitAttempted) && peselValid && (
                    <div className="field-error">PESEL nie jest zgodny z datą urodzenia.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="birthDate">Data urodzenia</label>
                  <input id="birthDate" name="birthDate" type="date" className="input" value={form.birthDate} onChange={handleChange} required />
                  {!birthDateValid && (form.birthDate || submitAttempted) && (
                    <div className="field-error">Podaj poprawną datę urodzenia.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="gender">Płeć</label>
                  <select id="gender" name="gender" className="input" value={form.gender} onChange={handleChange} required>
                    <option value="K">Kobieta</option>
                    <option value="M">Mężczyzna</option>
                  </select>
                  {!genderValid && submitAttempted && (
                    <div className="field-error">Wybierz poprawną płeć.</div>
                  )}
                </div>

                <div className="form-actions">
                  <CTA label={submitting ? "Zapisywanie..." : "Zarejestruj placówkę"} type="submit" disabled={submitting} />
                </div>

                {!canSubmit && submitAttempted && (
                  <div className="auth-note">Formularz zawiera błędy — popraw zaznaczone pola.</div>
                )}
              </form>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}