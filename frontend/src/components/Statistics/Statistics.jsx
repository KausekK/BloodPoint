import { useEffect, useState } from "react";
import "./Statistics.css";
import Header from "../../components/Header/Header";
import Footer from "../Footer/Footer";
import SectionHeading from "../../components/SectionHeading/SectionHeading";
import CTA from "../CTA/CTA";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getDonationStatistics } from "../../services/StatisticsService";

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
        <div className="statistics-page">
            <Header />
            <div className="statistics-content">
                <SectionHeading>Statystyki donacji</SectionHeading>

                <div className="filters">
                    <label>
                        Od:
                        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                    </label>
                    <label>
                        Do:
                        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                    </label>
                    <CTA label="Pokaż statystyki" onClick={fetchStats} />
                </div>

                {loading && <p>Ładowanie danych...</p>}
                {error && <p className="error">{error}</p>}

                {!loading && stats.length > 0 && (
                    <>
                        <div className="stats-table-wrapper">
                            <table className="stats-table">
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

                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={stats}>
                                    <XAxis dataKey="ageBucket" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="donationsCnt" fill="#c0392b" name="Liczba donacji" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}

                {!loading && !error && stats.length === 0 && (
                    <p>Brak danych w tym zakresie dat.</p>
                )}
            </div>
            <Footer />
        </div>
    );
}