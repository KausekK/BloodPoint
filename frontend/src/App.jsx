
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MakeAppointment from './components/MakeAppointment/MakeAppointment.jsx';
import Home from './components/Home/Home.jsx';
import Profile from './components/Profiles/Profile.jsx';
import ForecastOfBloodDemand from './components/ForecastOfBloodDemand/ForecastOfBloodDemand.jsx';
import DonationPointsPage from './components/DonationPoints/DonationPointsPage.jsx';
import DonorInfoPage from './components/DonorInfo/DonorInfoPage.jsx';
import DonorTipsPage from './components/DonorInfo/DonorTipsPage.jsx';
import PointStaffPage from './components/MenagePanels/BloodPoint/Actions/Staff/PointStaffPage.jsx';
import LoginInfoPage from './components/LoginInfo/LoginInfoPage.jsx'
import DonorLoginPage from './components/LoginForms/Donor/DonorLoginPage.jsx'
import HospitalLoginPage from './components/LoginForms/Hospital/HospitalLoginPage.jsx';
import BloodPointLoginPage from './components/LoginForms/BloodPoint/BloodPointLoginPage.jsx';
import BloodPointDashboardPanelPage from './components/MenagePanels/BloodPoint/BloodPointDashboardPanelPage.jsx';
import BloodStockManagePage from './components/MenagePanels/BloodPoint/Actions/Stock/BloodStockManagePage.jsx';
import HospitalDashboardPanelPage from './components/MenagePanels/Hospital/Actions/HospitalDashboardPanelPage.jsx'
import Statistics from './components/MenagePanels/BloodPoint/Actions/Statistics/Statistics.jsx'
import ReportEmergencyPage from './components/MenagePanels/Hospital/Actions/ReportEmergencyPage.jsx'
import EmergencyRequestsPage from './components/MenagePanels/BloodPoint/Actions/EmergencyRequests/EmergencyRequestsPage.jsx';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/rezerwacja" element={<MakeAppointment />} />
                <Route path="/" element={<Home />} />
                <Route path="/profil/*" element={<Profile />} />
                <Route path="/prognoza" element={<ForecastOfBloodDemand />} />
                <Route path="/punkty-krwiodawstwa" element={<DonationPointsPage />} />
                <Route path="/krwiodawca" element={<DonorInfoPage />} />
                <Route path="/dla-dawcy" element={<DonorTipsPage />} />
                <Route path="/panel/pracownicy" element={<PointStaffPage />} />
                <Route path="/login-info" element={<LoginInfoPage />} />
                <Route path="/login/dawca" element={<DonorLoginPage />} />
                <Route path="/login/szpital" element={<HospitalLoginPage />} />
                <Route path="/login/punkt-krwiodawstwa" element={<BloodPointLoginPage />} />
                <Route path="/punkt-krwiodawstwa/dashboard" element={<BloodPointDashboardPanelPage />} />
                <Route path="/punkt-krwiodawstwa/:pointId/zapasy" element={<BloodStockManagePage />} />
                <Route path="/szpital/dashboard" element={<HospitalDashboardPanelPage />} />
                <Route path="/statystyki" element={<Statistics/>}/>
                <Route path="/szpital/zgloszenie-zapotrzebowania" element={<ReportEmergencyPage/>}/>
                <Route path="/zgloszenia" element={<EmergencyRequestsPage/>}/>
            </Routes>
        </Router>
    );
}


export default App
