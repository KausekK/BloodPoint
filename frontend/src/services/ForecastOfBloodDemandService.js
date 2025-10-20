import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 8000,
});


export async function getForecastOfBloodDemand(bloodType, province) {
  const response = await api.get("/series", {
    params: {
      blood_type: bloodType,
      province: province,
    },
  });
  return response.data;
}
