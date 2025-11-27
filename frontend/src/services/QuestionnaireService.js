import { api } from "./api";

export function getQuestions(questionnaireId) {
  return api.get(`/questionnaires/${questionnaireId}/questions`).then(r => r.data);
}

// export function submitResponses({ donationId, questionnaireId, answers }) {
//   return api.post(`/questionnaires/${questionnaireId}/responses`, { donationId, questionnaireId, answers });
// }

export async function submitResponses(questionnaireId, appointmentId, payload) {
  return api.post(
    `/questionnaires/${questionnaireId}/appointments/${appointmentId}/responses`,
    payload
  );
}


export function getQuestionnaireIdByTitle(title) {
  return api.get(`/questionnaires/id`, { params: { title } }).then((r) => r.data);
}

export function hasQuestionnaireForAppointment(appointmentId) {
  return api
    .get(`/questionnaires/appointments/${appointmentId}/responses/status`)
    .then(r => r.data);
}
