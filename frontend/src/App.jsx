import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MakeAppointment from './components/MakeAppointment/MakeAppointment.jsx';


function App() {
   return (
        <Router>
            <Routes>
                <Route path="/" element={<MakeAppointment />} />
            </Routes>
        </Router>
    );
}

export default App
