import { api } from "./api";

const HOSPITAL_ID = 1;

export function createBloodRequest({bloodTypeId, amount }) {
  return api.post(`/api/hospitals/${HOSPITAL_ID}/requests`, {
    bloodType: bloodTypeId,
    amount
  }).then(r => r.data);
}
