import { useState, useEffect, useMemo } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box, Button } from "@mui/material";
import ScheduledAppointment from "./ScheduledAppointment";
import {
  getDonations,
  getScheduledAppointmentForUser,
  deleteScheduledAppointment,
} from "../../services/ProfileService";
import { MessageType } from "../shared/const/MessageType.model";
import { showMessage, showError } from "../shared/services/MessageService";
import authService from "../../services/AuthenticationService";

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const endOfDay = (d) => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};
const addYears = (d, n) => {
  const x = new Date(d);
  x.setFullYear(x.getFullYear() + n);
  return x;
};
const isValidDate = (d) => d instanceof Date && !isNaN(d?.getTime?.());

export default function VisitHistory() {
  const today = new Date();
  const defaultFrom = addYears(today, -1);

  const [userId, setUserId] = useState(null);
  const [idLoading, setIdLoading] = useState(true);
  const [idError, setIdError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const id = await authService.getMyId();
        if (active) setUserId(id);
      } catch (e) {
        if (active)
          setIdError(
            e?.response?.data?.message ||
              e?.message ||
              "Nie udało się pobrać ID użytkownika"
          );
      } finally {
        if (active) setIdLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const [visits, setVisits] = useState([]);
  const [scheduledAppointment, setScheduledAppointment] = useState(null);

  const [fromDate, setFromDate] = useState(startOfDay(defaultFrom));
  const [toDate, setToDate] = useState(endOfDay(today));

  const [fromError, setFromError] = useState(null);
  const [toError, setToError] = useState(null);
  const [rangeError, setRangeError] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  useEffect(() => {
    if (isValidDate(fromDate) && isValidDate(toDate)) {
      const f = startOfDay(fromDate).getTime();
      const t = endOfDay(toDate).getTime();
      setRangeError(f <= t ? null : "Data 'Od' nie może być późniejsza niż 'Do'.");
    } else {
      setRangeError(null);
    }
  }, [fromDate, toDate]);

  const hasAnyError = useMemo(
    () => Boolean(fromError || toError || rangeError),
    [fromError, toError, rangeError]
  );

  const toIsoOrUndefined = (d, useEndOfDay = false) => {
    if (!isValidDate(d)) return undefined;
    const normalized = useEndOfDay ? endOfDay(d) : startOfDay(d);
    return normalized.toISOString();
  };

  const fetchAll = () => {
    if (!userId) return;
    if (hasAnyError) return;

    setLoading(true);
    setError(null);

    Promise.all([
      getDonations(
        userId,
        toIsoOrUndefined(fromDate, false),
        toIsoOrUndefined(toDate, true)
      ),
      getScheduledAppointmentForUser(userId),
    ])
      .then(([donations, scheduled]) => {
        setVisits(donations || []);
        setScheduledAppointment(scheduled || null);
      })
      .catch((err) => {
        console.error(err);
        setError(err?.message || "Błąd ładowania danych");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (userId) fetchAll();
  }, [userId, fromDate, toDate]);

  const handleDelete = (id) => {
    deleteScheduledAppointment(id)
      .then(() => {
        showMessage("Wizyta została usunięta.", MessageType.SUCCESS);
        fetchAll();
      })
      .catch((err) =>
        showError(
          err && err.message ? err.message : "Błąd podczas usuwania wizyty"
        )
      );
  };

  if (idLoading) return <div className="loading">Pobieram identyfikator użytkownika...</div>;
  if (idError) return <div className="error">Błąd: {idError}</div>;
  if (!userId) return <div className="no-data">Nie znaleziono identyfikatora użytkownika</div>;

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
        <Box
          className="filter-bar"
          sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}
        >
          <DatePicker
            label="Od daty"
            value={fromDate}
            onChange={(val) => setFromDate(val ? startOfDay(val) : null)}
            onError={(reason) => {
              if (reason === "invalidDate") setFromError("Nieprawidłowa data.");
              else if (reason) setFromError("Błędna data.");
              else setFromError(null);
            }}
            open={openFrom}
            onOpen={() => setOpenFrom(true)}
            onClose={() => setOpenFrom(false)}
            slotProps={{
              textField: {
                size: "small",
                error: Boolean(fromError),
                helperText: fromError || "",
                inputProps: { readOnly: true },
                onKeyDown: (e) => e.preventDefault(),
                onPaste: (e) => e.preventDefault(),
                onClick: () => setOpenFrom(true),
              },
              openPickerButton: { disabled: false },
            }}
          />

          <DatePicker
            label="Do daty"
            value={toDate}
            onChange={(val) => setToDate(val ? endOfDay(val) : null)}
            onError={(reason) => {
              if (reason === "invalidDate") setToError("Nieprawidłowa data.");
              else if (reason) setToError("Błędna data.");
              else setToError(null);
            }}
            open={openTo}
            onOpen={() => setOpenTo(true)}
            onClose={() => setOpenTo(false)}
            slotProps={{
              textField: {
                size: "small",
                error: Boolean(toError),
                helperText: toError || "",
                inputProps: { readOnly: true },
                onKeyDown: (e) => e.preventDefault(),
                onPaste: (e) => e.preventDefault(),
                onClick: () => setOpenTo(true),
              },
              openPickerButton: { disabled: false },
            }}
          />

          <Button
            variant="contained"
            color="error"
            onClick={fetchAll}
            disabled={hasAnyError}
          >
            Filtruj
          </Button>
        </Box>

        {rangeError && (
          <div style={{ color: "#d32f2f", marginTop: 8 }}>{rangeError}</div>
        )}
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
                <td>{String(v.donationType || "").replaceAll("_", " ").toLowerCase()}</td>
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
