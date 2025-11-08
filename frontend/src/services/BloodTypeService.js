import { api } from "./api";

export function listBloodTypes() {
  return api.get("/blood-types").then(r => r.data);
}


