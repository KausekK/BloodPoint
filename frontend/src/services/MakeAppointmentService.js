import { api } from "./api";


export function getSlotsForDayPaged(city, pointId, isoDate, page = 0, size = 12) {
  return api
    .get("/appointment/available", { params: { city, pointId, date: isoDate, page, size } })
    .then((r) => r.data);
}

export function addAppointment(appointment) {
  return api
    .post("/appointment/add", appointment)
    .then((r) => r.data)
    .catch((error) => {
      throw error;
    });
}

export function getAllTodayAppointmentsForBloodPoint(id) {
  return api.get(`/appointment/point/all/${id}`)
    .then((r) => r.data)
    .catch((error) => {
      throw error;
    });
}

export function getAllAppointmentsHistoryForBloodPoint(pointId) {
  return api.get(`/appointment/point/history/${pointId}`).then((r) => r.data);
}