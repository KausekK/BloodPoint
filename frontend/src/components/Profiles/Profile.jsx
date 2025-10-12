import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import NavItem from "./NavItem";
import ProfileInfo from "./ProfileInfo";
import VisitHistory from "./VisitHistory";
import Documents from "./Documents/Documents";
import TodayAppointments from "./TodayAppointments/TodayAppointments";
import { Person, CalendarToday, Edit, Logout, Dashboard } from "@mui/icons-material";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <aside className="sidebar">
        <NavItem to="/profile" icon={<Person />} label="Profil" end />
        <NavItem to="/profile/appointments" icon={<CalendarToday />} label="Wizyty" />
        <NavItem to="/profile/documents" icon={<Edit />} label="Dokumenty" />
        <NavItem to="/profile/manage-appointments" icon={<Dashboard />} label="Obsługa wizyt" />
        <div className="spacer" />
        <button className="nav-item" onClick={() => navigate("/logout")}>
          <Logout />
          <span>Wyloguj się</span>
        </button>
      </aside>
      <main className="content">
        <h1 className="heading">Profil dawcy</h1>
        <Routes>
          <Route index element={<ProfileInfo />} />
          <Route path="appointments" element={<VisitHistory />} />
          <Route path="documents" element={<Documents />} />
          <Route path="manage-appointments" element={<TodayAppointments />} />
        </Routes>
      </main>
    </div>
  );
}
