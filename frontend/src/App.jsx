
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MakeAppointment from './components/MakeAppointment/MakeAppointment.jsx';
import Home from './components/Home/Home.jsx';
import Profile from './components/Profiles/Profile.jsx';
import DonationPointsPage from './components/DonationPoints/DonationPointsPage.jsx';
import DonorInfoPage from './components/DonorInfo/DonorInfoPage.jsx';
import DonorTipsPage from './components/DonorInfo/DonorTipsPage.jsx';
import PointStaffPage from './components/MenagePanels/BloodPoint/Actions/Staff/PointStaffPage.jsx';
import ProtectedRoute from './components/shared/ProtectedRoute.jsx';
import BloodPointDashboardPanelPage from './components/MenagePanels/BloodPoint/BloodPointDashboardPanelPage.jsx';
import BloodStockManagePage from './components/MenagePanels/BloodPoint/Actions/Stock/BloodStockManagePage.jsx';
import HospitalDashboardPanelPage from './components/MenagePanels/Hospital/HospitalDashboardPanelPage.jsx'
import Statistics from './components/MenagePanels/BloodPoint/Actions/Statistics/Statistics.jsx'
import ReportEmergencyPage from './components/MenagePanels/Hospital/Actions/ReportEmergencyPage.jsx'
import EmergencyRequestsPage from './components/MenagePanels/BloodPoint/Actions/EmergencyRequests/EmergencyRequestsPage.jsx';
import ReportHistoryPage from './components/MenagePanels/Hospital/Actions/ReportHistoryPage.jsx';
import LoginPage from './components/LoginForms/LoginPage.jsx';
import AdminDashboardPanelPage from './components/MenagePanels/Admin/AdminDashboardPanelPage.jsx';
import AdminHospitalActionsDashboard from './components/MenagePanels/Admin/Actions/HospitalActions/AdminHospitalActionsDashboard.jsx';
import HospitalRegister from './components/MenagePanels/Admin/Actions/HospitalActions/Hospitalregister.jsx';
import HospitalList from './components/MenagePanels/Admin/Actions/HospitalActions/HospitalList.jsx';
import AdminBloodPointActionsDashboard from './components/MenagePanels/Admin/Actions/BloodPointActions/AdminBloodPointActionsDashboard.jsx'
import BloodPointRegister from './components/MenagePanels/Admin/Actions/BloodPointActions/BloodPointRegister.jsx';
import BloodPointList from './components/MenagePanels/Admin/Actions/BloodPointActions/BloodPointList.jsx';


function App() {
    return (
        <Router>
            <Routes>
                
                <Route path="/rezerwacja" element={
                    <ProtectedRoute allowedRoles={["DAWCA"]}>
                        <MakeAppointment />
                    </ProtectedRoute>
                } />
                <Route path="/" element={<Home />} />
                <Route path="/profil/*" element={ 
                    <ProtectedRoute allowedRoles={["DAWCA", "SZPITAL", "PUNKT_KRWIODAWSTWA"]}>
                        <Profile />
                    </ProtectedRoute>
                } />

                <Route path="/punkty-krwiodawstwa" element={<DonationPointsPage />} />
                <Route path="/krwiodawca" element={<DonorInfoPage />} />
                <Route path="/dla-dawcy" element={<DonorTipsPage />} />
                <Route path="/panel/pracowniczy" element={
                    <ProtectedRoute allowedRoles={["PUNKT_KRWIODAWSTWA"]}>
                        <PointStaffPage />
                    </ProtectedRoute>
                } />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/punkt-krwiodawstwa/dashboard" element={<BloodPointDashboardPanelPage />} />
                <Route path="/punkt-krwiodawstwa/zapasy" element={<BloodStockManagePage />} />
                <Route path="/szpital/dashboard" element={<HospitalDashboardPanelPage />} />
                <Route path="/statystyki" element={
                    <ProtectedRoute allowedRoles={["PUNKT_KRWIODAWSTWA"]}>
                        <Statistics/>
                    </ProtectedRoute>
                    }/>
                <Route path="/szpital/zgloszenie-zapotrzebowania" element={<ReportEmergencyPage/>}/>
                <Route path="/zgloszenia" element={<EmergencyRequestsPage/>}/>
                <Route path="/szpital/historia-zgloszen" element={<ReportHistoryPage/>}/>

                <Route path="/admin/dashboard" element={<AdminDashboardPanelPage />} />
                <Route path="/admin/panel/szpital" element={<AdminHospitalActionsDashboard />} />
                <Route path="/admin/panel/szpital/rejestracja" element={<HospitalRegister/>} />
                <Route path="/admin/panel/szpital/lista-placowek" element={<HospitalList/>} />

                <Route path="/admin/panel/punkt-krwiodawstwa" element={<AdminBloodPointActionsDashboard/>} />
                <Route path="/admin/panel/punkt-krwiodawstwa/rejestracja" element={<BloodPointRegister/>} />
                <Route path="/admin/panel/punkt-krwiodawstwa/lista-placowek" element={<BloodPointList/>} />
            </Routes>
        </Router>
    );
}


export default App
