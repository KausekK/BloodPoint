import axios from "axios";

const api = axios.create({
    baseURL: "/api/blood_point/staff",
    timeout: 8000,
});

export function getStaffByPoint(pointId) {
    return api.get(`/${pointId}`).then((r) => r.data);
}

export function deleteEmployee(userId) {
    return api.delete(`/${userId}`).then((r) => r.data);
}

export function updateEmployee(userId, payload) {
    return api.patch(`/${userId}`, payload).then((r) => r.data); // EditResult<StaffDTO>
}