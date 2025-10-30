import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import DashboardPanel from "../GeneralDashboardPanel";
import authService from "../../../services/AuthenticationService";

export default function HospitalDashboardPanelPage() {
  const hospitalId = 1; /* TODO podlaczyc  */
  const actions = [
    { label: "Zgłoś zapotrzebowanie", to: `/szpital/zgloszenie-zapotrzebowania` },
    { label: "Przeglądaj zapasy placówek", to: "/szpital/przegladaj-zapasy" },
  ];

  return (
    <>
      <Header />
      <main className="bp-section">
        <div className="bp-container">
          <DashboardPanel
            title="Witaj w profilu szpiatala"
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
