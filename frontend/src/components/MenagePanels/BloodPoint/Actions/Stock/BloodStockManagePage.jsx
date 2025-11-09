import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../../../Header/Header";
import Footer from "../../../../Footer/Footer";
import {
  getBloodStockByDonationPoint,
  postDelivery,
} from "../../../../../services/BloodStockService";
import { listBloodTypes } from "../../../../../services/BloodTypeService";
import { showMessage, showError } from "../../../../shared/services/MessageService";
import { MessageType } from "../../../../shared/const/MessageType.model";
import "../../../../SharedCSS/MenagePanels.css";
import { toNum, addWithScale, formatAmount } from "../../../../shared/utils/number";
import BackButton from "../../../../BackButton/BackButton";

export default function BloodStockManagePage() {
  const { pointId } = useParams();
  const effectiveId =
    Number(pointId) || Number(localStorage.getItem("pointId")) || 1;

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
      const data = await getBloodStockByDonationPoint(effectiveId);
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setErr("Nie udało się pobrać danych magazynowych.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    listBloodTypes()
      .then((opts) => setBloodTypes(Array.isArray(opts) ? opts : []))
      .catch(() => showError("Nie udało się pobrać listy grup krwi."));
  }, [effectiveId]);

  const totals = useMemo(
    () => rows.reduce(
      (acc, r) => ({
        available: addWithScale(acc.available, r.totalAvailable, 2),
        reserved:  addWithScale(acc.reserved,  r.totalReserved,  2),
        free:      addWithScale(acc.free,      r.totalFree,      2),
      }),
      { available: 0, reserved: 0, free: 0 }
    ),
    [rows]
  );
  

  function onDeliveryChange(e) {
    const { name, value } = e.target;
    setDelivery((v) => ({ ...v, [name]: value }));
    setErr("");
    setMsg("");
  }

  function validateDelivery(d) {
    if (!d.bloodTypeId) return "Wybierz grupę krwi.";
    const liters = toNum(d.liters);
    if (!Number.isFinite(liters) || liters <= 0) return "Podaj dodatnią ilość (l).";
    return "";
  }

  async function submitDelivery(e) {
    e.preventDefault();
    const v = validateDelivery(delivery);
    if (v) {
      setErr(v);
      showError(v);
      return;
    }
    try {
      setSubmitting(true);
      setErr("");
      setMsg("");

      await postDelivery(effectiveId, {
        bloodTypeId: Number(delivery.bloodTypeId),
        liters: toNum(delivery.liters),
      });

      const success = "Dostawa została zarejestrowana.";
      setMsg(success);
      showMessage(success, MessageType.SUCCESS);
      setDelivery({ bloodTypeId: "", liters: "" });
      await load();
    } catch (e2) {
      const emsg =
        e2?.response?.data?.message || "Nie udało się zarejestrować dostawy.";
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
      <BackButton to="/punkt-krwiodawstwa/dashboard" label="Powrót do panelu punktu krwiodawstwa" />
        <div className="bp-container">
          <header className="dashboard-head">
            <h1 className="dashboard-title">Zarządzaj zapasami krwi</h1>
            <p className="dashboard-lead">Punkt {effectiveId}</p>
            <div className="dashboard-actions">
              <button className="bp-btn" onClick={load} disabled={loading || submitting}>
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
                    {rows.map((r) => (
                      <tr key={r.bloodTypeId ?? r.bloodGroup}>
                        <td className="col-group">
                          {r.bloodGroupLabel ?? r.bloodGroup}
                        </td>
                        <td>{formatAmount(r.totalAvailable, 2)} l</td>
                        <td>{formatAmount(r.totalReserved, 2)} l</td>
                        <td className="col-free">{formatAmount(r.totalFree, 2)} l</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                  <tr>
                    <th>Razem</th>
                    <th>{formatAmount(totals.available, 2)} l</th>
                    <th>{formatAmount(totals.reserved, 2)} l</th>
                    <th className="col-free">{formatAmount(totals.free, 2)} l</th>
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
                  {bloodTypes.map((bt) => (
                    <option key={bt.id} value={bt.id}>
                      {bt.label}
                    </option>
                  ))}
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
                <button type="submit" className="bp-btn" disabled={submitting}>
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
