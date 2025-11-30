import { api } from "./api";

export function registerHospital(request) {
  return api.post("/admin/hospital", request).then((r) => r.data);
}
