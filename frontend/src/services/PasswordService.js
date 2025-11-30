import { api } from "./api";

export function changePassword({ currentPassword, newPassword, confirmNewPassword }) {
  return api
    .post("/v1/auth/change-password", {
      currentPassword,
      newPassword,
      confirmNewPassword,
    })
    .then((r) => r.data);
}