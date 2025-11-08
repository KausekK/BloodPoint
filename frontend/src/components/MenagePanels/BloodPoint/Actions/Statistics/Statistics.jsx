import { useEffect, useState } from "react";
import Header from "../../../../Header/Header";
import Footer from "../../../../Footer/Footer";
import CTA from "../../../../CTA/CTA";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getDonationStatistics } from "../../../../../services/StatisticsService";
import "../../../../SharedCSS/MenagePanels.css";
import BackButton from "../../../../BackButton/BackButton";

export default function Statistics() {
  const [from, setFrom] = useState("2025-01-01");
  const [to, setTo] = useState("2025-10-24");
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDonationStatistics(from, to);
      setStats(data);
    } catch (err) {
      console.error("Błąd pobierania statystyk:", err);
      setError("Nie udało się pobrać danych z serwera.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <>
      <Header />
      <main className="bp-section">
        <BackButton to="/punkt-krwiodawstwa/dashboard" label="Powrót do panelu punktu krwiodawstwa" />
        <div className="bp-container">
          <header className="dashboard-head">
            <h1 className="dashboard-title">Statystyki donacji</h1>
            <p className="dashboard-lead">
              Wybierz zakres dat, aby zobaczyć szczegółowe dane.
            </p>
          </header>

          <section className="bp-card">
            <div className="bp-form" style={{ marginBottom: "1.5rem" }}>
              <div className="form-field">
                <label htmlFor="from">Od:</label>
                <input
                  id="from"
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="to">Do:</label>
                <input
                  id="to"
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>

              <div className="form-actions">
                <CTA label="Pokaż statystyki" onClick={fetchStats} />
              </div>
            </div>

            {loading && <div className="bp-state">Ładowanie danych…</div>}
            {error && <div className="bp-state error">{error}</div>}

            {!loading && !error && stats.length > 0 && (
              <>
                <div className="table-wrap">
                  <table className="bp-table">
                    <thead>
                      <tr>
                        <th>Grupa krwi</th>
                        <th>Rh</th>
                        <th>Płeć</th>
                        <th>Przedział wiekowy</th>
                        <th>Liczba donacji</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.map((s, i) => (
                        <tr key={i}>
                          <td>{s.bloodGroup}</td>
                          <td>{s.rhFactor}</td>
                          <td>{s.gender}</td>
                          <td>{s.ageBucket}</td>
                          <td>{s.donationsCnt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bp-card" style={{ marginTop: "2rem" }}>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={stats}>
                      <XAxis dataKey="ageBucket" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="donationsCnt"
                        fill="#b71c1c"
                        name="Liczba donacji"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {!loading && !error && stats.length === 0 && (
              <div className="bp-state">Brak danych w tym zakresie dat.</div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
