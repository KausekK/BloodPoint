import { api } from "./api";


export function getHospitalsProvinces() {
  return api
    .get("/hospital/provinces")
    .then((r) => r.data);
}

export function getHospitalsList() {
  return api
    .get("/hospital/admin/list")
    .then((r) => r.data);
}
