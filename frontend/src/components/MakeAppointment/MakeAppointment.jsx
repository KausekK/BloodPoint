import { useEffect, useState } from "react";
import "./MakeAppointment.css";
import { getSlotsForDayPaged } from "../../services/MakeAppointmentService";
import Pagination from "@mui/material/Pagination";
import Stack      from "@mui/material/Stack";

const TODAY = new Date(); 
const daysArray = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + i + 1); 
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
  const [city] = useState("Warszawa"); // TODO: dodac filtrowanie po mieście

  const [days] = useState(daysArray);
  const [selectedDate, setSelectedDate] = useState(null);
  const [times, setTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({ totalPages: 0 });


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

  const handleDateClick = (iso) => {
    setSelectedDate(iso);
    setSelectedTime(null);
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

        {!loading && (
          <div className="make-appointment__wrapper">
            <div className="make-appointment__left">
              <p className="text-helper">
                {formatMonthYear(selectedDate)}
              </p>

              <div className="date-grid">
                {days.map((iso) => {
                  const day     = iso.slice(8);
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

              <p className="text-helper">Dostępne godziny</p>

              <div className="time-grid">
                {times.map((slot) => {
                  const time = slot.startTime.slice(11, 16);
                  const addr = `${slot.city}, ${slot.street}`;
                  return (
                    <button
                      key={`${slot.id}-${time}`}
                      onClick={() => setSelectedTime(time)}
                      className={`time-btn ${
                        selectedTime === time ? "time-btn--selected" : ""
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
                disabled={!selectedDate || !selectedTime}
                onClick={() =>
                  alert(
                    `Zarezerwowano wizytę: ${selectedDate} o ${selectedTime}`
                  )
                }
              >
                Umów
              </button>
            </div>

            <div className="make-appointment__right">
              <img
                src="/src/assets/makeApopointment.png"
                alt="Ilustracja serca z krwią"
                className="illustration"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}