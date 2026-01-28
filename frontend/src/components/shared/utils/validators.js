import { EARLIEST_BIRTH_DATE, getTodayDate } from "../const/dateLimits";

export const validators = {
  required: (v) => v && v.toString().trim().length > 0,

  email: (v) => /\S+@\S+\.\S+/.test(v),

  pesel: (v) => /^\d{11}$/.test(v),

  phone: (v) => /^\d{9}$/.test((v || "").replace(/\s+/g, "")),

  zip: (v) => /^\d{2}-\d{3}$/.test(v),

  gender: (v) => v === "K" || v === "M",

  latitude: (v) => {
    const n = Number(v);
    return !isNaN(n) && n >= -90 && n <= 90;
  },

  longitude: (v) => {
    const n = Number(v);
    return !isNaN(n) && n >= -180 && n <= 180;
  },
  birthDate: (v) => {
    if (!v) return "REQUIRED";

    const birth = new Date(v);
    const earliest = new Date(EARLIEST_BIRTH_DATE);
    const today = new Date(getTodayDate());
    const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    if (birth > today) return "FUTURE_DATE";
    if (birth < earliest) return "TOO_OLD";
    if (birth > minAgeDate) return "TOO_YOUNG";

    return true;
  },
};

