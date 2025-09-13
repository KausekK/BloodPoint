import axios from "axios";

const api = axios.create({
  baseURL: "/api/blood_point",
  timeout: 8000,
});

export function getCities() {
 return api
    .get("/cities")
    .then((r) => r.data);
}

export function getPoints(city){
    const params = city ? { params: { city } } : {};
    return api.get("/points", params).then(r => r.data);
}