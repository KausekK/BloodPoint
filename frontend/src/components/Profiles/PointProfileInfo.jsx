import { useEffect, useState } from "react";
import Detail from "./Detail";
import authService from "../../services/AuthenticationService";
import { getPointProfile } from "../../services/ProfileService";

export default function PointProfileInfo() {
  const pointId = Number(authService.getPointId());
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(function () {
    if (!pointId) {
      setLoading(false);
      setError("Brak identyfikatora punktu.");
      return;
    }
    let active = true;
    (async () => {
      try {
        const data = await getPointProfile(pointId);
        if (active) setProfile(data);
      } catch (e) {
        const msg =
          (e && e.response && e.response.data && e.response.data.message) ||
          (e && e.message) ||
          "Błąd ładowania profilu punktu.";
        if (active) setError(msg);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [pointId]);

  if (loading) return <div className="bp-state">Ładowanie…</div>;
  if (error) return <div className="bp-state error">{error}</div>;
  if (!profile) return <div className="bp-state">Brak danych.</div>;

  return (
    <div className="cards">
      <section className="card">
        <header className="card-header">
          <h2 className="card-title">Dane punktu krwiodawstwa</h2>
        </header>
        <div className="details-grid">
          <Detail label="Miasto" value={profile.city} />
          <Detail label="Ulica" value={profile.street} />
          <Detail label="Kod pocztowy" value={profile.zipCode} />
          <Detail label="Telefon" value={profile.phone} />
        </div>
      </section>
    </div>
  );
}
