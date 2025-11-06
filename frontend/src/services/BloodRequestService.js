import { api } from "./api";

const HOSPITAL_ID = 1;

export function createBloodRequest({ bloodTypeId, amount }) {
  return api
    .post(`/request/hospitals/${HOSPITAL_ID}/requests`, { bloodTypeId, amount })
    .then(r => r.data);
}
