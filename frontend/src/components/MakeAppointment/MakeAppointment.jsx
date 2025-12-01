import { useEffect, useState } from "react";
import "./MakeAppointment.css";
import Map from "../Map/Map";
import Header from "../Header/Header";
import { getSlotsForDayPaged, addAppointment } from "../../services/MakeAppointmentService";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { showMessage, showError } from "../shared/services/MessageService";
import CustomModal from "./CustomModal";
import { MessageType } from "../shared/const/MessageType.model";
import { getCities, getPoints } from "../../services/BloodDonationPointService";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import authService from "../../services/AuthenticationService";
import BackButton from "../BackButton/BackButton";

export default function MakeAppointment() {
  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);

  const [points, setPoints] = useState([]);
  const [pointId, setPointId] = useState("");

  const [userId, setUserId] = useState(null);
  const [idLoading, setIdLoading] = useState(true);
  const [idError, setIdError] = useState("");

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({ totalPages: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState({ dateString: "", timeString: "" });
  const selectedPointIdNumber = pointId ? Number(pointId) : (points[0]?.id || null);

  useEffect(() => {
    getCities()
      .then((data) => setCities(data || []))
      .catch(() => showError("Błąd przy pobieraniu miast"));
  }, []);

  useEffect(() => {
    if (!city) { 
      setPoints([]);
      setPointId(""); 
      return; 
    }
    setSelectedDate(null);
    setSelectedSlot(null);
    setPage(0);
    getPoints(city)
      .then((data) => setPoints(data || []))
      .catch(() => showError("Błąd przy pobieraniu placówek"));
  }, [city]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const id = await authService.getUserId();
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
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!selectedDate || !city || !pointId) return;
    setLoading(true);
    getSlotsForDayPaged(city, pointId, selectedDate, page)
      .then((resPage) => {
        setTimes((resPage && resPage.content) || []);
        setPageInfo(resPage || { totalPages: 0 });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [city, pointId, selectedDate, page]);

  const submit = async () => {
    if (!selectedDate || !selectedSlot) return;
    if (!userId) {
      showError("Brak identyfikatora użytkownika. Zaloguj się ponownie.");
      return;
    }

    const appointment = { userId, slotId: selectedSlot.id };

    try {
      const res = await addAppointment(appointment);

      if (res && res.messages && res.messages.length) {
        res.messages.forEach((m) => showMessage(m.msg, m.type));
        const hasError = res.messages.some((m) => m.type === MessageType.ERROR);
        const hasSuccess = res.messages.some((m) => m.type === MessageType.SUCCESS);
        if (hasError) setIsOpen(false);
        else if (hasSuccess) setIsOpen(true);
      } else {
        showError("Nieoczekiwana odpowiedź serwera");
      }

      const timeString = selectedSlot.startTime.slice(11, 16);
      setModalData({ dateString: selectedDate, timeString });
    } catch (e) {
      showError(e && e.message ? e.message : "Błąd podczas umawiania wizyty");
    }
  };

  const pickDate = (iso) => {
    setSelectedDate(iso);
    setSelectedSlot(null);
    setPage(0);
  };

  return (
    <>
      <Header />
      <main className="page make-appointment">
        <BackButton to="/" label="Powrót do panelu dawcy" />
        <div className="page-content">
          <h1 className="page-heading">
            Umów się na oddanie <br className="desktop-break" /> krwi
          </h1>

          {loading ? <Spinner /> : null}

          {idLoading && <div className="loading">Pobieram identyfikator użytkownika…</div>}
          {idError && <div className="error">Błąd: {idError}</div>}

        <div className="filters" style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="city-label">Miasto</InputLabel>
            <Select
              labelId="city-label"
              value={city}
              label="Miasto"
              onChange={(e) => setCity(e.target.value)}
              required
            >
              {cities.map((c, i) => (
                <MenuItem key={i} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 240 }} disabled={!city}>
            <InputLabel id="point-label">Placówka</InputLabel>
            <Select
              labelId="point-label"
              value={pointId}
              label="Placówka"
              onChange={(e) => {
                setPointId(e.target.value);
                setSelectedDate(null);
                setSelectedSlot(null);
                setPage(0);
              }}
              required
            >
              <MenuItem value="" disabled>— wybierz placówkę —</MenuItem>
              {points.map((p) => (
                <MenuItem key={p.id} value={String(p.id)}>
                  {p.street}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
          {!loading && city ? (
            <div className="appt-wrap">
              <div className="appt-left">
                <p className="text-helper">{formatMonthYear(selectedDate)}</p>

                <div className="date-grid">
                  {days.map((iso) => {
                    const day = iso.slice(8);
                    const weekday = new Date(iso).toLocaleDateString("pl-PL", { weekday: "short" }).toUpperCase();
                    const isSel = selectedDate === iso;
                    return (
                      <button
                        key={iso}
                        onClick={() => pickDate(iso)}
                        className={"date-btn" + (isSel ? " is-selected" : "")}
                      >
                        <span className="date-btn-day">{day}</span>
                        <span className="date-btn-weekday">{weekday}</span>
                      </button>
                    );
                  })}
                </div>

                {times.length !== 0 && !loading ? <p className="text-helper">Dostępne godziny</p> : null}

                <div className="time-grid">
                  {times.length === 0 && !loading ? <p className="text-helper">Brak wolnych terminów</p> : null}
                  {times.map((slot) => {
                    const time = slot.startTime.slice(11, 16);
                    const addr = slot.city + ", " + slot.street;
                    const sel = selectedSlot && selectedSlot.id === slot.id;
                    return (
                      <button
                        key={slot.id + "-" + time}
                        onClick={() => setSelectedSlot(slot)}
                        className={"time-btn" + (sel ? " is-selected" : "")}
                      >
                        <span className="time-btn-time">{time}</span>
                        <span className="time-btn-loc">{addr}</span>
                      </button>
                    );
                  })}
                </div>

                {pageInfo.totalPages > 1 ? (
                  <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                    <Pagination
                      count={pageInfo.totalPages}
                      page={page + 1}
                      onChange={(_, v) => setPage(v - 1)}
                      shape="rounded"
                      color="primary"
                      variant="outlined"
                      size="medium"
                    />
                  </Stack>
                ) : null}

                <button
                  className="appointment-btn"
                  disabled={!pointId || !selectedSlot || !userId || !!idError}
                  onClick={submit}
                >
                  Umów
                </button>

                <CustomModal
                  open={isOpen}
                  onClose={() => setIsOpen(false)}
                  dateString={modalData.dateString}
                  timeString={modalData.timeString}
                />
              </div>

              <div className="appt-right">
                {points.length > 0 ? (
                  <Map
                    key={selectedPointIdNumber || "no-point"}
                    points={points}
                    selectedPointId={selectedPointIdNumber}
                  />
                ) : (
                  <div className="map-placeholder">
                    Wybierz miasto i placówkę, aby zobaczyć lokalizację na mapie.
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}

const days = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return d.toISOString().slice(0, 10);
});

function Spinner() {
  return <div className="spinner" aria-label="Ładowanie…" />;
}

function formatMonthYear(dateIso) {
  if (!dateIso) return "";
  const txt = new Date(dateIso).toLocaleDateString("pl-PL", { month: "long", year: "numeric" });
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}
