import React from "react";
import { Routes, Route } from "react-router-dom";
import NavItem from "./NavItem";
import ProfileInfo from "./ProfileInfo";
import VisitHistory from "./VisitHistory";
import Documents from "./Documents/Documents";
import TodayAppointments from "./TodayAppointments/TodayAppointments";
import { Person, CalendarToday, Edit, Logout, Dashboard } from "@mui/icons-material";
import "./Profile.css";
import Header from "../Header/Header";

export default function Profile() {

  return (
    <>
      <Header />
      <div className="container">
        <aside className="sidebar">
          <NavItem to="/profil" icon={<Person />} label="Profil" end />
          <NavItem to="/profil/wizyty" icon={<CalendarToday />} label="Wizyty" />
          <NavItem to="/profil/dokumenty" icon={<Edit />} label="Dokumenty" />
          <NavItem to="/profil/zarzadzanie-wizytami" icon={<Dashboard />} label="Obsługa wizyt" />
          <div className="spacer" />
         
        </aside>
        <main className="content">
          <h1 className="heading">Profil dawcy</h1>
          <Routes>
            <Route index element={<ProfileInfo />} />
            <Route path="wizyty" element={<VisitHistory />} />
            <Route path="dokumenty" element={<Documents />} />
            <Route path="zarzadzanie-wizytami" element={<TodayAppointments />} />
          </Routes>
        </main>
      </div>
    </>
  );
}