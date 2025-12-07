import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import DashboardPanel from "../GeneralDashboardPanel";
import "../../SharedCSS/MenagePanels.css";
import authService from "../../../services/AuthenticationService";

export default function BloodPointDashboardPanelPage() {

  const isManager = authService.hasRole("MANAGER_PUNKTU_KRWIODAWSTWA");

  const actions = [
    { label: "Zarządzaj zapasami krwi", to: "/punkt-krwiodawstwa/zapasy" },
    { label: "Przeglądaj statystyki", to: "/statystyki" },
    { label: "Sprawdź zgłoszenia szpitali", to: "/zgloszenia" },
    ...(isManager
      ? [{ label: "Zarzadzaj pracownikami", to: "/panel/pracowniczy" }]
      : []),
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
