import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import DashboardPanel from "../GeneralDashboardPanel";
import authService from "../../../services/AuthenticationService";

export default function BloodPointDashboardPanelPage() {
  const pointId = authService.getPointId();
  const actions = [
    { label: "Zarządzaj zapasami krwi", to: `/punkt-krwiodawstwa/${pointId}/zapasy` },
    { label: "Przeglądaj statystyki", to: "/statystyki" },
    { label: "Sprawdź predykcje", to: "/prognoza" },
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
