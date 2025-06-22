import { Button } from "@mui/material";
import Detail from "./Detail";

export default function ScheduledAppointment({ appointment, onCancel }) {
  return (
    <section className="scheduled-appointment">
      <h2 className="card-title">Zaplanowana wizyta</h2>
      <Button
        variant="contained"
        color="error"
        onClick={() => onCancel(appointment.appointmentId)}
      >
        Odwołaj wizytę
      </Button>
      <div className="details-grid">
        <Detail
          label="Data"
          value={new Date(appointment.appointmentTime).toLocaleString()}
        />
        <Detail
          label="Adres"
          value={`${appointment.appointmentCity}, ${appointment.appointmentStreet}`}
        />
      </div>
    </section>
  );
}
