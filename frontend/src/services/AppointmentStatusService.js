import { api } from "./api";

export function listAppointmentStatuses() {
  return api.get("/appointment-statuses").then((r) => r.data);
}
