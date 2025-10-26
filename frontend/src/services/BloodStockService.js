import { api } from "./api";

export function getBloodStock() {
  return api
    .get("/blood_stock")
    .then((r) => r.data);
}
export function getBloodStockByDonationPoint(pointId = 1) {
  // TODO dodac backend logowania
  return api.get(`/blood_stock/point/${pointId}`).then(r => r.data);
}