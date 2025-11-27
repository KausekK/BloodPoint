import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';
import { getQuestions, submitResponses, getQuestionnaireIdByTitle, hasQuestionnaireForAppointment } from '../../../services/QuestionnaireService';
import './Documents.css';
import { showMessage, showError } from "../../shared/services/MessageService";
import { getScheduledAppointmentForUser } from '../../../services/ProfileService';
import authService from '../../../services/AuthenticationService';

export default function Documents() {
  const userId = authService.getUserId();

  const [appointmentId, setAppointmentId] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questionnaireId, setQuestionnaireId] = useState(null);
  const [submitted, setSubmitted] = useState(false);


  useEffect(() => {
    let active = true;
    if (!userId) return;
    (async () => {
      try {
        const scheduled = await getScheduledAppointmentForUser(userId);
        if (!active) return;
        const id = scheduled?.appointmentId ?? scheduled?.id ?? scheduled ?? null;
        setAppointmentId(id);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      active = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!appointmentId) {
      setQuestions([]);
      setAnswers({});
      setLoading(false);
      return;
    }
      let active = true;
      setLoading(true);
      setError(null);

      const resolveAndLoad = async () => {
        try {
          const alreadyFilled = await hasQuestionnaireForAppointment(appointmentId);
          if (!active) return;

          if (alreadyFilled) {
            setSubmitted(true);
            setQuestions([]);
            setAnswers({});
            setLoading(false);
            return;
          }

          const res = await getQuestionnaireIdByTitle("Kwestionariusz dla krwiodawców");
          if (!active) return;
          const resolvedId = Number(res);
          if (!Number.isFinite(resolvedId)) {
            setError("Nie znaleziono kwestionariusza dla krwiodawców (niepoprawny identyfikator)");
            setQuestions([]);
            setAnswers({});
            setLoading(false);
            return;
          }
          setQuestionnaireId(resolvedId);

          const qs = await getQuestions(resolvedId);
          if (!active) return;
          setQuestions(qs || []);
          const init = {};
          (qs || []).forEach((q) => {
            init[q.id] = "";
          });
          setAnswers(init);
        } catch (err) {
          console.error(err);
          if (!active) return;
          setError(err?.message || "Błąd ładowania pytań");
          setQuestions([]);
          setAnswers({});
        } finally {
          if (active) setLoading(false);
        }
      };

      resolveAndLoad();
    }, [appointmentId]);

  const handleChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
  
    const payload = {
      appointmentId,
      questionnaireId,
      answers: questions.map(q => {
        const raw = answers[q.id] ?? '';
        if (q.type === 'TEXT') {
          return {
            questionId: q.id,
            answerText: raw,
            answerFlag: null
          };
        }
        return {
          questionId: q.id,
          answerText: null,
          answerFlag: raw === 'true'
        };
      })
    };
  
    try {
      await submitResponses(questionnaireId, appointmentId, payload);
      showMessage('Odpowiedzi zapisane pomyślnie', 'success');
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      showError('Wystąpił błąd przy zapisywaniu odpowiedzi');
    }
  };
  

  const isFormValid = questions.length > 0 && questions.every(q => {
    const val = answers[q.id];
    if (q.type === 'TEXT') {
      return typeof val === 'string' && val.trim() !== '';
    }
    return val === 'true' || val === 'false';
  });

  if (loading) return <div className="loading">Ładowanie dokumentów...</div>;
  if (error) return <div className="error">Błąd: {error}</div>;
  if (!appointmentId) return <div className="no-data">Brak formularzu do wypełnienia</div>;

  if (submitted) {
    return (
      <section className="card documents-card">
        <header className="card-header">
          <h2 className="card-title">Dokumenty / Kwestionariusz</h2>
        </header>
        <div className="no-data">
          Kwestionariusz dla tej wizyty został już wypełniony.
        </div>
      </section>
    );
  }

  if (!questions.length) return <div className="no-data">Brak dokumentów</div>;

  return (
    <section className="card documents-card">
      <header className="card-header">
        <h2 className="card-title">Dokumenty / Kwestionariusz</h2>
      </header>
      <form onSubmit={handleSubmit} className="documents-grid">
        {questions.map(q => (
          <Box key={q.id} className="doc-item">
            <Typography variant="subtitle2" className="doc-question">
              {q.orderIndex}. {q.text}
            </Typography>

            {q.type === 'TEXT' ? (
              <TextField
                fullWidth
                multiline
                minRows={3}
                length={4000}
                variant="outlined"
                size="small"
                value={answers[q.id]}
                onChange={e => handleChange(q.id, e.target.value)}
              />
            ) : (
              <FormControl component="fieldset" size="small">
                <FormLabel component="legend" className="doc-radio-label">
                  Wybierz odpowiedź
                </FormLabel>
                <RadioGroup
                  row
                  value={answers[q.id]}
                  onChange={e => handleChange(q.id, e.target.value)}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio size="small" />}
                    label="Tak"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio size="small" />}
                    label="Nie"
                  />
                </RadioGroup>
              </FormControl>
            )}
          </Box>
        ))}

        <Box className="doc-actions">
          <Button
            type="submit"
            variant="contained"
            color="error"
            disabled={!isFormValid}
          >
            Zapisz odpowiedzi
          </Button>
        </Box>
      </form>
    </section>
  );
}
