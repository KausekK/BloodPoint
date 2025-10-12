import axios from "axios";

const api = axios.create({
  baseURL: "/api/blood_stock",
  timeout: 8000,
});

export function getBloodStock() {
  return api
    .get("")
    .then((r) => r.data);
}