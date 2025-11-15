import { api } from "./api";

export function createDonationFromAppointment(appointmentId, payload) {
    return api
      .post(`/donations/appointments/${appointmentId}`, payload)
      .then((r) => r.data);
  }
