import { useEffect, useState } from "react";
import Header from "../../../Header/Header";
import Footer from "../../../Footer/Footer";
import { toNum } from "../../../shared/utils/number";
import { createBloodRequest } from "../../../../services/BloodRequestService";
import { listBloodTypes } from "../../../../services/BloodTypeService";
import { showMessage, showError } from "../../../shared/services/MessageService";
import { MessageType } from "../../../shared/const/MessageType.model";
import "../../../SharedCSS/MenagePanels.css"

import BackButton from "../../../BackButton/BackButton"
import authService from "../../../../services/AuthenticationService";


export default function ReportEmergencyPage() {
  const [bloodTypes, setBloodTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const hospitalId = authService.getHospitalId();

  const [form, setForm] = useState({
    bloodTypeId: "",
    amount: "",
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        setMsg("");
        const bts = await listBloodTypes();
        setBloodTypes(Array.isArray(bts) ? bts : []);
      } catch (e) {
        console.error(e);
        setErr("Nie udało się pobrać listy grup krwi.");
        setBloodTypes([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErr("");
    setMsg("");
  }

  function validate(f) {
    const amount = toNum(f.amount);
    if (!f.bloodTypeId) return "Wybierz grupę krwi.";
    if (!Number.isFinite(amount) || amount <= 0) return "Podaj dodatnią ilość.";
    return "";
  }

  async function onSubmit(e) {
    e.preventDefault();
    const v = validate(form);
    if (v) {
      setErr(v);
      showError(v);
      return;
    }

    try {
      setSubmitting(true);
      setErr("");
      setMsg("");

      await createBloodRequest(hospitalId, {
        bloodTypeId: Number(form.bloodTypeId),
        amount: toNum(form.amount),
      });

      const ok = "Zapotrzebowanie zostało zgłoszone.";
      setMsg(ok);
      showMessage(ok, MessageType.SUCCESS);

      setForm((f) => ({ ...f, amount: "" }));
    } catch (e2) {
      console.error("createBloodRequest error:", {
        url: e2?.config?.url,
        method: e2?.config?.method,
        status: e2?.response?.status,
        data: e2?.response?.data,
      });
      showError("Nie udało się zgłosić zapotrzebowania.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="bp-section">
      <BackButton to="/szpital/dashboard" label="Powrót do panelu szpitala" />
        <div className="bp-container">
          <header className="dashboard-head">
            <h1 className="dashboard-title">Zgłoszenie zapotrzebowania</h1>
            <p className="dashboard-lead">
              Wybierz grupę krwi i liczbę jednostek.
            </p>
          </header>

          <section className="bp-card">
            {loading && <div className="bp-state">Ładowanie…</div>}
            {err && !loading && <div className="bp-state error">{err}</div>}
            {msg && !loading && <div className="bp-state success">{msg}</div>}

            {!loading && (
              <form className="bp-form" onSubmit={onSubmit} noValidate>
                <div className="form-field">
                  <select
                    className="select"
                    id="bloodTypeId"
                    name="bloodTypeId"
                    value={form.bloodTypeId}
                    onChange={onChange}
                    required
                    disabled={submitting}
                  >
                    <option value="">— wybierz grupę krwi —</option>
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
                    id="amount"
                    name="amount"
                    type="number"
                    min="1"
                    step="0.1" 
                    placeholder="Ilość"
                    value={form.amount}
                    onChange={onChange}
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="bp-btn" disabled={submitting}>
                    {submitting ? "Wysyłanie…" : "Zgłoś zapotrzebowanie"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
