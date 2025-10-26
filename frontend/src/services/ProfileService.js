import { api } from "./api";

export function getProfile(id) {
  return api.get(`/user/profile/${id}`).then((r) => r.data);
}

export function getDonations(id, dateFrom, dateTo) {
  return api.post(`/donations/${id}`, { dateFrom, dateTo }).then((r) => r.data);
}

export function getScheduledAppointmentForUser(id) {
  return api.get(`/appointment/${id}`).then((r) => r.data);
}

export function deleteScheduledAppointment(id) {
  return api.delete(`/appointment/${id}`).then((r) => r.data);
}

export function updateProfileContactInfo(data) {
  return api.put(`/user/profile`, data).then((r) => r.data);
}
