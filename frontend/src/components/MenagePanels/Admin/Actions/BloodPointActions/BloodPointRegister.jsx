import { useState } from "react";
import Header from "../../../../Header/Header";
import Footer from "../../../../Footer/Footer";
import CTA from "../../../../CTA/CTA";
import BackButton from "../../../../BackButton/BackButton";

import { 
  showMessages, 
  showError } from "../../../../shared/services/MessageService";
import { MessageType } from "../../../../shared/const/MessageType.model";
import { registerDonationPoint } from "../../../../../services/AdminDonationPointService";

import "../../../../SharedCSS/LoginForms.css";
import "../../../../SharedCSS/MenagePanels.css";

import { PROVINCES } from "../../../../../constants/provinces";
import { useNavigate } from "react-router-dom";

import { useFormValidation } from "../../../../shared/utils/useFormValidation";
import { validators } from "../../../../shared/utils/validators";
import { fieldClass, shouldShowError } from "../../../../shared/utils/formValidation";


export default function BloodPointRegister() {
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

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  const rules = {
    province: [validators.required],
    city: [validators.required],
    zipCode: [validators.required, validators.zip],
    street: [validators.required],
    phone: [validators.required, validators.phone],
    latitude: [validators.required, validators.latitude],
    longitude: [validators.required, validators.longitude],
    firstName: [validators.required],
    lastName: [validators.required],
    email: [validators.required, validators.email],
    contactPhone: [validators.required, validators.phone],
    pesel: [validators.required, validators.pesel],
    birthDate: [validators.required, validators.birthDate],
    gender: [validators.required, validators.gender],
  };

  const { fields, isValid } = useFormValidation(form, rules);
  const canSubmit = isValid;

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

      const messages = Array.isArray(res?.messages) ? res.messages : [];
      if (messages.length > 0) {
        showMessages(
          messages.map((m) => ({
            msg: m.msg,
            type: MessageType[m.type] || MessageType.INFO,
          }))
        );
      }

      const hasError = messages.some((m) => m.type === "ERROR");
      if (!hasError) {
        setTimeout(() => navigate("/admin/panel/punkt-krwiodawstwa"), 3000);
      }
    } catch {
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
          <BackButton to="/admin/panel/punkt-krwiodawstwa" label="Powrót do panelu Punktu Krwiodawstwa" />
          <div className="auth-page-center">
            <article className="bp-card auth-card auth-card--wide">
              <div className="auth-card-cap" aria-hidden="true" />
              <h2 className="auth-card-title">Zarejestruj Punkt Krwiodawstwa</h2>

              <form className="auth-form" onSubmit={handleSubmit} noValidate>

                <h3 className="auth-section-title">Dane punktu</h3>

                <div className="form-field">
                  <label className="label" htmlFor="province">Województwo</label>
                  <div className="select-wrap">
                    <select
                      id="province"
                      name="province"
                      className={fieldClass(fields.province, submitAttempted, "select")}
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
                  {shouldShowError(fields.province, submitAttempted, form.province) && (
                    <div className="field-error">Wybierz województwo.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="city">Miasto</label>
                  <input
                    id="city"
                    name="city"
                    className={fieldClass(fields.city, submitAttempted)}
                    value={form.city}
                    onChange={handleChange}
                    required
                  />
                  {shouldShowError(fields.city, submitAttempted, form.city) && (
                    <div className="field-error">Podaj poprawne miasto.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="zipCode">Kod pocztowy</label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    className={fieldClass(fields.zipCode, submitAttempted)}
                    value={form.zipCode}
                    onChange={handleChange}
                    required
                  />
                  {shouldShowError(fields.zipCode, submitAttempted, form.zipCode) && (
                    <div className="field-error">Kod pocztowy w formacie 00-000.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="street">Ulica</label>
                  <input
                    id="street"
                    name="street"
                    className={fieldClass(fields.street, submitAttempted)}
                    value={form.street}
                    onChange={handleChange}
                    required
                  />
                  {shouldShowError(fields.street, submitAttempted, form.street) && (
                    <div className="field-error">Podaj poprawną ulicę.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="phone">Telefon</label>
                  <input
                    id="phone"
                    name="phone"
                    className={fieldClass(fields.phone, submitAttempted)}
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                  {shouldShowError(fields.phone, submitAttempted, form.phone) && (
                    <div className="field-error">Telefon musi mieć 9 cyfr.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="latitude">Szerokość geograficzna</label>
                  <input
                    id="latitude"
                    name="latitude"
                    className={fieldClass(fields.latitude, submitAttempted)}
                    value={form.latitude}
                    onChange={handleChange}
                    required
                  />
                  {shouldShowError(fields.latitude, submitAttempted, form.latitude) && (
                    <div className="field-error">Szerokość geograficzna musi być w przedziale od -90 do 90.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="longitude">Długość geograficzna</label>
                  <input
                    id="longitude"
                    name="longitude"
                    className={fieldClass(fields.longitude, submitAttempted)}
                    value={form.longitude}
                    onChange={handleChange}
                    required
                  />
                  {shouldShowError(fields.longitude, submitAttempted, form.longitude) && (
                    <div className="field-error">Długość geograficzna musi być w przedziale od -180 do 180.</div>
                  )}
                </div>

                <h3 className="auth-section-title">Dane manadzera</h3>

                <div className="form-field">
                  <label className="label" htmlFor="firstName">Imię</label>
                  <input
                    id="firstName"
                    name="firstName"
                    className={fieldClass(fields.firstName, submitAttempted)}
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                  {shouldShowError(fields.firstName, submitAttempted, form.firstName) && (
                    <div className="field-error">Podaj poprawne imię.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="lastName">Nazwisko</label>
                  <input
                    id="lastName"
                    name="lastName"
                    className={fieldClass(fields.lastName, submitAttempted)}
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                  {shouldShowError(fields.lastName, submitAttempted, form.lastName) && (
                    <div className="field-error">Podaj poprawne nazwisko.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="email">E-mail</label>
                  <input
                    id="email"
                    name="email"
                    className={fieldClass(fields.email, submitAttempted)}
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  {shouldShowError(fields.email, submitAttempted, form.email) && (
                    <div className="field-error">Podaj poprawny adres e-mail.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="contactPhone">Telefon manadzera</label>
                  <input
                    id="contactPhone"
                    name="contactPhone"
                    className={fieldClass(fields.contactPhone, submitAttempted)}
                    value={form.contactPhone}
                    onChange={handleChange}
                    required
                  />
                  {shouldShowError(fields.contactPhone, submitAttempted, form.contactPhone) && (
                    <div className="field-error">Telefon musi mieć 9 cyfr.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="pesel">PESEL</label>
                  <input
                    id="pesel"
                    name="pesel"
                    className={fieldClass(fields.pesel, submitAttempted)}
                    value={form.pesel}
                    onChange={handleChange}
                    required
                  />
                  {shouldShowError(fields.pesel, submitAttempted, form.pesel) && (
                    <div className="field-error">PESEL musi zawierać 11 cyfr.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="birthDate">Data urodzenia</label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    className={fieldClass(fields.birthDate, submitAttempted)}
                    value={form.birthDate}
                    onChange={handleChange}
                    required
                  />
                  {shouldShowError(fields.birthDate, submitAttempted, form.birthDate) && (
                    <div className="field-error">Niepoprawna data urodzenia.</div>
                  )}
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="gender">Płeć</label>
                  <select
                    id="gender"
                    name="gender"
                    className={fieldClass(fields.gender, submitAttempted, "input")}
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="K">Kobieta</option>
                    <option value="M">Mężczyzna</option>
                  </select>
                  {shouldShowError(fields.gender, submitAttempted, form.gender) && (
                    <div className="field-error">Wybierz poprawną płeć.</div>
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