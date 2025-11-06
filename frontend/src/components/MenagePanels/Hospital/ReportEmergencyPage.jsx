import { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

import { createBloodRequest } from "../../../services/BloodRequestService";
import { listBloodTypes } from "../../../services/BloodTypeService";

import { showMessage, showError } from "../../shared/services/MessageService";
import { MessageType } from "../../shared/const/MessageType.model";

import "./ReportEmergencyPage.css";

function toNumInt(v) {
  if (v === null || v === undefined) return 0;
  const n = typeof v === "number" ? v : Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? Math.trunc(n) : 0;
}

export default function ReportEmergencyPage() {
  const [bloodTypes, setBloodTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

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
    if (!f.bloodTypeId) return "Wybierz grupę krwi.";
    const amountInt = toNumInt(f.amount);
    if (!Number.isFinite(amountInt) || amountInt <= 0)
      return "Podaj dodatnią liczbę jednostek.";
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

      await createBloodRequest({
        bloodTypeId: Number(form.bloodTypeId),
        amount: toNumInt(form.amount),
      });

      const ok = "Zapotrzebowanie zostało zgłoszone.";
      setMsg(ok);
      showMessage(ok, MessageType.SUCCESS);

      setForm((f) => ({ ...f, amount: "" }));
    } catch (e2) {
        console.error('createBloodRequest error:', {
          url: e2?.config?.url,
          method: e2?.config?.method,
          status: e2?.response?.status,
          data: e2?.response?.data,
        });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="bp-section request-panel">
        <div className="bp-container">
          <header className="stocks-head">
            <h1 className="stocks-title">Zgłoszenie zapotrzebowania</h1>
            <p className="stocks-lead">
              Wybierz grupę krwi i liczbę jednostek.
            </p>
          </header>

          <section className="bp-card stocks-ops">
            {loading && <div className="stocks-state">Ładowanie…</div>}
            {err && !loading && <div className="stocks-state stocks-error">{err}</div>}
            {msg && !loading && <div className="stocks-state stocks-ok">{msg}</div>}

            {!loading && (
              <form className="ops-form" onSubmit={onSubmit} noValidate>
                <div className="form-field">
                  <div className="select-wrap">
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
                </div>

                <div className="form-field">
                  <input
                    className="input"
                    id="amount"
                    name="amount"
                    type="number"
                    min="1"
                    step="1"
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
