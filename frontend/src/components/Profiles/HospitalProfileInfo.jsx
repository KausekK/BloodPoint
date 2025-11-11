import { useEffect, useState } from "react";
import Detail from "./Detail";
import authService from "../../services/AuthenticationService";
import { getHospitalProfile } from "../../services/ProfileService";

export default function HospitalProfileInfo() {
  const hospitalId = Number(authService.getHospitalId());
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(function () {
    if (!hospitalId) {
      setLoading(false);
      setError("Brak identyfikatora szpitala.");
      return;
    }
    let active = true;
    (async () => {
      try {
        const data = await getHospitalProfile(hospitalId);
        if (active) setProfile(data);
      } catch (e) {
        const msg =
          (e && e.response && e.response.data && e.response.data.message) ||
          (e && e.message) ||
          "Błąd ładowania profilu szpitala.";
        if (active) setError(msg);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [hospitalId]);

  if (loading) return <div className="bp-state">Ładowanie…</div>;
  if (error) return <div className="bp-state error">{error}</div>;
  if (!profile) return <div className="bp-state">Brak danych.</div>;

  return (
    <div className="cards">
      <section className="card">
        <header className="card-header">
          <h2 className="card-title">Dane szpitala</h2>
        </header>
        <div className="details-grid">
          <Detail label="Numer szpitala" value={profile.hospitalNumber} />
          <Detail label="Województwo" value={profile.province} />
          <Detail label="Miasto" value={profile.city} />
          <Detail label="Kod pocztowy" value={profile.zipCode} />
          <Detail label="Ulica" value={profile.street} />
          <Detail label="Telefon" value={profile.phone} />
        </div>
      </section>
    </div>
  );
}
