import React, { useState } from "react";
import { Button } from "@mui/material";
import Detail from "./Detail";
import ConfirmModal from "../shared/modal/ConfirmModal";


export default function ScheduledAppointment({ appointment, onCancel }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <section className="scheduled-appointment">
      <Button
        variant="contained"
        color="error"
        onClick={() => setConfirmOpen(true)}
      >
        Odwołaj wizytę
      </Button>

      <ConfirmModal
        open={confirmOpen}
        title="Potwierdzenie"
        description="Czy na pewno chcesz odwołać wizytę?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          onCancel(appointment.appointmentId);
          setConfirmOpen(false);
        }}
      />
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