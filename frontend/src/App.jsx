import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MakeAppointment from './components/MakeAppointment/MakeAppointment.jsx';
import Home from './components/Home/Home.jsx';
import Profile from './components/Profiles/Profile.jsx';
import ForecastOfBloodDemand from './components/ForecastOfBloodDemand/ForecastOfBloodDemand.jsx';
import InfoPage from './components/Info/InfoPage.jsx';
import DonationPointsPage from './components/DonationPoints/DonationPointsPage.jsx';


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
            </Routes>
        </Router>
    );
}

export default App
