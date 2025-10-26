import { Button } from "@mui/material";
import { Edit } from "@mui/icons-material";
import Detail from "./Detail";
import { useProfile } from "./hooks/useProfile";
import { useState, useEffect } from "react";
import authService from "../../services/AuthenticationService";

export default function ProfileInfo() {
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
        if (active) setIdError(e?.response?.data?.message || e?.message || "Nie udało się pobrać ID użytkownika");
      } finally {
        if (active) setIdLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const { profile, loading, error } = useProfile(userId);
  const [age, setAge] = useState(0);

  useEffect(() => {
    if (!profile?.birthDate) return;
    const dob = new Date(profile.birthDate);
    const today = new Date();
    let years = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) years--;
    setAge(years);
  }, [profile]);

  if (idLoading) return <div className="loading">Pobieram identyfikator użytkownika...</div>;
  if (idError) return <div className="error">Błąd: {idError}</div>;
  if (!userId) return <div className="no-data">Nie znaleziono identyfikatora użytkownika</div>;

  if (loading) return <div className="loading">Ładowanie profilu...</div>;
  if (error) return <div className="error">Błąd: {error}</div>;
  if (!profile) return <div className="no-data">Brak danych profilu</div>;

  const genderLabel = profile.gender === "K" ? "Kobieta" : profile.gender === "M" ? "Mężczyzna" : profile.gender;

  return (
    <div className="cards">
      <section className="card">
        <header className="card-header">
          <h2 className="card-title">Dane profilu</h2>
          <Button variant="contained" size="small">
            Edytuj <Edit fontSize="small" />
          </Button>
        </header>
        <div className="details-grid">
          <Detail label="Imię i nazwisko" value={`${profile.firstName} ${profile.lastName}`} />
          <Detail label="Płeć" value={genderLabel} />
          <Detail label="Wiek" value={age} />
          <Detail label="PESEL" value={profile.pesel} />
          <Detail label="Numer telefonu" value={profile.phone} />
          <Detail label="E-mail" value={profile.email} />
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Informacje o dawcy</h2>
        <div className="details-grid">
          <Detail label="Ilość oddanej krwi" value={profile.totalDonatedBlood != null ? `${profile.totalDonatedBlood / 1000} l` : "-"} />
          <Detail label="Ostatnia donacja" value={profile.lastDonationDate ? new Date(profile.lastDonationDate).toLocaleDateString() : "-"} />
          <Detail label="Grupa krwi" value={profile.bloodGroup && profile.rhFactor ? `${profile.bloodGroup} Rh${profile.rhFactor}` : "-"} />
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Ogólne</h2>
        <div className="row-between">
          <span className="card-text">Zmień hasło</span>
          <Button variant="contained">Zmień</Button>
        </div>
      </section>
    </div>
  );
}
