import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import DashboardPanel from "../GeneralDashboardPanel";

export default function BloodPointDashboardPanelPage() {
    const actions = [
        { label: "Zarządzaj zapasami krwi", to: "/point/1/stocks" },
        { label: "Przeglądaj statystyki", to: "/forecast" },
        { label: "Sprawdź predykcje", to: "/prognoza" },
    ];

    return (
        <>
            <Header />
            <main className="bp-section" >
                <div className="bp-container">
                    <DashboardPanel
                        title="Witaj w profilu punktu krwiodawstwa"
                        subtitle="Wybierz, co chcesz zrobić."
                        actions={actions}
                        center
                    />
                </div>
            </main>
            <Footer />
        </>
    );
}
