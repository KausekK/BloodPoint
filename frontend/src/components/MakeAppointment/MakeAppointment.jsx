import { useEffect, useState } from "react";
import "./MakeAppointment.css";
import Map from "../Map/Map";
import {
  getSlotsForDayPaged,
  addAppointment,
} from "../../services/MakeAppointmentService";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { showMessage, showError } from "../shared/services/MessageService";
import CustomModal from "./CustomModal";
import { MessageType } from "../shared/const/MessageType.model";
import { getCities } from "../../services/BloodDonationPointService";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const TODAY = new Date();
const daysArray = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + i);
  return d.toISOString().slice(0, 10);
});

function Spinner() {
  return <div className="spinner" aria-label="Ładowanie…" />;
}

function formatMonthYear(dateIso) {
  if (!dateIso) return "";
  const txt = new Date(dateIso).toLocaleDateString("pl-PL", {
    month: "long",
    year: "numeric",
  });
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}

export default function MakeAppointment() {
  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);
  const [user] = useState({ id: 10 }); // TODO: dodac zalogowanego usera
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [days] = useState(daysArray);
  const [selectedDate, setSelectedDate] = useState(null);
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({ totalPages: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState({
    dateString: "",
    timeString: "",
  });

  useEffect(() => {
    getCities()
      .then((data) => {
        setCities(data);
      })
      .catch(() => {
        showError("Błąd przy pobieraniu miast");
      });
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    setLoading(true);

    getSlotsForDayPaged(city, selectedDate, page)
      .then((resPage) => {
        setTimes(resPage.content || []);
        setPageInfo(resPage);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [city, selectedDate, page]);

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedSlot) return;

    const appointment = {
      userId: user.id,
      slotId: selectedSlot.id,
    };

    try {
      const res = await addAppointment(appointment);

      if (res.messages?.length) {
        res.messages.forEach(({ msg, type }) => {
          showMessage(msg, type);
        });
        if (res.messages.some((m) => m.type === MessageType.ERROR)) {
          setIsOpen(false);
        } else if (res.messages.some((m) => m.type === MessageType.SUCCESS)) {
          setIsOpen(true);
        }
      } else {
        showError("Nieoczekiwana odpowiedź serwera");
      }
      const timeString = selectedSlot.startTime.slice(11, 16);
      setModalData({ dateString: selectedDate, timeString });
    } catch (error) {
      showError(error);
    }
  };

  const handleDateClick = (iso) => {
    setSelectedDate(iso);
    setSelectedSlot(null);
    setPage(0);
  };

  return (
    <div className="make-appointment">
      <div className="make-appointment__top-bar" />

      <div className="make-appointment__content">
        <h1 className="make-appointment__heading">
          Umów się na oddanie <br className="desktop-break" /> krwi
        </h1>

        {loading && <Spinner />}

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="cat-label">Miasto</InputLabel>
          <Select
            labelId="cat-label"
            value={city}
            label="Miasto"
            onChange={handleCityChange}
          >
            {cities.map((c, index) => (
              <MenuItem key={index} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {!loading && city && (
          <div className="make-appointment__wrapper">
            <div className="make-appointment__left">
              <p className="text-helper">{formatMonthYear(selectedDate)}</p>

              <div className="date-grid">
                {days.map((iso) => {
                  const day = iso.slice(8);
                  const weekday = new Date(iso)
                    .toLocaleDateString("pl-PL", { weekday: "short" })
                    .toUpperCase();
                  return (
                    <button
                      key={iso}
                      onClick={() => handleDateClick(iso)}
                      className={`date-btn ${
                        selectedDate === iso ? "date-btn--selected" : ""
                      }`}
                    >
                      <span className="date-btn__day">{day}</span>
                      <span className="date-btn__weekday">{weekday}</span>
                    </button>
                  );
                })}
              </div>

              {times.length !== 0 && !loading && (
                <p className="text-helper">Dostępne godziny</p>
              )}

              <div className="time-grid">
                {times.length === 0 && !loading && (
                  <p className="text-helper">Brak wolnych terminów</p>
                )}
                {times.map((slot) => {
                  const time = slot.startTime.slice(11, 16);
                  const addr = `${slot.city}, ${slot.street}`;
                  return (
                    <button
                      key={`${slot.id}-${time}`}
                      onClick={() => setSelectedSlot(slot)}
                      className={`time-btn ${
                        selectedSlot?.id === slot.id ? "time-btn--selected" : ""
                      }`}
                    >
                      <span className="time-btn__time">{time}</span>
                      <span className="time-btn__loc">{addr}</span>
                    </button>
                  );
                })}
              </div>

              {pageInfo.totalPages > 1 && (
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
              )}

              <button
                className="appointment-btn"
                disabled={!selectedSlot}
                onClick={handleSubmit}
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

            <div className="make-appointment__right">
              <Map key={city} city={city} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
