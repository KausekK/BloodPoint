import { useEffect, useMemo, useState } from "react";
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


            const list = Array.isArray(data)
                ? data
                : Array.isArray(data?.resultDTO)
                    ? data.resultDTO
                    : [];

            if (!Array.isArray(data) && !Array.isArray(list)) {
                setError("Niepoprawny format odpowiedzi z API (oczekiwano listy).");
                console.warn("[staff] Unexpected payload:", data);
            }

            setRows(list);

        } catch (e) {
            const msg =
                e?.response?.data?.message ||
                e?.message ||
                "Błąd pobierania personelu";
            setError(msg);
            setRows([]);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const filtered = useMemo(() => {
        const list = Array.isArray(rows) ? rows : [];
        const s = q.trim().toLowerCase();
        if (!s) return list;
        return list.filter((r) =>
            (`${r.firstName ?? ""} ${r.lastName ?? ""} ${r.email ?? ""}`)
                .toLowerCase()
                .includes(s)
        );
    }, [q, rows]);


    const startEdit = (r) => {
        setEditId(r.userId);
        setForm({
            employmentStartDay: r.employmentStartDay || "",
            position: r.position || "",
            bloodDonationPointId: r.donationPointId ?? POINT_ID,
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
            const updated = res?.resultDTO;

            setRows((prev) =>
                prev.map((r) =>
                    r.userId === editId ? (updated ? updated : { ...r, ...form }) : r
                )
            );
            cancelEdit();

        } catch (e) {
            alert(
                e?.response?.data?.message || e?.message || "Nie udało się zapisać zmian"
            );
        }
    };

    const onRemove = async (userId) => {
        if (!window.confirm("Na pewno usunąć tego pracownika?")) return;
        try {
            await deleteEmployee(userId);
            setRows((prev) => prev.filter((r) => r.userId !== userId));

        } catch (e) {
            alert(
                e?.response?.data?.message ||
                e?.message ||
                "Nie udało się usunąć pracownika"
            );
            console.error("[staff] delete error:", e);
        }
    };

    return (
        <>
            <Header />
            <main className="bp-section staff">
                <div className="bp-container">
                    <header className="staff__head">
                        <h1 className="staff__title">Personel punktu krwiodawstwa</h1>
                        <p className="staff__lead">
                            Punkt ID: <strong>{POINT_ID}</strong>
                        </p>

                        <div className="staff__toolbar">
                            <div className="staff__search">
                                <input
                                    type="search"
                                    className="staff__input"
                                    placeholder="Szukaj po imieniu, nazwisku, e-mailu…"
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                />
                            </div>
                            <div className="staff__actions">
                                <button type="button" className="bp-btn" onClick={load}>
                                    Odśwież
                                </button>
                            </div>
                        </div>
                    </header>

                    <section
                        className="bp-card staff__table-wrap"
                        aria-label="Lista personelu"
                    >
                        {loading ? (
                            <div className="staff__empty">Ładowanie…</div>
                        ) : error ? (
                            <div className="staff__error">Błąd: {error}</div>
                        ) : Array.isArray(filtered) && filtered.length > 0 ? (
                            <table className="staff__table">
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
                                {filtered.map((r) => {
                                    const isEdit = editId === r.userId;
                                    return (
                                        <tr key={r.userId}>
                                            <td data-label="Imię i nazwisko">
                                                <div className="staff__name">
                            <span className="staff__name-main">
                              {r.firstName} {r.lastName}
                            </span>
                                                    <span className="staff__id">ID: {r.userId}</span>
                                                </div>
                                            </td>

                                            <td data-label="Stanowisko">
                                                {isEdit ? (
                                                    <select
                                                        className="staff__select"
                                                        value={form.position}
                                                        onChange={(e) =>
                                                            setForm((f) => ({
                                                                ...f,
                                                                position: e.target.value,
                                                            }))
                                                        }
                                                    >
                                                        <option value="">— wybierz —</option>
                                                        {POSITIONS.map((p) => (
                                                            <option key={p} value={p}>
                                                                {p}
                                                            </option>
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
                                                        className="staff__input"
                                                        value={form.employmentStartDay || ""}
                                                        max={new Date().toISOString().slice(0, 10)}
                                                        onChange={(e) =>
                                                            setForm((f) => ({
                                                                ...f,
                                                                employmentStartDay: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                ) : r.employmentStartDay ? (
                                                    new Date(r.employmentStartDay).toLocaleDateString(
                                                        "pl-PL"
                                                    )
                                                ) : (
                                                    "—"
                                                )}
                                            </td>

                                            <td data-label="E-mail">{r.email}</td>
                                            <td data-label="PESEL">{r.pesel}</td>

                                            <td className="staff__actions-cell">
                                                {isEdit ? (
                                                    <div className="staff__row-actions">
                                                        <button className="bp-btn" onClick={saveEdit}>
                                                            Zapisz
                                                        </button>
                                                        <button
                                                            className="bp-btn bp-btn--ghost"
                                                            onClick={cancelEdit}
                                                        >
                                                            Anuluj
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="staff__row-actions">
                                                        <button
                                                            className="bp-btn"
                                                            onClick={() => startEdit(r)}
                                                        >
                                                            Edytuj
                                                        </button>
                                                        <button
                                                            className="bp-btn bp-btn--ghost"
                                                            onClick={() => onRemove(r.userId)}
                                                        >
                                                            Usuń
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="staff__empty">Brak wyników.</div>
                        )}
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
