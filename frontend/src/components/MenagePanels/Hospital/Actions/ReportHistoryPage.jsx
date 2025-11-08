import { useEffect, useMemo, useState } from "react";
import Header from "../../../Header/Header";
import Footer from "../../../Footer/Footer";
import { getHospitalRequests } from "../../../../services/BloodRequestService";
import { showError } from "../../../shared/services/MessageService";
import "../../../SharedCSS/MenagePanels.css";

import { formatAmount } from "../../../shared/utils/number";

export default function ReportHistoryPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // TODO podlaczyc zalogowany szpital
  const hospitalId = 1;

  const loadRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getHospitalRequests(hospitalId);
      if (Array.isArray(data)) setRequests(data);
      else setError("Niepoprawna odpowiedź z serwera.");
    } catch (e) {
      console.error(e);
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Błąd podczas pobierania zgłoszeń.";
      showError(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hospitalId) loadRequests();
  }, [hospitalId]);

  const filtered = useMemo(() => {
    if (!statusFilter) return requests;
    return requests.filter(
      (r) => r.status?.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [requests, statusFilter]);

  const availableStatuses = useMemo(() => {
    const all = Array.from(new Set(requests.map((r) => r.status).filter(Boolean)));
    return all.sort();
  }, [requests]);

  return (
    <>
      <Header />
      <main className="bp-section">
        <div className="bp-container">
          <header className="dashboard-head">
            <h1 className="dashboard-title">Historia zgłoszeń zapotrzebowania</h1>
            <p className="dashboard-lead">
              Lista wszystkich zgłoszeń Twojego szpitala oraz ich aktualny status.
            </p>
          </header>

          <section className="bp-card">
            {/* 🔍 Filtr po statusie */}
            <form
              className="bp-form"
              onSubmit={(e) => e.preventDefault()}
              style={{ marginBottom: "10px" }}
            >
              <div className="form-field">
                <label htmlFor="statusFilter">Status</label>
                <select
                  id="statusFilter"
                  className="select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">— wszystkie —</option>
                  {availableStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="bp-btn bp-btn--ghost"
                  onClick={() => setStatusFilter("")}
                >
                  Wyczyść filtr
                </button>
                <button
                  type="button"
                  className="bp-btn"
                  onClick={loadRequests}
                  disabled={loading}
                >
                  Odśwież listę
                </button>
              </div>
            </form>

            {loading && <div className="bp-state">Ładowanie danych...</div>}
            {error && <div className="bp-state error">{error}</div>}
            {!loading && !error && filtered.length === 0 && (
              <div className="bp-state">Brak zgłoszeń do wyświetlenia.</div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <div className="table-wrap">
                <table className="bp-table">
                  <thead>
                    <tr>
                      <th>Grupa krwi</th>
                      <th>Ilość (l)</th>
                      <th>Status</th>
                      <th>Data utworzenia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.id}>
                        <td data-label="Grupa krwi">
                          <strong>{r.bloodTypeLabel}</strong>
                        </td>
                        <td data-label="Ilość">{formatAmount(r.amount, 3)} l</td> 
                        <td data-label="Status">
                          <span
                            className={
                              "status-tag " +
                              (r.status?.toLowerCase() === "nowa"
                                ? "status-new"
                                : r.status?.toLowerCase() === "zrealizowana"
                                ? "status-done"
                                : "status-other")
                            }
                          >
                            {r.status}
                          </span>
                        </td>
                        <td data-label="Data">
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleDateString("pl-PL")
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
