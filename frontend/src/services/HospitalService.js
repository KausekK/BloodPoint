import { api } from "./api";


export function getHospitalsProvinces() {
  return api
    .get("/hospital/provinces")
    .then((r) => r.data);
}