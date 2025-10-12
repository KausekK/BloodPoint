import axios from "axios";

const api = axios.create({
  baseURL: "/api/hospital",
  timeout: 8000,
});

export function getHospitalsProvinces() {
  return api
    .get("/provinces")
    .then((r) => r.data);
}