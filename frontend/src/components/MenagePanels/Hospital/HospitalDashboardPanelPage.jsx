import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import DashboardPanel from "../GeneralDashboardPanel";
import "../../SharedCSS/MenagePanels.css"

export default function HospitalDashboardPanelPage() {
  const hospitalId = 1; // TODO: podłączyć do authService
  const actions = [
    { label: "Zgłoś zapotrzebowanie", to: `/szpital/zgloszenie-zapotrzebowania` },
    { label: "Przeglądaj historię zgłoszeń", to: "/szpital/historia-zgloszen" },
  ];

  return (
    <>
      <Header />
      <main className="bp-section">
        <div className="bp-container">
          <DashboardPanel
            title="Witaj w profilu szpitala"
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
