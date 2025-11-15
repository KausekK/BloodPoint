import { api } from "./api";

export function getProfile(id) {
  return api.get(`/user/profile/${id}`).then((r) => r.data);
}

export function updateUserProfileContactInfo({ id, email, phone }) {
  return api
    .put("/user/profile", { id, email, phone })
    .then((r) => r.data);
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

export function getPointProfile(pointId) {
  return api.get(`/blood_point/profile/${pointId}`).then(r => r.data);
}

export function getHospitalProfile(hospitalId) {
  return api.get(`/hospital/profile/${hospitalId}`).then(r => r.data);
}