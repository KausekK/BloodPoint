import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../Footer/Footer";
import "./PointStaffPage.css";
import { getStaffByPoint, deleteEmployee, updateEmployee } from "../../services/StaffService";

const POINT_ID = 1;
const POSITIONS = ["Lekarz", "Pielegniarka", "Menadzer", "Recepcjonistka"];

export default function PointStaffPage() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [q, setQ] = useState("");
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
        employmentStartDay: "",
        position: "",
        bloodDonationPointId: POINT_ID,
    });

    const load = async () => {
        setLoading(true);
        try {
            setError("");
            const data = await getStaffByPoint(POINT_ID);

            let list = [];
            if (Array.isArray(data)) list = data;
            else if (data && Array.isArray(data.resultDTO)) list = data.resultDTO;

            if (!Array.isArray(list)) {
                setError("Niepoprawny format odpowiedzi z API (oczekiwano listy).");
                setRows([]);
            } else {
                setRows(list);
            }
        } catch (e) {
            let msg = "Błąd pobierania personelu";
            if (e && e.response && e.response.data && e.response.data.message) msg = e.response.data.message;
            else if (e && e.message) msg = e.message;
            setError(msg);
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const s = q.trim().toLowerCase();
    const filteredRows = s
        ? rows.filter((r) => {
            const first = (r.firstName || "").toLowerCase();
            const last = (r.lastName || "").toLowerCase();
            const email = (r.email || "").toLowerCase();
            return (first + " " + last + " " + email).includes(s);
        })
        : rows;

    const startEdit = (r) => {
        setEditId(r.userId);
        setForm({
            employmentStartDay: r.employmentStartDay || "",
            position: r.position || "",
            bloodDonationPointId: r.donationPointId || POINT_ID,
        });
    };

    const cancelEdit = () => {
        setEditId(null);
        setForm({
            employmentStartDay: "",
            position: "",
            bloodDonationPointId: POINT_ID,
        });
    };

    const saveEdit = async () => {
        try {
            const res = await updateEmployee(editId, form);
            const updated = res && res.resultDTO ? res.resultDTO : null;
            setRows((prev) =>
                prev.map((r) => (r.userId === editId ? (updated ? updated : { ...r, ...form }) : r))
            );
            cancelEdit();
        } catch (e) {
            let msg = "Nie udało się zapisać zmian";
            if (e && e.response && e.response.data && e.response.data.message) msg = e.response.data.message;
            else if (e && e.message) msg = e.message;
            alert(msg);
        }
    };

    const onRemove = async (userId) => {
        if (!window.confirm("Na pewno usunąć tego pracownika?")) return;
        try {
            await deleteEmployee(userId);
            setRows((prev) => prev.filter((r) => r.userId !== userId));
        } catch (e) {
            let msg = "Nie udało się usunąć pracownika";
            if (e && e.response && e.response.data && e.response.data.message) msg = e.response.data.message;
            else if (e && e.message) msg = e.message;
            alert(msg);
        }
    };

    return (
        <>
            <Header />
            <main className="bp-section staff">
                <div className="bp-container">
                    <header className="staff-head">
                        <h1 className="staff-title">Personel punktu krwiodawstwa</h1>
                        <p className="staff-lead">
                            Punkt ID: <strong>{POINT_ID}</strong>
                        </p>

                        <div className="staff-toolbar">
                            <div className="staff-search">
                                <input
                                    type="search"
                                    className="staff-input"
                                    placeholder="Szukaj po imieniu, nazwisku, e-mailu…"
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                />
                            </div>
                            <div className="staff-actions">
                                <button type="button" className="bp-btn" onClick={load}>
                                    Odśwież
                                </button>
                            </div>
                        </div>
                    </header>

                    <section className="bp-card staff-table-wrap" aria-label="Lista personelu">
                        {loading ? (
                            <div className="staff-empty">Ładowanie…</div>
                        ) : error ? (
                            <div className="staff-error">Błąd: {error}</div>
                        ) : filteredRows.length > 0 ? (
                            <table className="staff-table">
                                <thead>
                                <tr>
                                    <th>Imię i nazwisko</th>
                                    <th>Stanowisko</th>
                                    <th>Data zatrudnienia</th>
                                    <th>E-mail</th>
                                    <th>PESEL</th>
                                    <th style={{ width: 180 }}>Akcje</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredRows.map((r) => {
                                    const isEdit = editId === r.userId;
                                    return (
                                        <tr key={r.userId}>
                                            <td data-label="Imię i nazwisko">
                                                <div className="staff-name">
                                                    <span className="staff-name-main">{r.firstName} {r.lastName}</span>
                                                    <span className="staff-id">ID: {r.userId}</span>
                                                </div>
                                            </td>

                                            <td data-label="Stanowisko">
                                                {isEdit ? (
                                                    <select
                                                        className="staff-select"
                                                        value={form.position}
                                                        onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                                                    >
                                                        <option value="">— wybierz —</option>
                                                        {POSITIONS.map((p) => (
                                                            <option key={p} value={p}>{p}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    r.position || "—"
                                                )}
                                            </td>

                                            <td data-label="Data zatrudnienia">
                                                {isEdit ? (
                                                    <input
                                                        type="date"
                                                        className="staff-input"
                                                        value={form.employmentStartDay || ""}
                                                        max={new Date().toISOString().slice(0, 10)}
                                                        onChange={(e) => setForm((f) => ({ ...f, employmentStartDay: e.target.value }))}
                                                    />
                                                ) : r.employmentStartDay ? (
                                                    new Date(r.employmentStartDay).toLocaleDateString("pl-PL")
                                                ) : (
                                                    "—"
                                                )}
                                            </td>

                                            <td data-label="E-mail">{r.email}</td>
                                            <td data-label="PESEL">{r.pesel}</td>

                                            <td className="staff-actions-cell">
                                                {isEdit ? (
                                                    <div className="staff-row-actions">
                                                        <button className="bp-btn" onClick={saveEdit}>Zapisz</button>
                                                        <button className="bp-btn bp-btn--ghost" onClick={cancelEdit}>Anuluj</button>
                                                    </div>
                                                ) : (
                                                    <div className="staff-row-actions">
                                                        <button className="bp-btn" onClick={() => startEdit(r)}>Edytuj</button>
                                                        <button className="bp-btn bp-btn--ghost" onClick={() => onRemove(r.userId)}>Usuń</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="staff-empty">Brak wyników.</div>
                        )}
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
