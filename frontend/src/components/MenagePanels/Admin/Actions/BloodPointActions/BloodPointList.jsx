import { useEffect, useState } from "react";
import Header from "../../../../Header/Header";
import Footer from "../../../../Footer/Footer";
import BackButton from "../../../../BackButton/BackButton";

import "../../../../SharedCSS/MenagePanels.css";

import { getPoints } from "../../../../../services/BloodDonationPointService";
import { getStaffByPoint, createEmployee } from "../../../../../services/StaffService";
import {
  showError,
  showMessage,
  showMessages,
} from "../../../../shared/services/MessageService";
import { MessageType } from "../../../../shared/const/MessageType.model";

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

  // 🔹 TYLKO miasto i ulica – BEZ search
  const [filters, setFilters] = useState({
    city: "",
    street: "",
  });

  const [expandedPointId, setExpandedPointId] = useState(null);
  const [staffState, setStaffState] = useState({});
  const [newStaff, setNewStaff] = useState(INITIAL_NEW_STAFF);
  const [creatingStaff, setCreatingStaff] = useState(false);

  useEffect(() => {
    async function loadPoints() {
      setLoadingPoints(true);
      setErrorPoints("");
      try {
        const data = await getPoints();
        if (Array.isArray(data)) {
          setPoints(data);
        } else if (data && Array.isArray(data.resultDTO)) {
          setPoints(data.resultDTO);
        } else {
          setPoints([]);
          setErrorPoints("Niepoprawna odpowiedź z serwera.");
        }
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Nie udało się pobrać listy punktów krwiodawstwa.";
        setErrorPoints(msg);
        setPoints([]);
      } finally {
        setLoadingPoints(false);
      }
    }

    loadPoints();
  }, []);

  useEffect(() => {
    setNewStaff(INITIAL_NEW_STAFF);
  }, [expandedPointId]);

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  }

  function clearFilters() {
    setFilters({ city: "", street: "" });
  }

  const cityOptions = [];
  points.forEach((p) => {
    if (p.city && !cityOptions.includes(p.city)) {
      cityOptions.push(p.city);
    }
  });
  cityOptions.sort((a, b) => a.localeCompare(b, "pl"));

  const streetFilter = filters.street.trim().toLowerCase();

  const filteredPoints = points.filter((p) => {
    const matchCity = !filters.city || p.city === filters.city;

    const matchStreet =
      !streetFilter ||
      (p.street && p.street.toLowerCase().includes(streetFilter));

    return matchCity && matchStreet;
  });

  async function togglePoint(pointId) {
    if (expandedPointId === pointId) {
      setExpandedPointId(null);
      return;
    }

    setExpandedPointId(pointId);

    if (staffState[pointId]?.rows) {
      return;
    }

    setStaffState((prev) => ({
      ...prev,
      [pointId]: { ...(prev[pointId] || {}), loading: true, error: "", rows: [] },
    }));

    try {
      const data = await getStaffByPoint(pointId);
      const list = Array.isArray(data)
        ? data
        : data && Array.isArray(data.resultDTO)
        ? data.resultDTO
        : [];

      if (!Array.isArray(list)) {
        setStaffState((prev) => ({
          ...prev,
          [pointId]: {
            loading: false,
            error: "Niepoprawna odpowiedź z serwera podczas pobierania pracowników.",
            rows: [],
          },
        }));
      } else {
        setStaffState((prev) => ({
          ...prev,
          [pointId]: { loading: false, error: "", rows: list },
        }));
      }
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Nie udało się pobrać listy pracowników.";
      setStaffState((prev) => ({
        ...prev,
        [pointId]: { loading: false, error: msg, rows: [] },
      }));
    }
  }

  function handleNewStaffChange(e) {
    const { name, value } = e.target;
    setNewStaff((s) => ({ ...s, [name]: value }));
  }

  const emailValid =
    !newStaff.email || /\S+@\S+\.\S+/.test(newStaff.email);

  const peselValid =
    !newStaff.pesel || /^\d{11}$/.test(newStaff.pesel);

  const phoneValid =
    !newStaff.phone || /^\d{9}$/.test(newStaff.phone.replace(/\s+/g, ""));

  const firstNameValid =
    !newStaff.firstName || newStaff.firstName.trim().length > 0;

  const lastNameValid =
    !newStaff.lastName || newStaff.lastName.trim().length > 0;

  const positionValid =
    !newStaff.position || newStaff.position.trim().length > 0;

  const genderValid =
    !newStaff.gender ||
    newStaff.gender === "K" ||
    newStaff.gender === "M";

  const birthDateValid =
    !newStaff.birthDate || newStaff.birthDate.trim().length > 0;

  const canCreateStaff =
    expandedPointId &&
    newStaff.firstName.trim() &&
    newStaff.lastName.trim() &&
    newStaff.email.trim() &&
    newStaff.phone.trim() &&
    newStaff.pesel.trim() &&
    newStaff.birthDate &&
    newStaff.gender &&
    newStaff.position &&
    emailValid &&
    peselValid &&
    phoneValid &&
    firstNameValid &&
    lastNameValid &&
    positionValid &&
    genderValid &&
    birthDateValid;

  async function handleCreateStaff(e) {
    e.preventDefault();
    if (!expandedPointId || creatingStaff || !canCreateStaff) return;

    setCreatingStaff(true);

    try {
      const payload = {
        firstName: newStaff.firstName.trim(),
        lastName: newStaff.lastName.trim(),
        email: newStaff.email.trim(),
        phone: newStaff.phone.replace(/\s+/g, "").trim(),
        pesel: newStaff.pesel.trim(),
        birthDate: newStaff.birthDate || null,
        gender: newStaff.gender,
        position: newStaff.position,
      };

      const res = await createEmployee(expandedPointId, payload);

      const backendMessages = res?.messages;
      if (Array.isArray(backendMessages) && backendMessages.length > 0) {
        showMessages(
          backendMessages.map((m) => ({
            msg: m.msg,
            type: MessageType[m.type] || MessageType.INFO,
          }))
        );
      } else {
        showMessage(
          "Pracownik został zarejestrowany. Tymczasowe hasło zostało wygenerowane i wysłane mailem.",
          MessageType.SUCCESS
        );
      }

      const created = res?.resultDTO || null;

      setStaffState((prev) => {
        const prevState = prev[expandedPointId] || {
          loading: false,
          error: "",
          rows: [],
        };
        return {
          ...prev,
          [expandedPointId]: {
            ...prevState,
            rows: created
              ? [...(prevState.rows || []), created]
              : prevState.rows,
          },
        };
      });

      setNewStaff(INITIAL_NEW_STAFF);
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
          `Nie udało się zarejestrować pracownika (status ${status || "?"}).`;
        showError(msg);
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
        <BackButton to="/admin/panel/punkt-krwiodawstwa" label="Powrót do panelu Punktu Krwiodawstwa"/>
          <article className="bp-card">
            <div className="dashboard-head">
              <h2 className="dashboard-title">
                Lista Punktów Krwiodawstwa
              </h2>
              <p className="dashboard-lead">
                Poniżej znajduje się lista wszystkich zarejestrowanych punktów.
              </p>
            </div>

            {!loadingPoints && points.length > 0 && (
              <form
                className="bp-form staff-search"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="form-field">
                  <label className="label" htmlFor="cityFilter">
                    Miasto
                  </label>
                  <select
                    id="cityFilter"
                    name="city"
                    className="select"
                    value={filters.city}
                    onChange={handleFilterChange}
                  >
                    <option value="">Wszystkie</option>
                    {cityOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="streetFilter">
                    Ulica
                  </label>
                  <input
                    id="streetFilter"
                    name="street"
                    className="input"
                    type="text"
                    placeholder="Filtruj po ulicy"
                    value={filters.street}
                    onChange={handleFilterChange}
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="bp-btn bp-btn--ghost"
                    onClick={clearFilters}
                  >
                    Wyczyść filtry
                  </button>
                </div>
              </form>
            )}

            {loadingPoints ? (
              <div className="bp-state">Wczytywanie danych...</div>
            ) : errorPoints ? (
              <div className="bp-state error">{errorPoints}</div>
            ) : !points.length ? (
              <div className="bp-state">
                Brak zarejestrowanych punktów krwiodawstwa.
              </div>
            ) : !filteredPoints.length ? (
              <div className="bp-state">
                Brak wyników dla wybranych filtrów.
              </div>
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
                      const staff = staffState[p.id] || {
                        loading: false,
                        error: "",
                        rows: [],
                      };

                      return (
                        <FragmentWithKey key={p.id}>
                          <tr>
                            <td data-label="Miasto">{p.city}</td>
                            <td data-label="Ulica">{p.street}</td>
                            <td data-label="Kod pocztowy">{p.zipCode}</td>
                            <td data-label="Telefon">{p.phone}</td>
                            <td data-label="Akcje">
                              <button
                                type="button"
                                className="bp-btn"
                                onClick={() => togglePoint(p.id)}
                              >
                                {isExpanded
                                  ? "Zwiń pracowników"
                                  : "Pokaż pracowników"}
                              </button>
                            </td>
                          </tr>

                          {isExpanded && (
                            <tr>
                              <td colSpan={5}>
                                <section className="bp-subcard">
                                  <h3 className="dashboard-subtitle">
                                    Pracownicy punktu
                                  </h3>

                                  {staff.loading ? (
                                    <div className="bp-state">
                                      Ładowanie pracowników...
                                    </div>
                                  ) : staff.error ? (
                                    <div className="bp-state error">
                                      {staff.error}
                                    </div>
                                  ) : !staff.rows.length ? (
                                    <div className="bp-state">
                                      Brak zarejestrowanych pracowników
                                      w tym punkcie.
                                    </div>
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
                                              <td>
                                                {s.firstName} {s.lastName}
                                              </td>
                                              <td>{s.position || "—"}</td>
                                              <td>
                                                {s.employmentStartDay
                                                  ? new Date(
                                                      s.employmentStartDay
                                                    ).toLocaleDateString(
                                                      "pl-PL"
                                                    )
                                                  : "—"}
                                              </td>
                                              <td>{s.email}</td>
                                              <td>{s.pesel}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}

                                  <div className="staff-form-wrapper">
                                    <form
                                      className="bp-form staff-form staff-form--narrow"
                                      onSubmit={handleCreateStaff}
                                      noValidate
                                    >
                                      <h4 className="auth-section-title staff-form-title">
                                        Dodaj nowego pracownika
                                      </h4>

                                      <div className="form-field">
                                        <label className="label" htmlFor="newStaffFirstName">
                                          Imię
                                        </label>
                                        <input
                                          id="newStaffFirstName"
                                          name="firstName"
                                          className="input"
                                          type="text"
                                          value={newStaff.firstName}
                                          onChange={handleNewStaffChange}
                                          required
                                        />
                                        {!firstNameValid && newStaff.firstName && (
                                          <div className="field-error">
                                            Podaj poprawne imię.
                                          </div>
                                        )}
                                      </div>

                                      <div className="form-field">
                                        <label className="label" htmlFor="newStaffLastName">
                                          Nazwisko
                                        </label>
                                        <input
                                          id="newStaffLastName"
                                          name="lastName"
                                          className="input"
                                          type="text"
                                          value={newStaff.lastName}
                                          onChange={handleNewStaffChange}
                                          required
                                        />
                                        {!lastNameValid && newStaff.lastName && (
                                          <div className="field-error">
                                            Podaj poprawne nazwisko.
                                          </div>
                                        )}
                                      </div>

                                      <div className="form-field">
                                        <label className="label" htmlFor="newStaffEmail">
                                          E-mail (login)
                                        </label>
                                        <input
                                          id="newStaffEmail"
                                          name="email"
                                          className="input"
                                          type="email"
                                          value={newStaff.email}
                                          onChange={handleNewStaffChange}
                                          required
                                        />
                                        {!emailValid && newStaff.email && (
                                          <div className="field-error">
                                            Podaj poprawny adres e-mail.
                                          </div>
                                        )}
                                      </div>

                                      <div className="form-field">
                                        <label className="label" htmlFor="newStaffPhone">
                                          Telefon
                                        </label>
                                        <input
                                          id="newStaffPhone"
                                          name="phone"
                                          className="input"
                                          type="tel"
                                          value={newStaff.phone}
                                          onChange={handleNewStaffChange}
                                          required
                                        />
                                        {!phoneValid && newStaff.phone && (
                                          <div className="field-error">
                                            Numer telefonu musi mieć 9 cyfr.
                                          </div>
                                        )}
                                      </div>

                                      <div className="form-field">
                                        <label className="label" htmlFor="newStaffPesel">
                                          PESEL
                                        </label>
                                        <input
                                          id="newStaffPesel"
                                          name="pesel"
                                          className="input"
                                          type="text"
                                          maxLength={11}
                                          value={newStaff.pesel}
                                          onChange={handleNewStaffChange}
                                          required
                                        />
                                        {!peselValid && newStaff.pesel && (
                                          <div className="field-error">
                                            PESEL musi składać się z 11 cyfr.
                                          </div>
                                        )}
                                      </div>

                                      <div className="form-field">
                                        <label className="label" htmlFor="newStaffBirthDate">
                                          Data urodzenia
                                        </label>
                                        <input
                                          id="newStaffBirthDate"
                                          name="birthDate"
                                          className="input"
                                          type="date"
                                          value={newStaff.birthDate}
                                          onChange={handleNewStaffChange}
                                          max={new Date().toISOString().split("T")[0]}
                                          required
                                        />
                                        {!birthDateValid && newStaff.birthDate && (
                                          <div className="field-error">
                                            Podaj datę urodzenia.
                                          </div>
                                        )}
                                      </div>

                                      <div className="form-field">
                                        <label className="label" htmlFor="newStaffGender">
                                          Płeć
                                        </label>
                                        <select
                                          id="newStaffGender"
                                          name="gender"
                                          className="input"
                                          value={newStaff.gender}
                                          onChange={handleNewStaffChange}
                                          required
                                        >
                                          <option value="K">Kobieta</option>
                                          <option value="M">Mężczyzna</option>
                                        </select>
                                        {!genderValid && newStaff.gender && (
                                          <div className="field-error">
                                            Wybierz poprawną płeć.
                                          </div>
                                        )}
                                      </div>

                                      <div className="form-field">
                                        <label className="label" htmlFor="newStaffPosition">
                                          Stanowisko
                                        </label>
                                        <select
                                          id="newStaffPosition"
                                          name="position"
                                          className="select"
                                          value={newStaff.position}
                                          onChange={handleNewStaffChange}
                                          required
                                        >
                                          <option value="">— wybierz —</option>
                                          <option value="Lekarz">Lekarz</option>
                                          <option value="Pielegniarka">Pielęgniarka</option>
                                          <option value="Recepcjonistka">Recepcjonistka</option>
                                          {/* brak Menadzer */}
                                        </select>
                                        {!positionValid && newStaff.position && (
                                          <div className="field-error">
                                            Wybierz stanowisko.
                                          </div>
                                        )}
                                      </div>

                                      <div className="form-actions staff-form-actions">
                                        <button
                                          type="submit"
                                          className="bp-btn"
                                          disabled={creatingStaff || !canCreateStaff}
                                        >
                                          {creatingStaff
                                            ? "Zapisywanie..."
                                            : "Dodaj pracownika"}
                                        </button>
                                      </div>

                                      {!canCreateStaff && (
                                        <div className="auth-note staff-form-note">
                                          Uzupełnij poprawnie wszystkie wymagane pola, w tym dane
                                          kontaktowe, PESEL oraz stanowisko.
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