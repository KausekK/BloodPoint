import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, Routes, Route } from "react-router-dom";
import { getProfile, getDonations, getScheduledAppointmentForUser } from "../../services/ProfileService";
import "./Profile.css";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box, TextField, Button } from "@mui/material";
import { CalendarToday, Person, Logout, Edit } from "@mui/icons-material";
import Documents from './Documents/Documents';


// Element nawigacji w sidebarze
function NavItem({ to, icon, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

function Detail({ label, value }) {
  return (
    <div className="detail-item">
      <p className="detail-label">{label}</p>
      <p className="detail-value">{value ?? "-"}</p>
    </div>
  );
}

function ProfileInfo() {
  const [profile, setProfile] = useState(null);
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = 10; // TODO: use logged-in user ID
    getProfile(userId)
      .then((data) => setProfile(data))
      .catch((err) => {
        console.error(err);
        setError(err.message || "Błąd ładowania profilu");
      });

    getDonations(userId)
      .then((data) => setDonation(data))
      .catch((err) => {
        console.error(err);
        setError(err.message || "Błąd ładowania historii wizyt");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Ładowanie profilu...</div>;
  if (error) return <div className="error">Błąd: {error}</div>;
  if (!profile || !donation)
    return <div className="no-data">Brak danych profilu</div>;

  return (
    <div className="cards">
      <section className="card">
        <header className="card-header">
          <h2 className="card-title">Dane profilu</h2>
          <button className="primary-btn">
            Edytuj <Edit fontSize="small" />
          </button>
        </header>
        <div className="details-grid">
          <Detail
            label="Imię i nazwisko"
            value={`${profile.firstName} ${profile.lastName}`}
          />
          <Detail label="Płeć" />
          <Detail label="Wiek" value={profile.age} />
          <Detail label="PESEL" value={profile.pesel} />
          <Detail label="Numer telefonu" value={profile.phoneNumber} />
          <Detail label="E-mail" value={profile.email} />
        </div>
      </section>
      <section className="card">
        <h2 className="card-title">Informacje o dawcy</h2>
        <Detail
          label="Ilość oddanej krwi"
          value={`${profile.totalDonatedBlood / 1000} litry`}
        />
        <Detail
          label="Ostatnia donacja"
          value={new Date(profile.lastDonationDate).toLocaleDateString()}
        />
        <Detail
          label="Grupa krwi"
          value={`${profile.bloodGroup} Rh${profile.rhFactor}`}
        />
      </section>
      <section className="card">
        <h2 className="card-title">Ogólne</h2>
        <div className="row-between">
          <span className="card-text">Zmień hasło</span>
          <button className="primary-btn">Zmień</button>
        </div>
      </section>
    </div>
  );
}

 function VisitHistory() {
  const [visits, setVisits] = useState([]);
  const [scheduledAppointment, setScheduledAppointment] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = 10; // TODO: podciągnąć z kontekstu zalogowanego użytkownika

  const fetchAll = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      getDonations(
        userId,
        fromDate ? fromDate.toISOString() : undefined,
        toDate ? toDate.toISOString() : undefined
      ),
      getScheduledAppointmentForUser(userId)
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

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) return <div className="loading">Ładowanie historii wizyt...</div>;
  if (error) return <div className="error">Błąd: {error}</div>;

  return (
    <section className="visit-history">
      {scheduledAppointment && (
        <section className="scheduled-appointment">
          <h2 className="card-title">Zaplanowana wizyta</h2>
          <div className="details-grid">
            <Detail
              label="Data"
              value={new Date(scheduledAppointment.appointmentTime).toLocaleString()}
            />
            <Detail
              label="Adres"
              value={scheduledAppointment.appointmentCity + ", " + scheduledAppointment.appointmentStreet}
            />
          </div>
        </section>
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
          <Button
            variant="contained"
            color="error"
            onClick={fetchAll}
          >
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
            {visits.map((v, idx) => {
              const date = new Date(v.donationDate).toLocaleDateString();
              return (
                <tr key={v.id} className={idx % 2 === 0 ? "" : "striped"}>
                  <td>{date}</td>
                  <td>{v.donationType.replace("_", " ").toLowerCase()}</td>
                  <td>{v.amountOfBlood} ml</td>
                  <td>{v.city}</td>
                  <td>{v.street}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <aside className="sidebar">
        <NavItem
          to="/profile"
          icon={<Person fontSize="small" />}
          label="Profil"
          end={true}
        />
        <NavItem
          to="/profile/appointments"
          icon={<CalendarToday fontSize="small" />}
          label="Wizyty"
        />
        <NavItem
          to="/profile/documents"
          icon={<Edit fontSize="small" />}
          label="Dokumenty"
        />
        <div className="spacer" />
        <button className="nav-item" onClick={() => navigate("/logout")}>
          <Logout fontSize="small" />
          <span>Wyloguj się</span>
        </button>
      </aside>
      <main className="content">
        <h1 className="heading">Profil dawcy</h1>
        <Routes>
          <Route index element={<ProfileInfo />} />
          <Route path="appointments" element={<VisitHistory />} />
          <Route path="documents" element={<Documents />} />
          <Route path="*" element={<ProfileInfo />} />
        </Routes>
      </main>
    </div>
  );
}
