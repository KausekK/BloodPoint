import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import DashboardPanel from "../GeneralDashboardPanel";
import "../../SharedCSS/MenagePanels.css";

export default function AdminDashboardPanelPage() {
  const actions = [
    { label: "Zarządzaj szpitalami", to: "/panel/szpital" },
    { label: "Zarządzaj punktami krwiodawstwa", to: "/panel/punkty-krwiodstwa" },
    { label: "Zarządzaj dawcami", to: "/panel/dawcy" },
    // { label: "Przeglądaj statystyki", to: "/statystyki" },
  ];

  return (
    <>
      <Header />
      <main className="bp-section">
        <div className="bp-container">
          <DashboardPanel
            title="Witaj w panelu admina"
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
