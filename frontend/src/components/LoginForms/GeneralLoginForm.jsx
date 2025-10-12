import { useState } from "react";
import "./GeneralLoginForm.css"; 
import CTA from "../CTA/CTA";

export default function GeneralLoginForm({
  loginType,
  idName = "identifier", 
  idType = "text",
  idPlaceholder,
  passwordPlaceholder = "Hasło",
  submitText = "Zaloguj się",
  onSubmit,
}) {
  const [vals, setVals] = useState({ [idName]: "", password: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setVals(v => ({ ...v, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (onSubmit) onSubmit({ type: loginType, identifier: vals[idName], password: vals.password });
  }

  return (
    <article className="bp-card auth-card">
      <div className="auth-card-cap" aria-hidden="true" />
      {loginType ? <h2 className="auth-card-title">{loginType}</h2> : null}

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
  );
}
