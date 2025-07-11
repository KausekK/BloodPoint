import axios from "axios";

const api = axios.create({
  baseURL: "/api/donations",
  timeout: 8000,
});

export function getProfile(id) {
 return axios.get(`/api/user/profile/${id}`).then((r) => r.data);
}

export function getDonations(id, dateFrom, dateTo) {
 return api.post(`/${id}`, {dateFrom,dateTo}).then((r) => r.data);
}
export function getScheduledAppointmentForUser(id) {
  return axios.get(`/api/appointment/${id}`).then((r) => r.data);
}

export function deleteScheduledAppointment(id) {
  return axios.delete(`/api/appointment/${id}`).then((r) => r.data);
}

export function updateProfileContactInfo(data) {//TODO podlaczyc do edycji
  return axios.put(`/api/user/profile`, data).then((r) => r.data);
}