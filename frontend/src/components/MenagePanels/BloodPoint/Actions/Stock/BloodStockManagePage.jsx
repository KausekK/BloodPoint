import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../../../Header/Header";
import Footer from "../../../../Footer/Footer";
import { getBloodStockByDonationPoint } from "../../../../../services/BloodStockService";
import "./BloodStockManagePage.css";

export default function BloodStockManagePage() {
  const { pointId } = useParams();
  const effectiveId =
    Number(pointId) ||
    Number(localStorage.getItem("pointId")) ||
    1;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [delivery, setDelivery] = useState({
    bloodGroup: "",
    liters: "",
  });

  async function load() {
    try {
      setLoading(true);
      setErr("");
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

  useEffect(() => { load(); }, [effectiveId]);

  const totals = useMemo(() => rows.reduce((acc, r) => ({
    available: acc.available + (+r.totalAvailable || 0),
    reserved: acc.reserved + (+r.totalReserved || 0),
    free: acc.free + (+r.totalFree || 0),
  }), { available: 0, reserved: 0, free: 0 }), [rows]);

  function onDeliveryChange(e) {
    const { name, value } = e.target;
    setDelivery(v => ({ ...v, [name]: value }));
  }


  function submitDelivery(e) {
    e.preventDefault();
    // TODO POST do backendu
  }

  return (
    <>
      <Header />
      <main className="bp-section point-stocks">
        <div className="bp-container">
          <header className="stocks-head">
            <h1 className="stocks-title">Zarządzaj zapasami krwi</h1>
            <p className="stocks-lead">Punkt {effectiveId}</p>
            <div className="stocks-actions">
              <button className="bp-btn" onClick={load}>Odśwież</button>
            </div>
          </header>

          <section className="bp-card stocks-card">
            {loading && <div className="stocks-state">Ładowanie…</div>}
            {err && !loading && <div className="stocks-state stocks-error">{err}</div>}
            {!loading && !err && rows.length === 0 && (
              <div className="stocks-state">Brak danych do wyświetlenia.</div>
            )}

            {!loading && !err && rows.length > 0 && (
              <div className="table-wrap">
                <table className="bp-table stocks-table">
                  <thead>
                    <tr>
                      <th>Grupa krwi</th>
                      <th>Dostępne (l)</th>
                      <th>Zarezerwowane (l)</th>
                      <th>Wolne (l)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(r => (
                      <tr key={r.bloodGroup}>
                        <td className="col-group">{r.bloodGroup}</td>
                        <td>{r.totalAvailable} l</td>
                        <td>{r.totalReserved} l</td>
                        <td className="col-free">{r.totalFree} l</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>Razem</th>
                      <th>{totals.available} l</th>
                      <th>{totals.reserved} l</th>
                      <th className="col-free">{totals.free} l</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </section>

          <section className="bp-card stocks-ops">
            <h2 className="ops-title">Zarejestruj dostawę krwi</h2>
            <form className="ops-form" onSubmit={submitDelivery} noValidate>
              <div className="form-field">
                <div className="select-wrap">
                  <select
                    className="select"
                    name="bloodGroup"
                    value={delivery.bloodGroup}
                    onChange={onDeliveryChange}
                    required
                  >
                    <option value="">Wybierz grupę krwi</option>
                    <option>0 Rh+</option><option>0 Rh-</option>
                    <option>A Rh+</option><option>A Rh-</option>
                    <option>B Rh+</option><option>B Rh-</option>
                    <option>AB Rh+</option><option>AB Rh-</option>
                  </select>
                </div>
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
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="bp-btn"
                >
                  Zarejestruj dostawę
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
