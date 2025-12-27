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
import { registerDonationPoint } from "../../../../../services/AdminDonationPointService";

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

export default function BloodPointRegister() {
  const [submitting, setSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    province: "",
    city: "",
    zipCode: "",
    street: "",
    phone: "",
    latitude: "",
    longitude: "",
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
  const phoneValid =
    !form.phone || /^\d{9}$/.test(form.phone.replace(/\s+/g, ""));
  const contactPhoneValid =
    !form.contactPhone ||
    /^\d{9}$/.test(form.contactPhone.replace(/\s+/g, ""));
  const zipValid = !form.zipCode || /^\d{2}-\d{3}$/.test(form.zipCode);
  const firstNameValid = !form.firstName || form.firstName.trim().length > 0;
  const lastNameValid = !form.lastName || form.lastName.trim().length > 0;
  const cityValid = !form.city || form.city.trim().length > 0;
  const streetValid = !form.street || form.street.trim().length > 0;
  const genderValid =
    !form.gender || form.gender === "K" || form.gender === "M";

  const birthDateValid =
    !form.birthDate
      ? true
      : /^\d{4}-\d{2}-\d{2}$/.test(form.birthDate) &&
        form.birthDate >= EARLIEST_BIRTH_DATE &&
        form.birthDate <= today;

  function isValidLat(val) {
    if (!val) return false;
    const num = Number(String(val).replace(",", "."));
    return !Number.isNaN(num) && num >= -90 && num <= 90;
  }

  function isValidLng(val) {
    if (!val) return false;
    const num = Number(String(val).replace(",", "."));
    return !Number.isNaN(num) && num >= -180 && num <= 180;
  }

  const latValid = isValidLat(form.latitude);
  const lngValid = isValidLng(form.longitude);

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
    form.latitude &&
    form.longitude &&
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
    streetValid &&
    latValid &&
    lngValid;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!canSubmit) {
      setSubmitAttempted(true);
      return;
    }

    if (submitting) return;
    setSubmitting(true);

    try {
      const payload = {
        province: form.province,
        city: form.city.trim(),
        zipCode: form.zipCode.trim(),
        street: form.street.trim(),
        phone: form.phone.replace(/\s+/g, "").trim(),
        latitude: Number(String(form.latitude).replace(",", ".")),
        longitude: Number(String(form.longitude).replace(",", ".")),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        contactPhone: form.contactPhone.replace(/\s+/g, "").trim(),
        pesel: form.pesel.trim(),
        birthDate: form.birthDate || null,
        gender: form.gender,
      };

      const res = await registerDonationPoint(payload);

      if (Array.isArray(res?.messages) && res.messages.length > 0) {
        showMessages(
          res.messages.map((m) => ({
            msg: m.msg,
            type: MessageType[m.type] || MessageType.INFO,
          }))
        );
      } else {
        showMessage(
          "Punkt krwiodawstwa został zarejestrowany.",
          MessageType.SUCCESS
        );
      }

      setTimeout(() => {
        navigate("/admin/panel/punkt-krwiodawstwa");
      }, 3000);
    } catch (err) {
      showError("Nie udało się zarejestrować punktu krwiodawstwa.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="bp-section">
        <div className="bp-container">
          <BackButton
            to="/admin/panel/punkt-krwiodawstwa"
            label="Powrót do panelu Punktu Krwiodawstwa"
          />
          <div className="auth-page-center">
            <article className="bp-card auth-card auth-card--wide">
              <div className="auth-card-cap" aria-hidden="true" />
              <h2 className="auth-card-title">
                Zarejestruj Punkt Krwiodawstwa
              </h2>

              <form className="auth-form" onSubmit={handleSubmit} noValidate>

                <div className="form-field">
                  <label className="label">Województwo</label>
                  <select
                    name="province"
                    className="select"
                    value={form.province}
                    onChange={handleChange}
                  >
                    <option value="">Wybierz województwo</option>
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {!form.province && submitAttempted && (
                    <div className="field-error">Wybierz województwo.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label">Miasto</label>
                  <input name="city" className="input" value={form.city} onChange={handleChange} />
                  {!cityValid && (form.city || submitAttempted) && (
                    <div className="field-error">Podaj poprawne miasto.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label">Kod pocztowy</label>
                  <input name="zipCode" className="input" value={form.zipCode} onChange={handleChange} />
                  {!zipValid && (form.zipCode || submitAttempted) && (
                    <div className="field-error">Kod pocztowy w formacie 00-000.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label">Ulica</label>
                  <input name="street" className="input" value={form.street} onChange={handleChange} />
                  {!streetValid && (form.street || submitAttempted) && (
                    <div className="field-error">Podaj poprawną ulicę.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label">Telefon</label>
                  <input name="phone" className="input" value={form.phone} onChange={handleChange} />
                  {!phoneValid && (form.phone || submitAttempted) && (
                    <div className="field-error">Telefon musi mieć 9 cyfr.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label">Latitude</label>
                  <input name="latitude" className="input" value={form.latitude} onChange={handleChange} />
                  {!latValid && (form.latitude || submitAttempted) && (
                    <div className="field-error">Latitude -90 do 90.</div>
                  )}
                </div>

                {/* Longitude */}
                <div className="form-field">
                  <label className="label">Longitude</label>
                  <input name="longitude" className="input" value={form.longitude} onChange={handleChange} />
                  {!lngValid && (form.longitude || submitAttempted) && (
                    <div className="field-error">Longitude -180 do 180.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label">Imię</label>
                  <input name="firstName" className="input" value={form.firstName} onChange={handleChange} />
                  {!firstNameValid && (form.firstName || submitAttempted) && (
                    <div className="field-error">Podaj imię.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label">Nazwisko</label>
                  <input name="lastName" className="input" value={form.lastName} onChange={handleChange} />
                  {!lastNameValid && (form.lastName || submitAttempted) && (
                    <div className="field-error">Podaj nazwisko.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label">E-mail</label>
                  <input name="email" className="input" value={form.email} onChange={handleChange} />
                  {!emailValid && (form.email || submitAttempted) && (
                    <div className="field-error">Niepoprawny e-mail.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label">Telefon managera</label>
                  <input name="contactPhone" className="input" value={form.contactPhone} onChange={handleChange} />
                  {!contactPhoneValid && (form.contactPhone || submitAttempted) && (
                    <div className="field-error">Telefon musi mieć 9 cyfr.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label">PESEL</label>
                  <input name="pesel" className="input" value={form.pesel} onChange={handleChange} />
                  {!peselValid && (form.pesel || submitAttempted) && (
                    <div className="field-error">PESEL = 11 cyfr.</div>
                  )}
                  {!peselMatchesBirthDate && (form.birthDate || submitAttempted) && peselValid && (
                    <div className="field-error">PESEL niezgodny z datą.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label">Data urodzenia</label>
                  <input type="date" name="birthDate" className="input" value={form.birthDate} onChange={handleChange} />
                  {!birthDateValid && (form.birthDate || submitAttempted) && (
                    <div className="field-error">Niepoprawna data.</div>
                  )}
                </div>

                <div className="form-actions">
                  <CTA
                    label={submitting ? "Zapisywanie..." : "Zarejestruj punkt"}
                    type="submit"
                    disabled={submitting}
                  />
                </div>

                {!canSubmit && submitAttempted && (
                  <div className="auth-note">
                    Formularz zawiera błędy — popraw zaznaczone pola.
                  </div>
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