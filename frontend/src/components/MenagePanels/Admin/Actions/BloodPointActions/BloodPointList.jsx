import { useEffect, useState } from "react";
import Header from "../../../../Header/Header";
import Footer from "../../../../Footer/Footer";
import BackButton from "../../../../BackButton/BackButton";

import "../../../../SharedCSS/MenagePanels.css";

import { getPoints } from "../../../../../services/BloodDonationPointService";
import { getStaffByPoint, createEmployee } from "../../../../../services/StaffService";
import {
  showError, 
  showMessages, 
  showMessage 
} from "../../../../shared/services/MessageService";
import { MessageType } from "../../../../shared/const/MessageType.model";
import { STAFF_POSITION_OPTIONS } from "../../../../../constants/staffPositions";

import { useFormValidation } from "../../../../shared/utils/useFormValidation";
import { validators } from "../../../../shared/utils/validators";
import { fieldClass, shouldShowError } from "../../../../shared/utils/formValidation";
import { EARLIEST_BIRTH_DATE, getTodayDate  } from "../../../../shared/const/dateLimits";

const INITIAL_NEW_STAFF = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  pesel: "",
  birthDate: "",
  gender: "K",
  position: "",
};

export default function BloodPointList() {
  const [points, setPoints] = useState([]);
  const [loadingPoints, setLoadingPoints] = useState(true);
  const [errorPoints, setErrorPoints] = useState("");
  const [filters, setFilters] = useState({ city: "", street: "" });

  const [expandedPointId, setExpandedPointId] = useState(null);
  const [staffState, setStaffState] = useState({});
  const [newStaff, setNewStaff] = useState(INITIAL_NEW_STAFF);
  const [creatingStaff, setCreatingStaff] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    async function loadPoints() {
      setLoadingPoints(true);
      setErrorPoints("");
      try {
        const data = await getPoints();
        if (Array.isArray(data)) setPoints(data);
        else if (data?.resultDTO) setPoints(data.resultDTO);
        else {
          setPoints([]);
          setErrorPoints("Niepoprawna odpowiedź z serwera.");
        }
      } catch (err) {
        setErrorPoints(err?.message || "Nie udało się pobrać listy punktów krwiodawstwa.");
      } finally {
        setLoadingPoints(false);
      }
    }
    loadPoints();
  }, []);

  useEffect(() => {
    setNewStaff(INITIAL_NEW_STAFF);
    setSubmitAttempted(false);
  }, [expandedPointId]);

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  }

  function clearFilters() {
    setFilters({ city: "", street: "" });
  }

  const cityOptions = [...new Set(points.map((p) => p.city).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "pl")
  );

  const filteredPoints = points.filter((p) => {
    const matchCity = !filters.city || p.city === filters.city;
    const matchStreet = !filters.street || (p.street && p.street.toLowerCase().includes(filters.street.toLowerCase()));
    return matchCity && matchStreet;
  });

  async function togglePoint(pointId) {
    if (expandedPointId === pointId) {
      setExpandedPointId(null);
      return;
    }
    setExpandedPointId(pointId);

    if (staffState[pointId]?.rows) return;

    setStaffState((prev) => ({
      ...prev,
      [pointId]: { ...(prev[pointId] || {}), loading: true, error: "", rows: [] },
    }));

    try {
      const data = await getStaffByPoint(pointId);
      const list = Array.isArray(data) ? data : data?.resultDTO || [];
      setStaffState((prev) => ({
        ...prev,
        [pointId]: { loading: false, error: "", rows: list },
      }));
    } catch (e) {
      setStaffState((prev) => ({
        ...prev,
        [pointId]: { loading: false, error: e?.message || "Nie udało się pobrać listy pracowników.", rows: [] },
      }));
    }
  }

  function handleNewStaffChange(e) {
    const { name, value } = e.target;
    setNewStaff((s) => ({ ...s, [name]: value }));
  }

  const rules = {
    firstName: [validators.required],
    lastName: [validators.required],
    email: [validators.required, validators.email],
    phone: [validators.required, validators.phone],
    pesel: [validators.required, validators.pesel],
    birthDate: [validators.required, validators.birthDate],
    gender: [validators.required, validators.gender],
    position: [validators.required],
  };

  const { fields, isValid } = useFormValidation(newStaff, rules);
  const canCreateStaff = isValid;
  const birthDateError = validators.birthDate(newStaff.birthDate);

  async function handleCreateStaff(e) {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!expandedPointId || creatingStaff || !canCreateStaff) return;

    setCreatingStaff(true);
    try {
      const payload = {
        ...newStaff,
        phone: newStaff.phone.replace(/\s+/g, "").trim(),
        birthDate: newStaff.birthDate || null,
      };

      const res = await createEmployee(expandedPointId, payload);

      const backendMessages = Array.isArray(res?.messages) ? res.messages : [];
      if (backendMessages.length > 0) {
        showMessages(
          backendMessages.map((m) => ({ msg: m.msg, type: MessageType[m.type] || MessageType.INFO }))
        );
      } else {
        showMessage(
          "Pracownik został zarejestrowany. Tymczasowe hasło zostało wysłane mailem.",
          MessageType.SUCCESS
        );
      }

      const created = res?.resultDTO;
      setStaffState((prev) => {
        const prevState = prev[expandedPointId] || { rows: [] };
        return { ...prev, [expandedPointId]: { ...prevState, rows: created ? [...prevState.rows, created] : prevState.rows } };
      });

      setNewStaff(INITIAL_NEW_STAFF);
      setSubmitAttempted(false);
    } catch (err) {
      const backendMessages = err?.response?.data?.messages;
      if (Array.isArray(backendMessages) && backendMessages.length > 0) {
        showMessages(
          backendMessages.map((m) => ({ msg: m.msg, type: MessageType[m.type] || MessageType.INFO }))
        );
      } else {
        showError(err?.message || "Nie udało się zarejestrować pracownika.");
      }
    } finally {
      setCreatingStaff(false);
    }
  }

  return (
    <>
      <Header />
      <main className="bp-section">
        <div className="bp-container">
          <BackButton to="/admin/panel/punkt-krwiodawstwa" label="Powrót do panelu Punktu Krwiodawstwa" />
          <article className="bp-card">
            <div className="dashboard-head">
              <h2 className="dashboard-title">Lista Punktów Krwiodawstwa</h2>
              <p className="dashboard-lead">Poniżej znajduje się lista wszystkich zarejestrowanych punktów.</p>
            </div>

            {!loadingPoints && points.length > 0 && (
              <form className="bp-form staff-search" onSubmit={(e) => e.preventDefault()}>
                <div className="form-field">
                  <label className="label" htmlFor="cityFilter">Miasto</label>
                  <select id="cityFilter" name="city" className="select" value={filters.city} onChange={handleFilterChange}>
                    <option value="">Wszystkie</option>
                    {cityOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="streetFilter">Ulica</label>
                  <input id="streetFilter" name="street" className="input" value={filters.street} onChange={handleFilterChange} placeholder="Filtruj po ulicy"/>
                </div>

                <div className="form-actions">
                  <button type="button" className="bp-btn bp-btn--ghost" onClick={clearFilters}>Wyczyść filtry</button>
                </div>
              </form>
            )}

            {loadingPoints ? (
              <div className="bp-state">Wczytywanie danych...</div>
            ) : errorPoints ? (
              <div className="bp-state error">{errorPoints}</div>
            ) : !points.length ? (
              <div className="bp-state">Brak zarejestrowanych punktów krwiodawstwa.</div>
            ) : !filteredPoints.length ? (
              <div className="bp-state">Brak wyników dla wybranych filtrów.</div>
            ) : (
              <div className="table-wrap">
                <table className="bp-table">
                  <thead>
                    <tr>
                      <th>Miasto</th>
                      <th>Ulica</th>
                      <th>Kod pocztowy</th>
                      <th>Telefon</th>
                      <th className="table-actions">Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPoints.map((p) => {
                      const isExpanded = expandedPointId === p.id;
                      const staff = staffState[p.id] || { loading: false, error: "", rows: [] };

                      return (
                        <FragmentWithKey key={p.id}>
                          <tr>
                            <td data-label="Miasto">{p.city}</td>
                            <td data-label="Ulica">{p.street}</td>
                            <td data-label="Kod pocztowy">{p.zipCode}</td>
                            <td data-label="Telefon">{p.phone}</td>
                            <td data-label="Akcje">
                              <button type="button" className="bp-btn" onClick={() => togglePoint(p.id)}>
                                {isExpanded ? "Zwiń pracowników" : "Pokaż pracowników"}
                              </button>
                            </td>
                          </tr>

                          {isExpanded && (
                            <tr>
                              <td colSpan={5}>
                                <section className="bp-subcard">
                                  <h3 className="dashboard-subtitle">Pracownicy punktu</h3>

                                  {staff.loading ? (
                                    <div className="bp-state">Ładowanie pracowników...</div>
                                  ) : staff.error ? (
                                    <div className="bp-state error">{staff.error}</div>
                                  ) : !staff.rows.length ? (
                                    <div className="bp-state">Brak zarejestrowanych pracowników w tym punkcie.</div>
                                  ) : (
                                    <div className="table-wrap">
                                      <table className="bp-table bp-table--inner">
                                        <thead>
                                          <tr>
                                            <th>Imię i nazwisko</th>
                                            <th>Stanowisko</th>
                                            <th>Data zatrudnienia</th>
                                            <th>E-mail</th>
                                            <th>PESEL</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {staff.rows.map((s) => (
                                            <tr key={s.userId}>
                                              <td>{s.firstName} {s.lastName}</td>
                                              <td>{s.position || "—"}</td>
                                              <td>{s.employmentStartDay ? new Date(s.employmentStartDay).toLocaleDateString("pl-PL") : "—"}</td>
                                              <td>{s.email}</td>
                                              <td>{s.pesel}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}

                                  <div className="staff-form-wrapper">
                                    <form className="bp-form staff-form staff-form--narrow" onSubmit={handleCreateStaff} noValidate>
                                      <h4 className="auth-section-title staff-form-title">Dodaj nowego pracownika</h4>

                                      <div className="form-field">
                                        <label htmlFor="firstName">Imię</label>
                                        <input
                                          id="firstName"
                                          name="firstName"
                                          className={fieldClass(fields.firstName, submitAttempted)}
                                          value={newStaff.firstName}
                                          onChange={handleNewStaffChange}
                                        />
                                        {shouldShowError(fields.firstName, submitAttempted, newStaff.firstName) && (
                                          <div className="field-error">Podaj poprawne imię.</div>
                                        )}
                                      </div>

                                      <div className="form-field">
                                        <label htmlFor="lastName">Nazwisko</label>
                                        <input
                                          id="lastName"
                                          name="lastName"
                                          className={fieldClass(fields.lastName, submitAttempted)}
                                          value={newStaff.lastName}
                                          onChange={handleNewStaffChange}
                                        />
                                        {shouldShowError(fields.lastName, submitAttempted, newStaff.lastName) && (
                                          <div className="field-error">Podaj poprawne nazwisko.</div>
                                        )}
                                      </div>

                                      <div className="form-field">
                                        <label htmlFor="email">E-mail</label>
                                        <input
                                          id="email"
                                          name="email"
                                          className={fieldClass(fields.email, submitAttempted)}
                                          value={newStaff.email}
                                          onChange={handleNewStaffChange}
                                        />
                                        {shouldShowError(fields.email, submitAttempted, newStaff.email) && (
                                          <div className="field-error">Podaj poprawny adres e-mail.</div>
                                        )}
                                      </div>

                                      <div className="form-field">
                                        <label htmlFor="phone">Telefon</label>
                                        <input
                                          id="phone"
                                          name="phone"
                                          className={fieldClass(fields.phone, submitAttempted)}
                                          value={newStaff.phone}
                                          onChange={handleNewStaffChange}
                                        />
                                        {shouldShowError(fields.phone, submitAttempted, newStaff.phone) && (
                                          <div className="field-error">Numer telefonu musi mieć 9 cyfr.</div>
                                        )}
                                      </div>

                                      <div className="form-field">
                                        <label htmlFor="pesel">PESEL</label>
                                        <input
                                          id="pesel"
                                          name="pesel"
                                          className={fieldClass(fields.pesel, submitAttempted)}
                                          value={newStaff.pesel}
                                          onChange={handleNewStaffChange}
                                        />
                                        {shouldShowError(fields.pesel, submitAttempted, newStaff.pesel) && (
                                          <div className="field-error">PESEL musi zawierać 11 cyfr.</div>
                                        )}
                                      </div>

                                      <div className="form-field">
                                        <label htmlFor="birthDate">Data urodzenia</label>
                                        <input
                                          id="birthDate"
                                          name="birthDate"
                                          max={getTodayDate()}
                                          min={EARLIEST_BIRTH_DATE}
                                          type="date"
                                          className={fieldClass(fields.birthDate, submitAttempted)}
                                          value={newStaff.birthDate}
                                          onChange={handleNewStaffChange}
                                        />
                                        {submitAttempted && birthDateError === "REQUIRED" && (
                                          <div className="field-error">Podaj datę urodzenia.</div>
                                        )}
                                        {submitAttempted && birthDateError === "TOO_YOUNG" && (
                                          <div className="field-error">Pracownik musi mieć co najmniej 18 lat.</div>
                                        )}
                                        {submitAttempted && birthDateError === "TOO_OLD" && (
                                          <div className="field-error">Wybrana data jest zbyt odległa w przeszłość.</div>
                                        )}
                                        {submitAttempted && birthDateError === "FUTURE_DATE" && (
                                          <div className="field-error">Data nie może być w przyszłości.</div>
                                        )}
                                        </div>

                                      <div className="form-field">
                                        <label htmlFor="gender">Płeć</label>
                                        <select
                                          id="gender"
                                          name="gender"
                                          className={fieldClass(fields.gender, submitAttempted, "input")}
                                          value={newStaff.gender}
                                          onChange={handleNewStaffChange}
                                        >
                                          <option value="K">Kobieta</option>
                                          <option value="M">Mężczyzna</option>
                                        </select>
                                        {shouldShowError(fields.gender, submitAttempted, newStaff.gender) && (
                                          <div className="field-error">Wybierz poprawną płeć.</div>
                                        )}
                                      </div>

                                      <div className="form-field">
                                        <label htmlFor="position">Stanowisko</label>
                                        <select
                                          id="position"
                                          name="position"
                                          className={fieldClass(fields.position, submitAttempted, "select")}
                                          value={newStaff.position}
                                          onChange={handleNewStaffChange}
                                        >
                                          <option value="">— wybierz —</option>
                                          {STAFF_POSITION_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                          ))}
                                        </select>
                                        {shouldShowError(fields.position, submitAttempted, newStaff.position) && (
                                          <div className="field-error">Wybierz stanowisko.</div>
                                        )}
                                      </div>

                                      <div className="form-actions">
                                        <button type="submit" className="bp-btn">
                                          {creatingStaff ? "Zapisywanie..." : "Dodaj pracownika"}
                                        </button>
                                      </div>

                                      {!canCreateStaff && submitAttempted && (
                                        <div className="auth-note">
                                          Uzupełnij poprawnie wszystkie wymagane pola.
                                        </div>
                                      )}
                                    </form>
                                  </div>
                                </section>
                              </td>
                            </tr>
                          )}
                        </FragmentWithKey>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

function FragmentWithKey({ children }) {
  return <>{children}</>;
}