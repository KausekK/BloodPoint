import axios from "axios";

const api = axios.create({
  baseURL: "/api/appointment",
  timeout: 8000,
});

export function getSlotsForDayPaged(city, isoDate, page = 0, size = 12) {
 return api
    .get("/available", { params: { city, date: isoDate, page, size } })
    .then((r) => r.data);
}



export function addAppointment(appointment) {
  return api
    .post("/add", appointment)
    .then((r) => r.data)
    .catch((error) => {
      console.error("Error creating appointment:", error);
      throw error;
    });
}
