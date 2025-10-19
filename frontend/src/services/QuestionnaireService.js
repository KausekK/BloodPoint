import axios from "axios";

const api = axios.create({
  baseURL: "/api/",
  timeout: 8000,
});

export function getQuestions(questionnaireId) {
  return api.get(`/questionnaires/${questionnaireId}/questions`).then(r => r.data);
}

export function submitResponses({ donationId, questionnaireId, answers }) {
  return api.post(`/questionnaires/${questionnaireId}/responses`, { donationId, questionnaireId, answers });
}