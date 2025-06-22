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
import { getQuestions, submitResponses } from '../../../services/QuestionnaireService';
import './Documents.css';

export default function Documents() {
  const donationId = 101;      // TODO: pobierz to z kontekstu/logiki
  const questionnaireId = 2;   // TODO: albo z questions[0].questionnaireId
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getQuestions(questionnaireId)
      .then(qs => {
        setQuestions(qs);
        const init = {};
        qs.forEach(q => {
          init[q.id] = '';        // dla obu typów trzymamy string: "" / "true" / "false" / dowolny tekst
        });
        setAnswers(init);
      })
      .catch(err => setError(err.message || 'Błąd ładowania pytań'))
      .finally(() => setLoading(false));
  }, [donationId]);

  const handleChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const payload = {
      donationId,
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
          answerFlag: raw === 'true'   // raw to "true" lub "false"
        };
      })
    };

    try {
      await submitResponses(payload);
      alert('Odpowiedzi zapisane pomyślnie!');
    } catch (err) {
      console.error(err);
      alert('Wystąpił błąd przy zapisywaniu odpowiedzi');
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
