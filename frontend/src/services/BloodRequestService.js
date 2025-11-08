import { api } from "./api";

const HOSPITAL_ID = 1;

export function createBloodRequest({ bloodTypeId, amount }) {
  return api
    .post(`/request/hospitals/${HOSPITAL_ID}/requests`, { bloodTypeId, amount })
    .then(r => r.data);
}

export function getAllNewBloodRequests() {
  return api.get("/request/new").then(r => r.data);
}

export function acceptBloodRequest(requestId, pointId) {
  return api.post(`/request/${requestId}/accept`, null, { params: { pointId } });
}

export function getHospitalRequests(hospitalId) {
  return api
    .get("/request/${hospitalId}/requests", { params: { hospitalId } })
    .then((r) => r.data);
}
