import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../Footer/Footer";
import "./PointStaffPage.css";
import {
  getStaffByPoint,
  deleteEmployee,
  updateEmployee,
} from "../../services/StaffService";
import content from "../../content/PointStaff/PointStaff.json";

const POINT_ID = 1;

export default function PointStaffPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    position: "",
    firstName: "",
    lastName: "",
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
        setError(content.messages.invalidResponse);
        setRows([]);
      } else {
        setRows(list);
      }
    } catch (e) {
      let msg = content.messages.errorFetch;
      if (e?.response?.data?.message) msg = e.response.data.message;
      else if (e?.message) msg = e.message;
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
      position: r.position || "",
      firstName: r.firstName || "",
      lastName: r.lastName || "",
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({
      position: "",
      firstName: "",
      lastName: "",
    });
  };

  const saveEdit = async () => {
    try {
      const payload = {
        position: form.position || null,
        firstName: form.firstName?.trim() || null,
        lastName: form.lastName?.trim() || null,
      };

      const res = await updateEmployee(editId, payload);
      const updated = res?.resultDTO || null;

      setRows((prev) =>
        prev.map((r) =>
          r.userId === editId ? (updated ? updated : { ...r, ...payload }) : r
        )
      );
      cancelEdit();
    } catch (e) {
      let msg = content.messages.errorSave;
      if (e?.response?.data?.message) msg = e.response.data.message;
      else if (e?.message) msg = e.message;
      alert(msg);
    }
  };

  const onRemove = async (userId) => {
    if (!window.confirm(content.messages.confirmDelete)) return;
    try {
      await deleteEmployee(userId);
      setRows((prev) => prev.filter((r) => r.userId !== userId));
    } catch (e) {
      let msg = content.messages.errorDelete;
      if (e?.response?.data?.message) msg = e.response.data.message;
      else if (e?.message) msg = e.message;
      alert(msg);
    }
  };

  return (
    <>
      <Header />
      <main className="bp-section staff">
        <div className="bp-container">
          <header className="staff-head">
            <h1 className="staff-title">{content.hero.heading}</h1>
            <p className="staff-lead">
              {content.hero.note.replace("{{POINT_ID}}", POINT_ID)}
            </p>

            <div className="staff-toolbar">
              <div className="staff-search">
                <input
                  type="search"
                  className="staff-input"
                  placeholder={content.search.placeholder}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <div className="staff-actions">
                <button type="button" className="bp-btn" onClick={load}>
                  {content.search.button}
                </button>
              </div>
            </div>
          </header>

          <section
            className="bp-card staff-table-wrap"
            aria-label={content.table.title}
          >
            {loading ? (
              <div className="staff-empty">{content.messages.loading}</div>
            ) : error ? (
              <div className="staff-error">
                {content.messages.errorPrefix} {error}
              </div>
            ) : filteredRows.length > 0 ? (
              <table className="staff-table">
                <thead>
                  <tr>
                    <th>{content.table.columns.name}</th>
                    <th>{content.table.columns.position}</th>
                    <th>{content.table.columns.date}</th>
                    <th>{content.table.columns.email}</th>
                    <th>{content.table.columns.pesel}</th>
                    <th style={{ width: 180 }}>
                      {content.table.columns.actions}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((r) => {
                    const isEdit = editId === r.userId;
                    return (
                      <tr key={r.userId}>
                        <td data-label={content.table.columns.name}>
                          <div className="staff-name">
                            {isEdit ? (
                              <div className="staff-edit-name">
                                <input
                                  className="staff-input"
                                  placeholder="Imię"
                                  value={form.firstName}
                                  onChange={(e) =>
                                    setForm((f) => ({
                                      ...f,
                                      firstName: e.target.value,
                                    }))
                                  }
                                />
                                <input
                                  className="staff-input"
                                  placeholder="Nazwisko"
                                  value={form.lastName}
                                  onChange={(e) =>
                                    setForm((f) => ({
                                      ...f,
                                      lastName: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                            ) : (
                              <span className="staff-name-main">
                                {r.firstName} {r.lastName}
                              </span>
                            )}
                            <span className="staff-id">ID: {r.userId}</span>
                          </div>
                        </td>

                        <td data-label={content.table.columns.position}>
                          {isEdit ? (
                            <select
                              className="staff-select"
                              value={form.position}
                              onChange={(e) =>
                                setForm((f) => ({
                                  ...f,
                                  position: e.target.value,
                                }))
                              }
                            >
                              <option value="">— wybierz —</option>
                              {content.table.positions.map((p) => (
                                <option key={p} value={p}>
                                  {p}
                                </option>
                              ))}
                            </select>
                          ) : (
                            r.position || "—"
                          )}
                        </td>

                        {/* Data zatrudnienia — TYLKO ODCZYT */}
                        <td data-label={content.table.columns.date}>
                          {r.employmentStartDay
                            ? new Date(
                                r.employmentStartDay
                              ).toLocaleDateString("pl-PL")
                            : "—"}
                        </td>

                        <td data-label={content.table.columns.email}>
                          {r.email}
                        </td>

                        <td data-label={content.table.columns.pesel}>
                          {r.pesel}
                        </td>

                        <td className="staff-actions-cell">
                          {isEdit ? (
                            <div className="staff-row-actions">
                              <button className="bp-btn" onClick={saveEdit}>
                                {content.actions.save}
                              </button>
                              <button
                                className="bp-btn bp-btn--ghost"
                                onClick={cancelEdit}
                              >
                                {content.actions.cancel}
                              </button>
                            </div>
                          ) : (
                            <div className="staff-row-actions">
                              <button
                                className="bp-btn"
                                onClick={() => startEdit(r)}
                              >
                                {content.actions.edit}
                              </button>
                              <button
                                className="bp-btn bp-btn--ghost"
                                onClick={() => onRemove(r.userId)}
                              >
                                {content.actions.delete}
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
              <div className="staff-empty">{content.table.noData}</div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
