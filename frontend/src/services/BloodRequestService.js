import { api } from "./api";



export function createBloodRequest(hospitalId, { bloodTypeId, amount }) {
  return api
    .post(`/requests/hospitals/${hospitalId}`, { bloodTypeId, amount })
    .then((r) => r.data);
}

export function getAllNewBloodRequests() {
  return api.get("/requests/new").then(r => r.data);
}

export function acceptBloodRequest(requestId, pointId) {
  return api.post(`/requests/${requestId}/accept`, null, { params: { pointId } });
}

export function getHospitalRequests(hospitalId) {
  return api
    .get(`/requests`, { params: { hospitalId } })
    .then((r) => r.data);
}
