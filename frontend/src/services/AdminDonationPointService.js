import { api } from "./api";

export function registerDonationPoint(request) {
  return api.post("/admin/donation-point", request).then((r) => r.data);
}