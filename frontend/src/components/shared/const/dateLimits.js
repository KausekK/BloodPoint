export const EARLIEST_BIRTH_DATE = "1910-01-01";

export function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}