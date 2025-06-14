import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 8000,
});

export function getSlotsForDayPaged(city, isoDate, page = 0, size = 12) {
 return api
    .get("/slots/available", { params: { city, date: isoDate, page, size } })
    .then((r) => r.data);
}
