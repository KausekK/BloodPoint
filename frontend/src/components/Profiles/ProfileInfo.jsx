import { Button } from "@mui/material";
import { Edit } from "@mui/icons-material";
import Detail from "./Detail";
import { useProfile } from "./hooks/useProfile";

export default function ProfileInfo() {
  const userId = 10; // TODO: zamień na ID pobrane z kontekstu uwierzytelnionego użytkownika
  const { profile, loading, error } = useProfile(userId);

  if (loading) return <div className="loading">Ładowanie profilu...</div>;
  if (error)   return <div className="error">Błąd: {error}</div>;
  if (!profile) return <div className="no-data">Brak danych profilu</div>;

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
          <Detail
            label="Imię i nazwisko"
            value={`${profile.firstName} ${profile.lastName}`}
          />
          <Detail label="Płeć" value={profile.gender} />
          <Detail label="Wiek" value={profile.age} />
          <Detail label="PESEL" value={profile.pesel} />
          <Detail label="Numer telefonu" value={profile.phoneNumber} />
          <Detail label="E-mail" value={profile.email} />
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Informacje o dawcy</h2>
        <div className="details-grid">
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
