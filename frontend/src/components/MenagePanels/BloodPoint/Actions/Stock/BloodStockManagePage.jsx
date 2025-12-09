import { useEffect, useState } from "react";
import Header from "../../../../Header/Header";
import Footer from "../../../../Footer/Footer";
import { getBloodStockByDonationPoint, postDelivery } from "../../../../../services/BloodStockService";
import { listBloodTypes } from "../../../../../services/BloodTypeService";
import { showMessage, showError } from "../../../../shared/services/MessageService";
import { MessageType } from "../../../../shared/const/MessageType.model";
import "../../../../SharedCSS/MenagePanels.css";
import { toNum, addWithScale, formatAmount } from "../../../../shared/utils/number";
import BackButton from "../../../../BackButton/BackButton";
import authService from "../../../../../services/AuthenticationService";

export default function BloodStockManagePage() {
  const pointId = authService.getPointId();

  const [rows, setRows] = useState([]);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [delivery, setDelivery] = useState({
    bloodTypeId: "",
    liters: "",
  });

  async function load() {
    try {
      setLoading(true);
      setErr("");
      setMsg("");
      const data = await getBloodStockByDonationPoint(pointId);
      if (Array.isArray(data)) {
        setRows(data);
      } else {
        setRows([]);
      }
    } catch (e) {
      console.error(e);
      setErr("Nie udało się pobrać danych magazynowych.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(function () {
    load();
    listBloodTypes()
      .then(function (opts) {
        if (Array.isArray(opts)) {
          setBloodTypes(opts);
        } else {
          setBloodTypes([]);
        }
      })
      .catch(function () {
        showError("Nie udało się pobrać listy grup krwi.");
      });
  }, [pointId]);

  let totals = { available: 0, reserved: 0, free: 0 };

  rows.forEach(function (r) {
    totals = {
      available: addWithScale(totals.available, r.totalAvailable, 2),
      reserved: addWithScale(totals.reserved, r.totalReserved, 2),
      free: addWithScale(totals.free, r.totalFree, 2),
    };
  });

  function onDeliveryChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    setDelivery(function (prev) {
      return {
        ...prev,
        [name]: value,
      };
    });

    setErr("");
    setMsg("");
  }

  function validateDelivery(d) {
    if (!d.bloodTypeId) {
      return "Wybierz grupę krwi.";
    }
    const liters = toNum(d.liters);
    if (!Number.isFinite(liters) || liters <= 0) {
      return "Podaj dodatnią ilość (l).";
    }
    return "";
  }

  async function submitDelivery(event) {
    event.preventDefault();

    const validationMsg = validateDelivery(delivery);
    if (validationMsg) {
      setErr(validationMsg);
      showError(validationMsg);
      return;
    }

    try {
      setSubmitting(true);
      setErr("");
      setMsg("");

      await postDelivery(pointId, {
        bloodTypeId: Number(delivery.bloodTypeId),
        liters: toNum(delivery.liters),
      });

      const success = "Dostawa została zarejestrowana.";
      setMsg(success);
      showMessage(success, MessageType.SUCCESS);
      setDelivery({ bloodTypeId: "", liters: "" });
      await load();
    } catch (e) {
      let emsg = "Nie udało się zarejestrować dostawy.";
      if (e && e.response && e.response.data && e.response.data.message) {
        emsg = e.response.data.message;
      }
      setErr(emsg);
      showError(emsg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="bp-section">
        <div className="bp-container">
        <BackButton to="/punkt-krwiodawstwa/dashboard" label="Powrót do panelu punktu krwiodawstwa"/>
          <header className="dashboard-head">
            <h1 className="dashboard-title">Zarządzaj zapasami krwi</h1>
            <div className="dashboard-actions">
              <button
                className="bp-btn"
                onClick={load}
                disabled={loading || submitting}
              >
                {loading ? "Ładowanie…" : "Odśwież"}
              </button>
            </div>
          </header>

          <section className="bp-card">
            {loading && <div className="bp-state">Ładowanie…</div>}
            {err && !loading && <div className="bp-state error">{err}</div>}
            {msg && !loading && <div className="bp-state success">{msg}</div>}

            {!loading && !err && rows.length === 0 && (
              <div className="bp-state">Brak danych do wyświetlenia.</div>
            )}

            {!loading && !err && rows.length > 0 && (
              <div className="table-wrap">
                <table className="bp-table">
                  <thead>
                    <tr>
                      <th>Grupa krwi</th>
                      <th>Dostępne (l)</th>
                      <th>Zarezerwowane (l)</th>
                      <th>Wolne (l)</th>
                    </tr>
                  </thead>
                  <tbody>
                  {rows.map(function (r) {
                    const key =
                      r.bloodTypeId !== null && r.bloodTypeId !== undefined
                        ? r.bloodTypeId
                        : r.bloodGroup;

                    const label =
                      r.bloodGroupLabel !== null &&
                      r.bloodGroupLabel !== undefined
                        ? r.bloodGroupLabel
                        : r.bloodGroup;

                    return (
                      <tr key={key}>
                        <td
                          className="col-group"
                          data-label="Grupa krwi"
                        >
                          {label}
                        </td>
                        <td data-label="Dostępne (l)">
                          {formatAmount(r.totalAvailable, 2)} l
                        </td>
                        <td data-label="Zarezerwowane (l)">
                          {formatAmount(r.totalReserved, 2)} l
                        </td>
                        <td
                          className="col-free"
                          data-label="Wolne (l)"
                        >
                          {formatAmount(r.totalFree, 2)} l
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                  <tfoot>
                    <tr>
                      <th>Razem</th>
                      <th>{formatAmount(totals.available, 2)} l</th>
                      <th>{formatAmount(totals.reserved, 2)} l</th>
                      <th className="col-free">
                        {formatAmount(totals.free, 2)} l
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </section>

          <section className="bp-card">
            <h2 className="dashboard-title">Zarejestruj dostawę krwi</h2>
            <form className="bp-form" onSubmit={submitDelivery} noValidate>
              <div className="form-field">
                <select
                  className="select"
                  name="bloodTypeId"
                  value={delivery.bloodTypeId}
                  onChange={onDeliveryChange}
                  required
                  disabled={submitting}
                >
                  <option value="">Wybierz grupę krwi</option>
                  {bloodTypes.map(function (bt) {
                    return (
                      <option key={bt.id} value={bt.id}>
                        {bt.label}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="form-field">
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="0.1"
                  name="liters"
                  placeholder="Ilość (l)"
                  value={delivery.liters}
                  onChange={onDeliveryChange}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="bp-btn"
                  disabled={submitting}
                >
                  {submitting ? "Rejestrowanie…" : "Zarejestruj dostawę"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
