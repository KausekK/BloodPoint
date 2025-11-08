import { useEffect, useState } from "react";
import Header from "../../../../Header/Header";
import Footer from "../../../../Footer/Footer";
import { getAllNewBloodRequests, acceptBloodRequest } from "../../../../../services/BloodRequestService";

import { showMessage, showError } from "../../../../shared/services/MessageService";
import { MessageType } from "../../../../shared/const/MessageType.model";

import { formatAmount } from "../../../../shared/utils/number";
import BackButton from "../../../../BackButton/BackButton";


export default function EmergencyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pointId = 1; // TODO do backendu param zalogowanego punktu

  const loadRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllNewBloodRequests();
      if (Array.isArray(data)) setRequests(data);
      else setError("Niepoprawna odpowiedź z serwera.");
    } catch (e) {
      console.error(e);
      setError(e?.message || "Błąd podczas pobierania danych.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  async function onAccept(id) {
    try {
      await acceptBloodRequest(id, pointId);
      showMessage("Zgłoszenie zaakceptowane. Stan magazynu został pomniejszony.", MessageType.SUCCESS);
      await loadRequests();
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "Nie udało się zaakceptować zgłoszenia.";
      showError(msg);
    }
  }

  return (
    <>
      <Header />
      <main className="bp-section">
        <BackButton to="/punkt-krwiodawstwa/dashboard" label="Powrót do panelu punktu krwiodawstwa" />
        <div className="bp-container">
          <header className="dashboard-head">
            <h1 className="dashboard-title">Zgłoszenia zapotrzebowania na krew</h1>
            <p className="dashboard-lead">
              Lista nowych próśb od placówek szpitalnych.
            </p>
          </header>

          <div className="bp-card">
            {loading && <div className="bp-state">Ładowanie danych...</div>}
            {error && <div className="bp-state error">{error}</div>}
            {!loading && !error && requests.length === 0 && (
              <div className="bp-state">Brak nowych zgłoszeń.</div>
            )}

            {!loading && !error && requests.length > 0 && (
              <div className="table-wrap">
                <table className="bp-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Szpital</th>
                    <th>Grupa krwi</th>
                    <th>Ilość</th>
                    <th>Akcje</th>
                </tr>
                </thead>
                <tbody>
                {requests.map(r => (
                    <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.hospitalNumber} — {r.hospitalCity}</td>
                    <td><strong>{r.bloodTypeLabel}</strong></td>
                    <td>{formatAmount(r.amount, 3)} l</td> 
                    <td>
                        <button className="bp-btn bp-btn--ghost" onClick={() => {onAccept(r.id)}}>
                        Akceptuj
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="form-actions">
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
