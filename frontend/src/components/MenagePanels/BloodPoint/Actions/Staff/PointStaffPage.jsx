import { useEffect, useState } from "react";
import Header from "../../../../Header/Header";
import Footer from "../../../../Footer/Footer";
import {
  getStaffByPoint,
  deleteEmployee,
  updateEmployee,
} from "../../../../../services/StaffService";
import content from "../../../../../content/PointStaff/PointStaff.json";
import "../../../../SharedCSS/MenagePanels.css";
import BackButton from "../../../../BackButton/BackButton";
import authService from "../../../../../services/AuthenticationService";
import { showMessage, showError } from "../../../../shared/services/MessageService";
import { MessageType } from "../../../../shared/const/MessageType.model";

export default function PointStaffPage() {
  const pointId = Number(authService.getPointId());

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    email: "",
    position: "",
  });

  async function load() {
    setLoading(true);
    try {
      setError("");

      if (!isFinite(pointId) || pointId <= 0) {
        setRows([]);
        setError("Brak przypisanego punktu krwiodawstwa w sesji użytkownika.");
        return;
      }

      const data = await getStaffByPoint(pointId);
      const list = Array.isArray(data)
        ? data
        : data && data.resultDTO
        ? data.resultDTO
        : [];

      if (!Array.isArray(list)) {
        setError(content.messages.invalidResponse);
        setRows([]);
      } else {
        setRows(list);
      }
    } catch (e) {
      let msg = content.messages.errorFetch;
      if (e && e.response && e.response.data && e.response.data.message) {
        msg = e.response.data.message;
      } else if (e && e.message) {
        msg = e.message;
      }
      setError(msg);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(function () {
    load();
  }, [pointId]);

  const search = q.trim().toLowerCase();
  const filteredRows = search
    ? rows.filter(function (r) {
        const first = (r.firstName || "").toLowerCase();
        const last = (r.lastName || "").toLowerCase();
        const email = (r.email || "").toLowerCase();
        return (first + " " + last + " " + email).includes(search);
      })
    : rows;

  function startEdit(row) {
    setEditId(row.userId);
    setForm({
      email: row.email || "",
      position: row.position || "",
    });
  }

  function cancelEdit() {
    setEditId(null);
    setForm({ email: "", position: "" });
  }

  async function saveEdit() {
    try {
      const payload = {
        email: (form.email || "").trim(),
        position: form.position || "",
      };

      const res = await updateEmployee(editId, payload);

      let updated = null;
      if (res && typeof res === "object" && "resultDTO" in res) {
        updated = res.resultDTO;
      }

      setRows(function (prev) {
        return prev.map(function (r) {
          if (r.userId !== editId) {
            return r;
          }

          if (updated) {
            return updated;
          }

          return {
            ...r,
            email: payload.email ? payload.email : r.email,
            position: payload.position ? payload.position : r.position,
          };
        });
      });

      cancelEdit();
      showMessage(content.messages.saved, MessageType.SUCCESS);
    } catch (e) {
      let msg = content.messages.errorSave;
      if (e && e.response && e.response.data && e.response.data.message) {
        msg = e.response.data.message;
      } else if (e && e.message) {
        msg = e.message;
      }
      showError(msg);
    }
  }

  async function onRemove(userId) {
    if (!window.confirm(content.messages.confirmDelete)) {
      return;
    }
    try {
      await deleteEmployee(userId);
      setRows(function (prev) {
        return prev.filter(function (r) {
          return r.userId !== userId;
        });
      });
      showMessage(content.messages.deleted, MessageType.SUCCESS);
    } catch (e) {
      let msg = content.messages.errorDelete;
      if (e && e.response && e.response.data && e.response.data.message) {
        msg = e.response.data.message;
      } else if (e && e.message) {
        msg = e.message;
      }
      showError(msg);
    }
  }

  function handleSearchChange(event) {
    setQ(event.target.value);
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
            <h1 className="dashboard-title">{content.hero.heading}</h1>

            <div className="bp-form staff-search">
              <div className="form-field form-field--grow">
                <input
                  type="search"
                  className="input"
                  placeholder={content.search.placeholder}
                  value={q}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="bp-btn" onClick={load}>
                  {content.search.button}
                </button>
              </div>
            </div>
          </header>

          <section className="bp-card" aria-label={content.table.title}>
            {loading ? (
              <div className="bp-state">{content.messages.loading}</div>
            ) : error ? (
              <div className="bp-state error">
                {content.messages.errorPrefix} {error}
              </div>
            ) : filteredRows.length > 0 ? (
              <div className="table-wrap">
                <table className="bp-table">
                  <thead>
                    <tr>
                      <th>{content.table.columns.name}</th>
                      <th>{content.table.columns.position}</th>
                      <th>{content.table.columns.date}</th>
                      <th>{content.table.columns.email}</th>
                      <th>{content.table.columns.pesel}</th>
                      <th className="table-actions">
                        {content.table.columns.actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map(function (r) {
                      const isEdit = editId === r.userId;

                      return (
                        <tr key={r.userId}>
                          <td data-label={content.table.columns.name}>
                            <strong>
                              {r.firstName} {r.lastName}
                            </strong>
                          </td>

                          <td data-label={content.table.columns.position}>
                            {isEdit ? (
                              <select
                                className="select"
                                value={form.position}
                                onChange={function (e) {
                                  setForm(function (f) {
                                    return {
                                      ...f,
                                      position: e.target.value,
                                    };
                                  });
                                }}
                              >
                                <option value="">— wybierz —</option>
                                {content.table.positions.map(function (p) {
                                  return (
                                    <option key={p} value={p}>
                                      {p}
                                    </option>
                                  );
                                })}
                              </select>
                            ) : (
                              r.position || "—"
                            )}
                          </td>

                          <td data-label={content.table.columns.date}>
                            {r.employmentStartDay
                              ? new Date(
                                  r.employmentStartDay
                                ).toLocaleDateString("pl-PL")
                              : "—"}
                          </td>

                          <td data-label={content.table.columns.email}>
                            {isEdit ? (
                              <input
                                className="input"
                                type="email"
                                placeholder="email@domena.pl"
                                value={form.email}
                                onChange={function (e) {
                                  setForm(function (f) {
                                    return {
                                      ...f,
                                      email: e.target.value,
                                    };
                                  });
                                }}
                              />
                            ) : (
                              r.email
                            )}
                          </td>

                          <td data-label={content.table.columns.pesel}>
                            {r.pesel}
                          </td>

                          <td data-label={content.table.columns.actions}>
                            {isEdit ? (
                              <div className="form-actions">
                                <button
                                  className="bp-btn"
                                  onClick={saveEdit}
                                >
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
                              <div className="form-actions">
                                <button
                                  className="bp-btn"
                                  onClick={function () {
                                    startEdit(r);
                                  }}
                                >
                                  {content.actions.edit}
                                </button>
                                <button
                                  className="bp-btn bp-btn--ghost"
                                  onClick={function () {
                                    onRemove(r.userId);
                                  }}
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
              </div>
            ) : (
              <div className="bp-state">{content.table.noData}</div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
