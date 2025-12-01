import Header from "../../../../Header/Header";
import Footer from "../../../../Footer/Footer";
import DashboardPanel from "../../../GeneralDashboardPanel"
import "../../../../SharedCSS/MenagePanels.css"

export default function AdminBloodPointActionsDashboard() {
  const actions = [
    { label: "Zarejestruj Punkt Kwiodawstwa", to: "/admin/panel/punkt-krwiodawstwa/rejestracja" },
    { label: "Lista Punktów Krwiodawstwa", to: "/admin/panel/punkt-krwiodawstwa/lista-placowek" },
  ];

  return (
    <>
      <Header />
      <main className="bp-section">
        <div className="bp-container">
          <DashboardPanel
            title="Zarządzanie Punktami Krwiodawstwa"
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
