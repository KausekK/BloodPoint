import { api } from "./api";

export function getCities() {
  return api.get("/blood_point/cities").then((r) => r.data);
}

export function getPoints(city) {
  const params = city ? { params: { city } } : {};
  return api.get("/blood_point/points", params).then(r => r.data);
}