import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import DashboardPanel from "../GeneralDashboardPanel";
import "../../SharedCSS/MenagePanels.css";

export default function DonorDashboardPanelPage() {
  const actions = [
    { label: "Zarezerwuj wizytę", to: "/rezerwacja" },
  ];

  return (
    <>
      <Header />
      <main className="bp-section">
        <div className="bp-container">
          <DashboardPanel
            title="Witaj w panelu dawcy krwi"
            subtitle="Wybierz jedną z dostępnych opcji."
            actions={actions}
            center
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
