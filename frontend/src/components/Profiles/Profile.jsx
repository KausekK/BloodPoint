import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavItem from "./NavItem";
import Header from "../Header/Header";
import "./Profile.css";

import ProfileInfoDonor from "./ProfileInfo";
import PointProfileInfo from "./PointProfileInfo";
import HospitalProfileInfo from "./HospitalProfileInfo";

import TodayAppointments from "./TodayAppointments/TodayAppointments";
import VisitHistory from "./VisitHistory";
import Documents from "./Documents/Documents";
import PointAppointmentsHistory from "./PointAppointmentsHistory";


import { Person, CalendarToday, Edit, Dashboard } from "@mui/icons-material";
import authService from "../../services/AuthenticationService";

export default function Profile() {
  const roles = authService.getUser?.()?.roles || [];
  const isDonor = roles.includes("DAWCA");
  const isPoint = roles.includes("PUNKT_KRWIODAWSTWA");
  const isHospital = roles.includes("SZPITAL");

  const heading = isPoint
    ? "Profil punktu krwiodawstwa"
    : isHospital
    ? "Profil szpitala"
    : "Profil dawcy";

  const StartComponent = isPoint
    ? PointProfileInfo
    : isHospital
    ? HospitalProfileInfo
    : ProfileInfoDonor;

  return (
    <>
      <Header />
      <div className="container">
        <aside className="sidebar">
          <NavItem to="/profil" icon={<Person />} label="Profil" end />

          {isDonor && (
            <>
              <NavItem to="/profil/wizyty" icon={<CalendarToday />} label="Wizyty" />
              <NavItem to="/profil/dokumenty" icon={<Edit />} label="Dokumenty" />
            </>
          )}

        {isPoint && (
          <>
            <NavItem
              to="/profil/zarzadzanie-wizytami"
              icon={<Dashboard />}
              label="Obsługa wizyt"
            />
            <NavItem
              to="/profil/historia-wizyt"
              icon={<CalendarToday />}
              label="Historia wizyt"
            />
          </>
        )}

          <div className="spacer" />
        </aside>

        <main className="content">
          <h1 className="heading">{heading}</h1>

          <Routes>
            <Route index element={<StartComponent />} />
            {isDonor && (
              <>
                <Route path="wizyty" element={<VisitHistory />} />
                <Route path="dokumenty" element={<Documents />} />
              </>
            )}
            {isPoint && (
              <>
                <Route path="zarzadzanie-wizytami" element={<TodayAppointments />} />
                <Route path="historia-wizyt" element={<PointAppointmentsHistory />} />
              </>
            )}

            <Route path="*" element={<Navigate to="/profil" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
}
