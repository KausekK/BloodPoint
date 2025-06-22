import React, { useState, useEffect } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box, TextField, Button } from "@mui/material";
import ScheduledAppointment from "./ScheduledAppointment";
import {
  getDonations,
  getScheduledAppointmentForUser,
  deleteScheduledAppointment,
} from "../../services/ProfileService";

export default function VisitHistory() {
  const [visits, setVisits] = useState([]);
  const [scheduledAppointment, setScheduledAppointment] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = 10; // TODO: pobrać z kontekstu zalogowanego użytkownika

  const fetchAll = () => {
    setLoading(true);
    setError(null);

    Promise.all([
      getDonations(
        userId,
        fromDate ? fromDate.toISOString() : undefined,
        toDate ? toDate.toISOString() : undefined
      ),
      getScheduledAppointmentForUser(userId),
    ])
      .then(([donations, scheduled]) => {
        setVisits(donations);
        setScheduledAppointment(scheduled || null);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Błąd ładowania danych");
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchAll, [fromDate, toDate]);

  const handleDelete = (id) => {
    deleteScheduledAppointment(id)
      .then(() => fetchAll())
      .catch((err) =>
        console.error("Błąd podczas usuwania wizyty:", err)
      );
  };

  if (loading) return <div className="loading">Ładowanie historii wizyt...</div>;
  if (error) return <div className="error">Błąd: {error}</div>;

  return (
    <section className="visit-history">
      {scheduledAppointment && (
        <ScheduledAppointment
          appointment={scheduledAppointment}
          onCancel={handleDelete}
        />
      )}

      <h2 className="card-title">Historia wizyt</h2>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box className="filter-bar">
          <DatePicker
            label="Od daty"
            value={fromDate}
            onChange={setFromDate}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
          <DatePicker
            label="Do daty"
            value={toDate}
            onChange={setToDate}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
          <Button variant="contained" color="error" onClick={fetchAll}>
            Filtruj
          </Button>
        </Box>
      </LocalizationProvider>

      {visits.length === 0 ? (
        <div className="no-data">Brak historii wizyt</div>
      ) : (
        <table className="visit-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Typ donacji</th>
              <th>Ilość krwi</th>
              <th>Miasto</th>
              <th>Ulica</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((v, idx) => (
              <tr key={v.id} className={idx % 2 === 0 ? "" : "striped"}>
                <td>{new Date(v.donationDate).toLocaleDateString()}</td>
                <td>{v.donationType.replace("_", " ").toLowerCase()}</td>
                <td>{v.amountOfBlood} ml</td>
                <td>{v.city}</td>
                <td>{v.street}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
