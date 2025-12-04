import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import DashboardPanel from "../GeneralDashboardPanel";
import "../../SharedCSS/MenagePanels.css";

export default function AdminDashboardPanelPage() {
  const actions = [
    { label: "Zarządzaj Placówkami Szpitalnymi", to: "/admin/panel/szpital" },
    { label: "Zarządzaj Punktami Krwiodawstwa", to: "/admin/panel/punkt-krwiodawstwa" },
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
            backTo="/"
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
