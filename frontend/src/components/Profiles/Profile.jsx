import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getProfile } from "../../services/ProfileService";
import "./Profile.css";
import {
    Dashboard,
    CalendarToday,
    Person,
    Logout,
    Edit,
} from "@mui/icons-material";

function NavItem({ to, icon, label }) {
    return (
        <NavLink
            to={to}
            end
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getProfile(10) //TODO ustawic id zalogowanego użytkownika
            .then((data) => setProfile(data))
            .catch((err) => {
                console.error(err);
                setError(err.message || "Błąd ładowania profilu");
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading">Ładowanie profilu...</div>;
    if (error) return <div className="error">Błąd: {error}</div>;
    if (!profile) return <div className="no-data">Brak danych profilu</div>;

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
                    <Detail label="Wiek" value={profile.age} />
                    <Detail label="Numer telefonu" value={profile.phoneNumber} />
                    <Detail label="E-mail" value={profile.email} />
                    <Detail label="PESEL" value={profile.pesel} />
                </div>
            </section>

            <section className="card">
                <h2 className="card-title">Informacje o dawcy</h2>
                <p className="card-text">Ilość oddanej krwi: {profile.totalDonatedBlood / 1000} litry</p>
                <p className="card-text">Ostatnia donacja: {profile.lastDonationDate}</p>
                <p className="card-text">Grupa krwi: {profile.bloodGroup} Rh{profile.rhFactor}</p>
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

export default function Profile() {
    const navigate = useNavigate();

    return (
        <div className="container">
            <aside className="sidebar">
                <NavItem
                    to="/dashboard"
                    icon={<Dashboard fontSize="small" />}
                    label="Tablica"
                />
                <NavItem
                    to="/appointments"
                    icon={<CalendarToday fontSize="small" />}
                    label="Wizyty"
                />
                <NavItem
                    to="/profile"
                    icon={<Person fontSize="small" />}
                    label="Profil"
                />
                <div className="spacer" />
                <button className="nav-item" onClick={() => navigate("/logout")}>
                    <Logout fontSize="small" />
                    <span>Wyloguj się</span>
                </button>
            </aside>

            <main className="content">
                <h1 className="heading">Profil dawcy</h1>
                <ProfileInfo />
            </main>
        </div>
    );
}
