import React, { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import { Bloodtype } from '@mui/icons-material';
import { getAllTodayAppointmentsForBloodPoint } from "../../../services/MakeAppointmentService";
import EditDonationModal from './EditDonationModal';  
import "./TodayAppointments.css";
import { APPOINTMENT_STATUS } from '../../shared/const/AppointmentStatus';

export default function TodayAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const donationPointId = 1; // TODO: pobierz ID punktu z kontekstu/logowania

  const [modalOpen, setModalOpen] = useState(false);
  const [currentAppt, setCurrentAppt] = useState(null);

  useEffect(() => {
    getAllTodayAppointmentsForBloodPoint(donationPointId)
      .then(data => setAppointments(data))
      .catch(err => setError(err.message || 'Błąd podczas pobierania wizyt'))
      .finally(() => setLoading(false));
  }, [donationPointId]);

  if (loading) return <div className="loading">Ładowanie wizyt na dziś…</div>;
  if (error)   return <div className="error">Błąd: {error}</div>;
  if (!appointments.length) return <div className="no-data">Brak dzisiejszych wizyt</div>;

  const handleOpenModal = appt => {
    setCurrentAppt({
      appointmentId: appt.appointmentId,
      status: APPOINTMENT_STATUS.UMOWIONA,  
      amountOfBlood: '',           
      bloodGroup: appt.bloodGroup  
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentAppt(null);
  };

  const handleSave = updated => {
    console.log('Zapisywanie zmienionych danych:', currentAppt.appointmentId, updated);
    handleCloseModal();
  };

  return (
    <>
      <section className="card today-appointments-card">
        <header className="card-header">
          <h2 className="card-title">Wizyty na dziś</h2>
        </header>
        <table className="today-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Pacjent</th>
              <th>PESEL</th>
              <th>E-mail</th>
              <th>Ostatnia donacja</th>
              <th>Grupa krwi</th>
              <th>Godzina wizyty</th>
              <th>Zrealizuj</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a, idx) => (
              <tr key={a.appointmentId} className={idx % 2 === 0 ? '' : 'striped'}>
                <td>{a.appointmentId}</td>
                <td>{a.firstName} {a.lastName}</td>
                <td>{a.pesel}</td>
                <td>{a.email}</td>
                <td>{new Date(a.lastDonationDate).toLocaleDateString()}</td>
                <td>{a.bloodGroup}</td>
                <td>
                  {new Date(a.appointmentDate)
                    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleOpenModal(a)}
                  >
                    <Bloodtype />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {currentAppt && (
        <EditDonationModal
          open={modalOpen}
          onClose={handleCloseModal}
          donation={currentAppt}
          onSave={handleSave}
        />
      )}
    </>
  );
}
