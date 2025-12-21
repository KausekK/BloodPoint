import { useEffect, useState, useMemo } from "react";
import Header from "../../../../Header/Header";
import Footer from "../../../../Footer/Footer";
import BackButton from "../../../../BackButton/BackButton";

import "../../../../SharedCSS/MenagePanels.css";

import { getPoints } from "../../../../../services/BloodDonationPointService";
import {
  getStaffByPoint,
  createEmployee,
} from "../../../../../services/StaffService";
import {
  showError,
  showMessage,
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

  const [filters, setFilters] = useState({ city: "", street: "" });

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
        setPoints(
          Array.isArray(data)
            ? data
            : Array.isArray(data?.resultDTO)
            ? data.resultDTO
            : []
        );
      } catch (err) {
        setErrorPoints(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Nie udało się pobrać listy punktów krwiodawstwa."
        );
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

  const cityOptions = useMemo(() => {
    const set = new Set(points.map((p) => p.city).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pl"));
  }, [points]);

  const filteredPoints = points.filter((p) => {
    const matchCity = !filters.city || p.city === filters.city;
    const matchStreet =
      !filters.street ||
      p.street?.toLowerCase().includes(filters.street.toLowerCase());
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
      [pointId]: { loading: true, error: "", rows: [] },
    }));

    try {
      const data = await getStaffByPoint(pointId);
      const rows = Array.isArray(data)
        ? data
        : Array.isArray(data?.resultDTO)
        ? data.resultDTO
        : [];

      setStaffState((prev) => ({
        ...prev,
        [pointId]: { loading: false, error: "", rows },
      }));
    } catch (err) {
      setStaffState((prev) => ({
        ...prev,
        [pointId]: {
          loading: false,
          error:
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Nie udało się pobrać listy pracowników.",
          rows: [],
        },
      }));
    }
  }


  function handleNewStaffChange(e) {
    const { name, value } = e.target;
    setNewStaff((s) => ({ ...s, [name]: value }));
  }

  const emailValid = useMemo(
    () => !newStaff.email || /\S+@\S+\.\S+/.test(newStaff.email),
    [newStaff.email]
  );
  const peselValid = useMemo(
    () => !newStaff.pesel || /^\d{11}$/.test(newStaff.pesel),
    [newStaff.pesel]
  );
  const phoneValid = useMemo(
    () => !newStaff.phone || /^\d{9}$/.test(newStaff.phone.replace(/\s+/g, "")),
    [newStaff.phone]
  );

  const canCreateStaff = useMemo(() => {
    return (
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
      phoneValid
    );
  }, [expandedPointId, newStaff, emailValid, peselValid, phoneValid]);

  async function handleCreateStaff(e) {
    e.preventDefault();
    if (!canCreateStaff || creatingStaff) return;

    setCreatingStaff(true);

    try {
      const res = await createEmployee(expandedPointId, {
        firstName: newStaff.firstName.trim(),
        lastName: newStaff.lastName.trim(),
        email: newStaff.email.trim().toLowerCase(),
        phone: newStaff.phone.replace(/\s+/g, ""),
        pesel: newStaff.pesel.trim(),
        birthDate: newStaff.birthDate,
        gender: newStaff.gender,
        position: newStaff.position,
      });

      showMessage(
        "Pracownik został zarejestrowany. Tymczasowe hasło zostało wysłane e-mailem.",
        MessageType.SUCCESS
      );

      if (res?.resultDTO) {
        setStaffState((prev) => ({
          ...prev,
          [expandedPointId]: {
            ...prev[expandedPointId],
            rows: [...prev[expandedPointId].rows, res.resultDTO],
          },
        }));
      }

      setNewStaff(INITIAL_NEW_STAFF);
    } catch (err) {
      showError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Nie udało się zarejestrować pracownika."
      );
    } finally {
      setCreatingStaff(false);
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

          <article className="bp-card">
            <h2 className="dashboard-title">Lista Punktów Krwiodawstwa</h2>

            {loadingPoints ? (
              <div className="bp-state">Wczytywanie danych…</div>
            ) : errorPoints ? (
              <div className="bp-state error">{errorPoints}</div>
            ) : (
              <div className="table-wrap">
                <table className="bp-table">
                  <tbody>
                    {filteredPoints.map((p) => (
                      <tr key={p.id}>
                        <td>{p.city}</td>
                        <td>{p.street}</td>
                        <td>{p.zipCode}</td>
                        <td>{p.phone}</td>
                        <td>
                          <button
                            className="bp-btn"
                            onClick={() => togglePoint(p.id)}
                          >
                            {expandedPointId === p.id
                              ? "Zwiń"
                              : "Pokaż pracowników"}
                          </button>
                        </td>
                      </tr>
                    ))}
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
