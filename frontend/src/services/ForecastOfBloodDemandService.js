import { api8081 } from "./api";



export async function getForecastOfBloodDemand(bloodType, province) {
  const response = await api8081.get("/series", {
    params: {
      blood_type: bloodType,
      province: province,
    },
  });
  return response.data;
}
