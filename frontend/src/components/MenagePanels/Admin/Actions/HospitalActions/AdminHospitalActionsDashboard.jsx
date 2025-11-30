import Header from "../../../../Header/Header";
import Footer from "../../../../Footer/Footer";
import DashboardPanel from "../../../GeneralDashboardPanel"
import "../../../../SharedCSS/MenagePanels.css"

export default function AdminHospitalActionsDashboard() {
  const actions = [
    { label: "Zarejestruj Placówkę Szpitalną", to: "/admin/panel/szpital/rejestracja" },
    { label: "Lista Placówek Szpitalnych", to: "/admin/panel/szpital/lista-placowek" },
  ];

  return (
    <>
      <Header />
      <main className="bp-section">
        <div className="bp-container">
          <DashboardPanel
            title="Zarządzanie Placówkami Szpitalnymi"
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
