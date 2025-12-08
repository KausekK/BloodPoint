import { useState } from "react";
import CTA from "../CTA/CTA";
import authService from "../../services/AuthenticationService";
import { showMessage, showError } from "../shared/services/MessageService";
import { MessageType } from "../shared/const/MessageType.model";
import "../SharedCSS/LoginForms.css";
import ChangePasswordModal from "../Auth/ChangePasswordModal";

export default function GeneralLoginForm({
  title = "Zaloguj się",
  lead = "Po zalogowaniu automatycznie przeniesiemy Cię do właściwego panelu.",
  idName = "email",
  idType = "email",
  idPlaceholder = "E-mail",
  passwordPlaceholder = "Hasło",
  submitText = "Zaloguj się",
}) {
  const [vals, setVals] = useState({ [idName]: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [postLoginRole, setPostLoginRole] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVals((v) => ({ ...v, [name]: value }));
  };

  const primaryRole = () => {
    const roles = authService.getUser()?.roles || [];
    if (!roles.length) return null;
    return String(roles[0]).replace(/^ROLE_/, "");
  };

  const landingPath = (role) => {
    switch (role) {
      case "DAWCA":
        return "/profil";
      case "PUNKT_KRWIODAWSTWA":
      case "MANAGER_PUNKTU_KRWIODAWSTWA":
        return "/punkt-krwiodawstwa/dashboard";
      case "SZPITAL":
        return "/szpital/dashboard";
      case "ADMIN":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await authService.login({
        email: String(vals[idName] || "").trim(),
        password: vals.password,
      });

      if (res?.token) {
        showMessage("Zalogowano pomyślnie.", MessageType.SUCCESS);
      
        const role = primaryRole();
        const user = authService.getUser();
      
        if (user?.mustChangePassword) {
          setPostLoginRole(role);
          setShowPwdModal(true);
        } else {
          window.location.assign(landingPath(role));
        }
      } else {
        showError("Logowanie nie powiodło się.");
      }
      
    } catch (err) {
      const status = err?.response?.status;

      if (status === 401 || status === 403) {
        showError("Nieprawidłowy e-mail lub hasło.");
      } else {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Logowanie nie powiodło się.";
        showError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <article className="bp-card auth-card">
      <div className="auth-card-cap" aria-hidden="true" />
      {title ? <h2 className="auth-card-title">{title}</h2> : null}
      {lead ? (
        <p
          className="login-lead"
          style={{ textAlign: "center", marginTop: -6 }}
        >
          {lead}
        </p>
      ) : null}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <input
            className="input"
            id={idName}
            name={idName}
            type={idType}
            placeholder={idPlaceholder}
            value={vals[idName]}
            onChange={handleChange}
            autoComplete="username"
            required
          />
        </div>

        <div className="form-field">
          <input
            className="input"
            id="password"
            name="password"
            type="password"
            placeholder={passwordPlaceholder}
            value={vals.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
            minLength={6}
          />
        </div>

        <div className="form-actions">
          <CTA label={submitText} type="submit" />
        </div>
      </form>
    </article>
    <ChangePasswordModal
      open={showPwdModal}
      onSuccess={() => {
        setShowPwdModal(false);
        const role = postLoginRole || primaryRole();
        window.location.assign(landingPath(role));
      }}
    />
    </>
  );
}
