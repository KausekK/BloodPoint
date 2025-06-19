import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MakeAppointment from './components/MakeAppointment/MakeAppointment.jsx';
import Home from './components/Home/Home.jsx';
import Profile from './components/Profiles/Profile.jsx';

function App() {
   return (
        <Router>
            <Routes>
                <Route path="/" element={<MakeAppointment />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router>
    );
}

export default App
