import { useEffect, useState } from "react";
import authService from "../../services/AuthenticationService";
import { getAllAppointmentsHistoryForBloodPoint } from "../../services/MakeAppointmentService";

const STATUS_LABELS = {
  UMOWIONA: "Umówiona",
  ODWOLANA: "Odwołana",
  ZREALIZOWANA: "Zrealizowana",
  PRZERWANA: "Przerwana",
};

const PAGE_SIZE = 20;

export default function PointAppointmentsHistory() {
  const pointId = authService.getPointId();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);

  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    if (!pointId) {
      setLoading(false);
      setError("Brak identyfikatora punktu.");
      return;
    }

    setLoading(true);
    setError("");

    getAllAppointmentsHistoryForBloodPoint(pointId)
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setAppointments(arr);
      })
      .catch((e) => {
        const msg =
          (e && e.response && e.response.data && e.response.data.message) ||
          e.message ||
          "Nie udało się pobrać historii wizyt.";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [pointId]);

  if (loading) return <div className="loading">Ładowanie historii wizyt…</div>;
  if (error) return <div className="error">Błąd: {error}</div>;


  const filteredAppointments = appointments.filter((a) => {
    let ok = true;

    if (statusFilter) {
      ok = ok && a.appointmentStatus === statusFilter;
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom + "T00:00:00");
      const apptDate = new Date(a.appointmentDate);
      ok = ok && apptDate >= fromDate;
    }

    if (dateTo) {
      const toDate = new Date(dateTo + "T23:59:59");
      const apptDate = new Date(a.appointmentDate);
      ok = ok && apptDate <= toDate;
    }

    return ok;
  });

  const noDataMessage =
    filteredAppointments.length === 0
      ? appointments.length === 0
        ? "Brak wizyt w historii."
        : "Brak wizyt dla wybranych filtrów."
      : "";

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  const handleDateFromChange = (e) => {
    setDateFrom(e.target.value);
    setPage(0);
  };

  const handleDateToChange = (e) => {
    setDateTo(e.target.value);
    setPage(0);
  };

  const handleResetFilters = () => {
    setStatusFilter("");
    setDateFrom("");
    setDateTo("");
    setPage(0);
  };



  const totalPages =
    filteredAppointments.length > 0
      ? Math.ceil(filteredAppointments.length / PAGE_SIZE)
      : 1;

  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = filteredAppointments.slice(start, end);

  const handlePrev = () => {
    setPage((p) => Math.max(0, p - 1));
  };

  const handleNext = () => {
    setPage((p) => (p + 1 < totalPages ? p + 1 : p));
  };

  return (
    <section className="card visit-history">
      <header className="card-header">
        <h2 className="card-title">Historia wizyt w punkcie</h2>
      </header>

        <div className="bp-form" style={{ marginBottom: "1.5rem" }}>
        <div className="form-field">
          <label className="detail-label" htmlFor="statusFilter">
            Status wizyty
          </label>
          <select
            id="statusFilter"
            className="select"
            value={statusFilter}
            onChange={handleStatusChange}
          >
            <option value="">Wszystkie</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="detail-label" htmlFor="dateFrom">
            Data od
          </label>
          <input
            id="dateFrom"
            type="date"
            className="input"
            value={dateFrom}
            onChange={handleDateFromChange}
          />
        </div>

        <div className="form-field">
          <label className="detail-label" htmlFor="dateTo">
            Data do
          </label>
          <input
            id="dateTo"
            type="date"
            className="input"
            value={dateTo}
            onChange={handleDateToChange}
          />
        </div>

        <div className="form-actions">
          <button className="bp-btn bp-btn--ghost" onClick={handleResetFilters}>
            Wyczyść filtry
          </button>
        </div>
      </div>


      {filteredAppointments.length === 0 ? (
        <div className="no-data">{noDataMessage}</div>
      ) : (
        <>
          <table className="visit-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Godzina</th>
                <th>Pacjent</th>
                <th>PESEL</th>
                <th>E-mail</th>
                <th>Grupa krwi</th>
                <th>Status wizyty</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((a, idx) => {
                const dt = new Date(a.appointmentDate);
                const dateStr = dt.toLocaleDateString();
                const timeStr = dt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr
                    key={a.appointmentId}
                    className={idx % 2 === 0 ? "" : "striped"}
                  >
                    <td>{dateStr}</td>
                    <td>{timeStr}</td>
                    <td>
                      {a.firstName} {a.lastName}
                    </td>
                    <td>{a.pesel}</td>
                    <td>{a.email}</td>
                    <td>{a.bloodGroup ?? "-"}</td>
                    <td>
                      {STATUS_LABELS[a.appointmentStatus] ??
                        a.appointmentStatus}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              marginTop: "16px",
              alignItems: "center",
            }}
          >
            <button
              className="primary-btn"
              onClick={handlePrev}
              disabled={page === 0}
            >
              Poprzednia
            </button>
            <span style={{ fontSize: 14 }}>
              Strona {page + 1} / {totalPages || 1}
            </span>
            <button
              className="primary-btn"
              onClick={handleNext}
              disabled={page + 1 >= totalPages}
            >
              Następna
            </button>
          </div>
        </>
      )}
    </section>
  );
}
