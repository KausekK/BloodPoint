import { api } from "./api";

export function getProfile(id) {
  return api.get(`/user/profile/${id}`).then((r) => r.data);
}

export function updateUserProfileContactInfo({ id, email, phone }) {
  return api
    .put("/user/profile", { id, email, phone })
    .then((r) => r.data);
}

export function getDonations(userId, dateFrom, dateTo) {
  const params = {};

  if (dateFrom) {
    params.dateFrom = dateFrom.slice(0, 10);
  }
  if (dateTo) {
    params.dateTo = dateTo.slice(0, 10);
  }

  return api
    .get(`/donations/users/${userId}`, { params })
    .then((r) => r.data);
}

export function getScheduledAppointmentForUser(userId) {
  return api.get(`/appointment/${userId}`).then((r) => r.data);
}

export function deleteScheduledAppointment(userId) {
  return api.delete(`/appointment/${userId}`).then((r) => r.data);
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