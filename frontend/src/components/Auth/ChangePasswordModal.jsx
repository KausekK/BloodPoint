import { useState, useMemo } from "react";
import CTA from "../CTA/CTA";
import {
  showMessages,
  showError,
} from "../shared/services/MessageService";
import { MessageType } from "../shared/const/MessageType.model";
import authService from "../../services/AuthenticationService";
import "../SharedCSS/LoginForms.css";

export default function ChangePasswordModal({ open, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const passwordsOk = useMemo(
    () =>
      form.newPassword.length >= 6 &&
      form.newPassword === form.confirmNewPassword,
    [form]
  );

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordsOk || submitting) return;

    setSubmitting(true);
    try {
      const res = await authService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmNewPassword: form.confirmNewPassword,
      });

      if (Array.isArray(res?.messages) && res.messages.length > 0) {
        showMessages(
          res.messages.map((m) => ({
            msg: m.msg,
            type: MessageType[m.type] || MessageType.INFO,
          }))
        );
      } else {
        showError("Nie udało się zmienić hasła.");
        return;
      }

      const user = authService.getUser();
      if (user) {
        const updated = { ...user, changedPassword: false };
        localStorage.setItem("currentUser", JSON.stringify(updated));
      }

      if (typeof onSuccess === "function") {
        onSuccess();
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
        const msg =
          backendData?.message ||
          backendData?.error ||
          err?.message ||
          "Nie udało się zmienić hasła.";
        showError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-center">
        <article className="bp-card auth-card">
          <div className="auth-card-cap" aria-hidden="true" />
          <h2 className="auth-card-title">Ustaw nowe hasło</h2>
          <p style={{ marginBottom: 16 }}>
            Musisz ustawić nowe hasło przed dalszym korzystaniem z systemu.
          </p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <input
                className="input"
                type="password"
                name="currentPassword"
                placeholder="Obecne hasło"
                value={form.currentPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <input
                className="input"
                type="password"
                name="newPassword"
                placeholder="Nowe hasło (min. 6 znaków)"
                value={form.newPassword}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>

            <div className="form-field">
              <input
                className="input"
                type="password"
                name="confirmNewPassword"
                placeholder="Powtórz nowe hasło"
                value={form.confirmNewPassword}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>

            {!passwordsOk &&
              (form.newPassword || form.confirmNewPassword) && (
                <div className="auth-note">
                  Nowe hasła muszą być takie same i mieć co najmniej 6 znaków.
                </div>
              )}

            <div className="form-actions">
              <CTA
                label={submitting ? "Zapisywanie..." : "Zapisz nowe hasło"}
                type="submit"
                disabled={!passwordsOk || submitting}
              />
            </div>
          </form>
        </article>
      </div>
    </div>
  );
}
