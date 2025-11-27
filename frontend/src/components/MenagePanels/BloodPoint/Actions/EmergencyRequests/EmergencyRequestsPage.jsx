import { useEffect, useState } from "react";
import Header from "../../../../Header/Header";
import Footer from "../../../../Footer/Footer";
import {
  getAllNewBloodRequests,
  acceptBloodRequest,
} from "../../../../../services/BloodRequestService";
import {
  showMessage,
  showError,
} from "../../../../shared/services/MessageService";
import { MessageType } from "../../../../shared/const/MessageType.model";
import { formatAmount } from "../../../../shared/utils/number";
import BackButton from "../../../../BackButton/BackButton";
import authService from "../../../../../services/AuthenticationService";

export default function EmergencyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pointId = authService.getPointId();

  async function loadRequests() {
    setLoading(true);
    setError("");
    try {
      const data = await getAllNewBloodRequests();
      if (Array.isArray(data)) {
        setRequests(data);
      } else {
        setError("Niepoprawna odpowiedź z serwera.");
      }
    } catch (e) {
      console.error(e);
      let msg = "Błąd podczas pobierania danych.";
      if (e && e.message) {
        msg = e.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(function () {
    loadRequests();
  }, []);

  async function onAccept(id) {
    try {
      const res = await acceptBloodRequest(id, pointId);
      let messages = null;

      if (res && res.data && Array.isArray(res.data.messages)) {
        messages = res.data.messages;
      }

      if (messages && messages.length > 0) {
        messages.forEach(function (m) {
          showMessage(m.msg, m.type);
        });
        await loadRequests();
      } else {
        showError("Nieoczekiwana odpowiedź serwera");
      }
    } catch (e) {
      let msg = "Nie udało się zaakceptować zgłoszenia.";
      if (e && e.response && e.response.data && e.response.data.message) {
        msg = e.response.data.message;
      } else if (e && e.message) {
        msg = e.message;
      }
      showError(msg);
    }
  }

  return (
    <>
      <Header />
      <main className="bp-section">
        <BackButton
          to="/punkt-krwiodawstwa/dashboard"
          label="Powrót do panelu punktu krwiodawstwa"
        />
        <div className="bp-container">
          <header className="dashboard-head">
            <h1 className="dashboard-title">
              Zgłoszenia zapotrzebowania na krew
            </h1>
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
                    {requests.map(function (r) {
                      return (
                        <tr key={r.id}>
                          <td>{r.id}</td>
                          <td>
                            {r.hospitalNumber} — {r.hospitalCity}
                          </td>
                          <td>
                            <strong>{r.bloodTypeLabel}</strong>
                          </td>
                          <td>{formatAmount(r.amount, 3)} l</td>
                          <td>
                            <button
                              className="bp-btn bp-btn--ghost"
                              onClick={function () {
                                onAccept(r.id);
                              }}
                            >
                              Akceptuj
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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
