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


export default function BloodPointRegister() {
  const [submitting, setSubmitting] = useState(false);
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

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  const emailValid =
    !form.email || /\S+@\S+\.\S+/.test(form.email);

  const peselValid =
    !form.pesel || /^\d{11}$/.test(form.pesel);

  const phoneValid =
    !form.phone || /^\d{9}$/.test(form.phone.replace(/\s+/g, ""));

  const contactPhoneValid =
    !form.contactPhone ||
    /^\d{9}$/.test(form.contactPhone.replace(/\s+/g, ""));

  const zipValid =
    !form.zipCode || /^\d{2}-\d{3}$/.test(form.zipCode);

  const firstNameValid =
    !form.firstName || form.firstName.trim().length > 0;

  const lastNameValid =
    !form.lastName || form.lastName.trim().length > 0;

  const cityValid =
    !form.city || form.city.trim().length > 0;

  const streetValid =
    !form.street || form.street.trim().length > 0;

  const genderValid =
    !form.gender || form.gender === "K" || form.gender === "M";

  const birthDateValid =
    !form.birthDate || form.birthDate.trim().length > 0;

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
    firstNameValid &&
    lastNameValid &&
    cityValid &&
    streetValid &&
    latValid &&
    lngValid;

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting || !canSubmit) return;

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
        email: form.email.trim(),
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
      } else if (res?.resultDTO) {
        showMessage(
          "Punkt krwiodawstwa został zarejestrowany. Tymczasowe hasło zostało wygenerowane (zobacz log serwera).",
          MessageType.SUCCESS
        );
      } else {
        showError("Nie udało się zarejestrować punktu krwiodawstwa.");
      }

      setForm({
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

      showMessage(
        "Za 3 sekundy nastąpi przejście do panelu administratora.",
        MessageType.INFO
      );

      setTimeout(() => {
        navigate("/admin/panel/punkt-krwiodawstwa");
      }, 3000);
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
        const status = err?.response?.status;
        const msg =
          backendData?.message ||
          backendData?.error ||
          err?.message ||
          `Nie udało się zarejestrować punktu krwiodawstwa (status ${status || "?"}).`;
        showError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="bp-section">
        <div className="bp-container">
          <div className="auth-page-center">
            <article className="bp-card auth-card">
              <div className="auth-card-cap" aria-hidden="true" />
              <h2 className="auth-card-title">
                Zarejestruj Punkt Krwiodawstwa
              </h2>
              <p>
                Uzupełnij dane punktu oraz dane managera, który będzie się
                logował.
              </p>

              <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <h3 className="auth-section-title">Dane punktu</h3>

                <div className="form-field">
                  <label className="label" htmlFor="province">
                    Województwo
                  </label>
                  <div className="select-wrap">
                    <select
                      id="province"
                      name="province"
                      className="select"
                      value={form.province}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Wybierz województwo
                      </option>
                      {PROVINCES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="city">
                    Miasto
                  </label>
                  <input
                    id="city"
                    name="city"
                    className="input"
                    type="text"
                    placeholder="Miasto"
                    value={form.city}
                    onChange={handleChange}
                    required
                  />
                  {!cityValid && form.city && (
                    <div className="field-error">Podaj poprawne miasto.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="zipCode">
                    Kod pocztowy
                  </label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    className="input"
                    type="text"
                    placeholder="00-000"
                    value={form.zipCode}
                    onChange={handleChange}
                    required
                  />
                  {!zipValid && form.zipCode && (
                    <div className="field-error">
                      Kod pocztowy w formacie 00-000.
                    </div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="street">
                    Ulica i numer
                  </label>
                  <input
                    id="street"
                    name="street"
                    className="input"
                    type="text"
                    placeholder="np. Szpitalna 1"
                    value={form.street}
                    onChange={handleChange}
                    required
                  />
                  {!streetValid && form.street && (
                    <div className="field-error">Podaj poprawną ulicę.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="phone">
                    Telefon punktu
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    className="input"
                    type="tel"
                    placeholder="np. 222222222"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                  {!phoneValid && form.phone && (
                    <div className="field-error">
                      Numer telefonu musi mieć 9 cyfr.
                    </div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="latitude">
                    Szerokość geograficzna (latitude)
                  </label>
                  <input
                    id="latitude"
                    name="latitude"
                    className="input"
                    type="text"
                    placeholder="np. 52.2297"
                    value={form.latitude}
                    onChange={handleChange}
                    required
                  />
                  {!latValid && form.latitude && (
                    <div className="field-error">
                      Podaj poprawną szerokość geograficzną (-90 do 90).
                    </div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="longitude">
                    Długość geograficzna (longitude)
                  </label>
                  <input
                    id="longitude"
                    name="longitude"
                    className="input"
                    type="text"
                    placeholder="np. 21.0122"
                    value={form.longitude}
                    onChange={handleChange}
                    required
                  />
                  {!lngValid && form.longitude && (
                    <div className="field-error">
                      Podaj poprawną długość geograficzną (-180 do 180).
                    </div>
                  )}
                </div>

                <h3 className="auth-section-title">
                  Dane managera punktu
                </h3>

                <div className="form-field">
                  <label className="label" htmlFor="firstName">
                    Imię
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    className="input"
                    type="text"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                  {!firstNameValid && form.firstName && (
                    <div className="field-error">Podaj poprawne imię.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="lastName">
                    Nazwisko
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    className="input"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                  {!lastNameValid && form.lastName && (
                    <div className="field-error">Podaj poprawne nazwisko.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="email">
                    E-mail (login)
                  </label>
                  <input
                    id="email"
                    name="email"
                    className="input"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  {!emailValid && form.email && (
                    <div className="field-error">
                      Podaj poprawny adres e-mail.
                    </div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="contactPhone">
                    Telefon managera
                  </label>
                  <input
                    id="contactPhone"
                    name="contactPhone"
                    className="input"
                    type="tel"
                    value={form.contactPhone}
                    onChange={handleChange}
                    required
                  />
                  {!contactPhoneValid && form.contactPhone && (
                    <div className="field-error">
                      Numer telefonu musi mieć 9 cyfr.
                    </div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="pesel">
                    PESEL
                  </label>
                  <input
                    id="pesel"
                    name="pesel"
                    className="input"
                    type="text"
                    maxLength={11}
                    value={form.pesel}
                    onChange={handleChange}
                    required
                  />
                  {!peselValid && form.pesel && (
                    <div className="field-error">
                      PESEL musi składać się z 11 cyfr.
                    </div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="birthDate">
                    Data urodzenia
                  </label>
                  <input
                    id="birthDate"
                    name="birthDate"
                    className="input"
                    type="date"
                    value={form.birthDate}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                    required
                  />
                  {!birthDateValid && form.birthDate && (
                    <div className="field-error">Podaj datę urodzenia.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="gender">
                    Płeć
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    className="input"
                    value={form.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="K">Kobieta</option>
                    <option value="M">Mężczyzna</option>
                  </select>
                  {!genderValid && form.gender && (
                    <div className="field-error">Wybierz poprawną płeć.</div>
                  )}
                </div>

                <div className="form-actions">
                  <CTA
                    label={
                      submitting ? "Zapisywanie..." : "Zarejestruj punkt"
                    }
                    type="submit"
                    disabled={submitting || !canSubmit}
                  />
                </div>

                {!canSubmit && (
                  <div className="auth-note">
                    Uzupełnij poprawnie wszystkie wymagane pola, w tym
                    współrzędne, dane kontaktowe, PESEL oraz kod pocztowy.
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
