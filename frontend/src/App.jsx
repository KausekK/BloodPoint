import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MakeAppointment from './components/MakeAppointment/MakeAppointment.jsx';
import Home from './components/Home/Home.jsx';
import Profile from './components/Profiles/Profile.jsx';
import ForecastOfBloodDemand from './components/ForecastOfBloodDemand/ForecastOfBloodDemand.jsx';



function App() {
   return (
        <Router>
            <Routes>
                <Route path="/appointment" element={<MakeAppointment />} />
                <Route path="/" element={<Home />} />
                <Route path="/profile/*" element={<Profile />} />
                <Route path="/forecast" element={<ForecastOfBloodDemand />} />
            </Routes>
        </Router>
    );
}

export default App
