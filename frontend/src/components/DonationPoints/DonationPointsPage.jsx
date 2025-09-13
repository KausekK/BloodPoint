import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../Footer/Footer";
import { getPoints } from "../../services/BloodDonationPointService";

export default function DonationPointsPage() {
    const [points, setPoints] = useState([]);

    useEffect(() => {
        getPoints().then(setPoints).catch(console.error);
    }, []);

    return (
        <>
            <Header />
            <main style={{maxWidth: "1000px", margin: "40px auto", padding: "0 16px"}}>
                <h1>Lista punktów krwiodawstwa</h1>
                <table style={{width: "100%", borderCollapse: "collapse"}}>
                    <thead>
                    <tr>
                        <th>Miasto</th>
                        <th>Ulica</th>
                        <th>Kod pocztowy</th>
                        <th>Godziny</th>
                        <th>Telefon</th>
                    </tr>
                    </thead>
                    <tbody>
                    {points.map(p => (
                        <tr key={p.id}>
                            <td>{p.city}</td>
                            <td>{p.street}</td>
                            <td>{p.zipCode}</td>
                            <td>{p.openHour} - {p.closeHour}</td>
                            <td>{p.phone}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </main>
            <Footer />
        </>
    );
}
