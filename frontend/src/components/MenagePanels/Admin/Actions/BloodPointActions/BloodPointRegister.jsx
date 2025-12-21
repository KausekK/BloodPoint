import { useMemo, useState } from "react";
import Header from "../../../../Header/Header";
import Footer from "../../../../Footer/Footer";
import CTA from "../../../../CTA/CTA";
import { showMessage, showError } from "../../../../shared/services/MessageService";
import { MessageType } from "../../../../shared/const/MessageType.model";
import { registerDonationPoint } from "../../../../../services/AdminDonationPointService";
import "../../../../SharedCSS/LoginForms.css";
import "../../../../SharedCSS/MenagePanels.css";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../../BackButton/BackButton";

import {
  EARLIEST_BIRTH_DATE,
  getTodayDate,
} from "../../../../shared/const/dateLimits";
import { isPeselMatchingBirthDate } from "../../../../shared/utils/pesel";

export default function BloodPointRegister() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

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


  const emailValid = useMemo(
    () => !form.email || /\S+@\S+\.\S+/.test(form.email),
    [form.email]
  );

  const peselValid = useMemo(
    () => !form.pesel || /^\d{11}$/.test(form.pesel),
    [form.pesel]
  );

  const phoneValid = useMemo(
    () => !form.phone || /^\d{9}$/.test(form.phone.replace(/\s+/g, "")),
    [form.phone]
  );

  const contactPhoneValid = useMemo(
    () =>
      !form.contactPhone ||
      /^\d{9}$/.test(form.contactPhone.replace(/\s+/g, "")),
    [form.contactPhone]
  );

  const zipValid = useMemo(
    () => !form.zipCode || /^\d{2}-\d{3}$/.test(form.zipCode),
    [form.zipCode]
  );

  const birthDateValid = useMemo(() => {
    if (!form.birthDate) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.birthDate)) return false;
    return (
      form.birthDate >= EARLIEST_BIRTH_DATE &&
      form.birthDate <= today
    );
  }, [form.birthDate, today]);

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

  const peselMatchesBirthDate = useMemo(
    () => isPeselMatchingBirthDate(form.pesel, form.birthDate),
    [form.pesel, form.birthDate]
  );

  const canSubmit = useMemo(() => {
    return (
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
      birthDateValid &&
      peselMatchesBirthDate &&
      latValid &&
      lngValid
    );
  }, [
    form,
    emailValid,
    peselValid,
    phoneValid,
    contactPhoneValid,
    zipValid,
    birthDateValid,
    peselMatchesBirthDate,
    latValid,
    lngValid,
  ]);



  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);

    try {
      await registerDonationPoint({
        province: form.province,
        city: form.city.trim(),
        zipCode: form.zipCode.trim(),
        street: form.street.trim(),
        phone: form.phone.replace(/\s+/g, ""),
        latitude: Number(String(form.latitude).replace(",", ".")),
        longitude: Number(String(form.longitude).replace(",", ".")),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        contactPhone: form.contactPhone.replace(/\s+/g, ""),
        pesel: form.pesel.trim(),
        birthDate: form.birthDate,
        gender: form.gender,
      });

      showMessage(
        "Punkt krwiodawstwa został zarejestrowany. Tymczasowe hasło zostało wygenerowane.",
        MessageType.SUCCESS
      );

      setTimeout(() => {
        navigate("/admin/panel/punkt-krwiodawstwa");
      }, 2000);
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
          <BackButton
            to="/admin/panel/punkt-krwiodawstwa"
            label="Powrót do panelu Punktu Krwiodawstwa"
          />

          <article className="bp-card auth-card auth-card--wide">
            <h2 className="auth-card-title">
              Zarejestruj Punkt Krwiodawstwa
            </h2>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="form-actions">
                <CTA
                  label={submitting ? "Zapisywanie..." : "Zarejestruj punkt"}
                  type="submit"
                  disabled={!canSubmit || submitting}
                />
              </div>

              {!canSubmit && (
                <div className="auth-note">
                  Uzupełnij poprawnie wszystkie wymagane pola, w tym
                  współrzędne oraz dane kontaktowe.
                </div>
              )}
            </form>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
