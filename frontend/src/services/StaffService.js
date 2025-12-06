import { api } from "./api";


export function getStaffByPoint(pointId) {
    return api.get(`/blood_point/staff/${pointId}`).then((r) => r.data);
}

export function deleteEmployee(userId) {
    return api.delete(`/blood_point/staff/${userId}`).then((r) => r.data);
}

export function updateEmployee(userId, payload) {
    return api.patch(`/blood_point/staff/${userId}`, payload).then((r) => r.data);
}

export function createEmployee(pointId, payload) {
    return api
      .post(`/blood_point/staff/${pointId}`, payload)
      .then((r) => r.data);
  }