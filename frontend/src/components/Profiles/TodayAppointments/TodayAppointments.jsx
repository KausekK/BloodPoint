import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import { Bloodtype } from "@mui/icons-material";
import { getAllTodayAppointmentsForBloodPoint } from "../../../services/MakeAppointmentService";
import EditDonationModal from "./EditDonationModal";
import "./TodayAppointments.css";
import authService from "../../../services/AuthenticationService";
import { showMessages, showError, showMessage } from "../../shared/services/MessageService";
import { MessageType } from "../../shared/const/MessageType.model";
import { createDonationFromAppointment } from "../../../services/DonationService";


export default function TodayAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const donationPointId = authService.getPointId();

  const [modalOpen, setModalOpen] = useState(false);
  const [currentAppt, setCurrentAppt] = useState(null);

  useEffect(() => {
    getAllTodayAppointmentsForBloodPoint(donationPointId)
      .then((data) => setAppointments(data))
      .catch((err) => setError(err.message || "Błąd podczas pobierania wizyt"))
      .finally(() => setLoading(false));
  }, [donationPointId]);

  if (loading) return <div className="loading">Ładowanie wizyt na dziś…</div>;
  if (error) return <div className="error">Błąd: {error}</div>;
  if (!appointments.length)
    return <div className="no-data">Brak dzisiejszych wizyt</div>;

  const handleOpenModal = (appt) => {
    setCurrentAppt({
      appointmentId: appt.appointmentId,
      status: "ZREALIZOWANA",
      amountOfBlood: "",
      bloodTypeId: null,
      bloodGroupLabel: appt.bloodGroup,
      existingDonor: !!appt.bloodGroup,
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentAppt(null);
  };

  const handleSave = async (updated) => {
  try {
    const res = await createDonationFromAppointment(currentAppt.appointmentId, {
      bloodTypeId: updated.bloodTypeId,
      donationStatus: updated.donationStatus,
      amountOfBlood: updated.amountOfBlood,
      donationDate: new Date().toISOString(),
      donationType: "KREW_PELNA",
      questionnaireId: null,
    });

    const messages = Array.isArray(res?.messages) ? res.messages : [];

    if (messages.length > 0) {
      showMessages(
        messages.map((m) => ({
          msg: m.msg,
          type: MessageType[m.type] || MessageType.INFO,
        }))
      );
    }

    const hasError = messages.some((m) => m.type === "ERROR");
    if (hasError) {
      return;
    }

    if (messages.length === 0) {
      showMessage("Donacja została zapisana.", MessageType.SUCCESS);
    }

    const refreshed = await getAllTodayAppointmentsForBloodPoint(donationPointId);
    setAppointments(refreshed);

    handleCloseModal();
  } catch (e) {
    console.error("Błąd przy tworzeniu donacji:", e);
    showError("Nie udało się zapisać donacji (błąd połączenia z serwerem).");
  }
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
              <th>Grupa krwi</th>
              <th>Godzina wizyty</th>
              <th>Zrealizuj</th>
            </tr>
          </thead>
          <tbody>
          {appointments.map((a, idx) => {
          const isDone =
          a.appointmentStatus === "ZREALIZOWANA" ||
          a.appointmentStatus === "PRZERWANA";

            return (
              <tr
                key={a.appointmentId}
                className={idx % 2 === 0 ? "" : "striped"}
              >
                <td>{a.appointmentId}</td>
                <td>
                  {a.firstName} {a.lastName}
                </td>
                <td>{a.pesel}</td>
                <td>{a.email}</td>
              
                <td>{a.bloodGroup}</td>
                <td>
                  {new Date(a.appointmentDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>
                  {isDone ? (
                    <span className="done-label">Zakończona</span>
                  ) : (
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleOpenModal(a)}
                    >
                      <Bloodtype />
                    </IconButton>
                  )}
                </td>
              </tr>
            );
          })}

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
