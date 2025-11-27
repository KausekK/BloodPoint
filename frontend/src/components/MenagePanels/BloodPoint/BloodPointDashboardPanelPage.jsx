import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import DashboardPanel from "../GeneralDashboardPanel";
import authService from "../../../services/AuthenticationService";
import "../../SharedCSS/MenagePanels.css";

export default function BloodPointDashboardPanelPage() {
  const actions = [
    { label: "Zarządzaj zapasami krwi", to: `/punkt-krwiodawstwa/zapasy` },
    { label: "Przeglądaj statystyki", to: "/statystyki" },
    { label: "Sprawdź zgłoszenia szpitali", to: "/zgloszenia" },
    { label: "Zarzadzaj pracownikami", to: "/panel/pracowniczy" },
  ];

  return (
    <>
      <Header />
      <main className="bp-section">
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
