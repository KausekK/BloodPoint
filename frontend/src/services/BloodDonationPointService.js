import axios from "axios";

const api = axios.create({
  baseURL: "/api/blood_point",
  timeout: 8000,
});

export function getCities() {
 return api
    .get("/cities")
    .then((r) => r.data);
}