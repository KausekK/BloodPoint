import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MakeAppointment from './components/MakeAppointment/MakeAppointment.jsx';
import Home from './components/Home/Home.jsx';
import Profile from './components/Profiles/Profile.jsx';
import ForecastOfBloodDemand from './components/ForecastOfBloodDemand/ForecastOfBloodDemand.jsx';
import InfoPage from './components/Info/InfoPage.jsx';
import DonationPointsPage from './components/DonationPoints/DonationPointsPage.jsx';
import DonorInfoPage from  './components/DonorInfo/DonorInfoPage.jsx';
import DonorTipsPage from './components/DonorInfo/DonorTipsPage.jsx';
import PointStaffPage from './components/Staff/PointStaffPage.jsx';
import LoginInfoPage from './components/LoginInfo/LoginInfoPage.jsx'


function App() {
   return (
        <Router>
            <Routes>
                <Route path="/appointment" element={<MakeAppointment />} />
                <Route path="/" element={<Home />} />
                <Route path="/profile/*" element={<Profile />} />
                <Route path="/forecast" element={<ForecastOfBloodDemand />} />
                <Route path="/informacje" element={<InfoPage />} />
                <Route path="/punkty-krwiodawstwa" element={<DonationPointsPage />} />
                <Route path="/krwiodawca" element={<DonorInfoPage />} />
                <Route path="/dla-dawcy" element={<DonorTipsPage />} />
                <Route path="/panel/staff" element={<PointStaffPage />} />
                <Route path="/login-info" element={<LoginInfoPage />} />
            </Routes>
        </Router>
    );
}

export default App
