import { api } from "./api";

export function getDonationStatistics(from, to) {
    return api
        .get(`/statistic`, {
            params: { from, to },
        })
        .then((r) => r.data);
}

export function getDefaultStatistics() {
    const now = new Date();
    const to = now.toISOString().split("T")[0];
    const fromDate = new Date(now);
    fromDate.setFullYear(fromDate.getFullYear() - 1);
    const from = fromDate.toISOString().split("T")[0];

    return getDonationStatistics(from, to);
}
