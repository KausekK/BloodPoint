import { api } from "./api";

export function listDonationStatuses() {
  return api.get("/donation-statuses").then((r) => r.data);
}
