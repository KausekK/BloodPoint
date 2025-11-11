import { api } from "./api";

export function getBloodStock() {
  return api.get("/blood_stock").then(r => r.data);
}
export function getBloodStockByDonationPoint(pointId) {
  return api.get(`/blood_stock/point/${pointId}`).then(r => r.data);
}

export function postDelivery(pointId, payload) {
  return api.post(`/blood_stock/point/${pointId}/deliveries`, payload).then(r => r.data);
}
