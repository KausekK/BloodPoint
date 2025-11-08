import { useEffect, useState } from "react";
import Header from "../../../Header/Header";
import Footer from "../../../Footer/Footer";
import authService from "../../../../services/AuthenticationService";
import { getHospitalRequests } from "../../../../services/BloodRequestService";
import { showError } from "../../../shared/services/MessageService";
import "../../../SharedCSS/MenagePanels.css";

export default function ReportHistoryPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ID szpitala pobierany z tokena / sesji
  const hospitalId = authService.getHospitalId();

  const loadRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getHospitalRequests(hospitalId);
      if (Array.isArray(data)) setRequests(data);
      else setError("Niepoprawna odpowiedź z serwera.");
    } catch (e) {
      console.error(e);
      const msg = e?.response?.data?.message || e?.message || "Błąd podczas pobierania zgłoszeń.";
      showError(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hospitalId) loadRequests();
  }, [hospitalId]);

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
            {loading && <div className="bp-state">Ładowanie danych...</div>}
            {error && <div className="bp-state error">{error}</div>}
            {!loading && !error && requests.length === 0 && (
              <div className="bp-state">Brak zgłoszeń do wyświetlenia.</div>
            )}

            {!loading && !error && requests.length > 0 && (
              <div className="table-wrap">
                <table className="bp-table">
                  <thead>
                    <tr>
                      <th>ID zgłoszenia</th>
                      <th>Grupa krwi</th>
                      <th>Ilość (ml)</th>
                      <th>Status</th>
                      <th>Data utworzenia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((r) => (
                      <tr key={r.id}>
                        <td data-label="ID">{r.id}</td>
                        <td data-label="Grupa krwi">
                          <strong>{r.bloodTypeLabel}</strong>
                        </td>
                        <td data-label="Ilość">{r.amount}</td>
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
                            ? new Date(r.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <div className="form-actions" style={{ marginTop: "20px", justifyContent: "center" }}>
            <button className="bp-btn" onClick={loadRequests}>
              Odśwież listę
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
