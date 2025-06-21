import axios from "axios";

const api = axios.create({
  baseURL: "/api/",
  timeout: 8000,
});

export function getQuestions(questionnarieId) {
  return api.get(`questionnaire/${questionnarieId}/questions`).then(r => r.data);
}

export function submitResponses({ donationId, questionnaireId, answers }) {
  return api.post('/questionnaire-response', {donationId,questionnaireId,answers});
}