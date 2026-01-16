import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Divider
} from '@mui/material';
import { Bloodtype, Close } from '@mui/icons-material';
import { listBloodTypes } from '../../../services/BloodTypeService';
import { listDonationStatuses } from '../../../services/DonationStatusService';
import { getQuestionnaireResponses } from '../../../services/QuestionnaireService';
import { DONATION_STATUS_LABELS } from "../../../constants/statusLabels";


export default function EditDonationModal({
  open,
  onClose,
  donation = {},
  onSave
}) {
  const [status, setStatus] = useState(donation.status || '');
  const [amount, setAmount] = useState(
    donation.amountOfBlood != null ? String(donation.amountOfBlood) : ''
  );
  const [bloodTypeId, setBloodTypeId] = useState(
    donation.bloodTypeId != null ? String(donation.bloodTypeId) : ''
  );

  const [bloodTypes, setBloodTypes] = useState([]);
  const [loadingBloodTypes, setLoadingBloodTypes] = useState(false);
  const [bloodTypesError, setBloodTypesError] = useState('');

  const [statusOptions, setStatusOptions] = useState([]);
  const [loadingStatuses, setLoadingStatuses] = useState(false);
  const [statusesError, setStatusesError] = useState('');
  const [lockBloodType, setLockBloodType] = useState(false);


  const [questionnaire, setQuestionnaire] = useState(null);
  const [questionnaireError, setQuestionnaireError] = useState('');
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);


  const appointmentId = donation.appointmentId;

  useEffect(() => {
    setStatus(donation.status || '');
    setAmount(
      donation.amountOfBlood != null ? String(donation.amountOfBlood) : ''
    );
    setBloodTypeId(
      donation.bloodTypeId != null ? String(donation.bloodTypeId) : ''
    );
    setLockBloodType(!!donation.existingDonor);
  }, [donation]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        setLoadingBloodTypes(true);
        setBloodTypesError('');
        const bts = await listBloodTypes();
        const arr = Array.isArray(bts) ? bts : [];
        setBloodTypes(arr);

        if (donation.existingDonor && donation.bloodGroupLabel && !donation.bloodTypeId) {
          const match = arr.find((bt) => bt.label === donation.bloodGroupLabel);
          if (match) {
            setBloodTypeId(String(match.id));
            setLockBloodType(true);
          }
        }

      } catch (e) {
        setBloodTypes([]);
        setBloodTypesError('Nie udało się pobrać listy grup krwi.');
      } finally {
        setLoadingBloodTypes(false);
      }
    })();
  }, [open, donation.existingDonor, donation.bloodGroupLabel, donation.bloodTypeId]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        setLoadingStatuses(true);
        setStatusesError('');
        const statuses = await listDonationStatuses();
        const opts = (Array.isArray(statuses) ? statuses : []).map((s) => ({
          value: s,
          label: DONATION_STATUS_LABELS[s] || s,
        }));
        setStatusOptions(opts);
      } catch (e) {
        setStatusOptions([]);
        setStatusesError('Nie udało się pobrać listy statusów.');
      } finally {
        setLoadingStatuses(false);
      }
    })();
  }, [open]);

  useEffect(() => {
    if (!open || !appointmentId) {
      if (!open) {
        setQuestionnaire(null);
        setQuestionnaireError('');
        setShowQuestionnaire(false);
      }
      return;
    }

    (async () => {
      try {
        setQuestionnaireError('');
        const data = await getQuestionnaireResponses(appointmentId);
        setQuestionnaire(data);
      } catch (e) {
        setQuestionnaire(null);
        setQuestionnaireError('Nie udało się pobrać odpowiedzi z kwestionariusza. Uytkownik go jeszcze nie uzupełnił.');
      }
    })();
  }, [open, appointmentId]);

  const parsedAmount = (() => {
    const isInterrupted = status === 'PRZERWANA';
  
    if (!amount && isInterrupted) {
      return 0;
    }

    if (!amount && amount !== 0) return NaN;
    const normalized = String(amount).replace(',', '.');
    return parseFloat(normalized);
  })();
  
  const isFirstDonation = !donation.existingDonor;
  const isInterrupted = status === 'PRZERWANA';
  
const canSave =
  status &&
  !bloodTypesError &&
  !statusesError &&
  (
    isInterrupted ||
    (Number.isFinite(parsedAmount) && parsedAmount > 0)
  ) &&
  (
    isFirstDonation ? !!bloodTypeId : true
  );

  const handleSave = () => {
    const isInterrupted = status === 'PRZERWANA';
  
    const payload = {
      donationStatus: status,
      amountOfBlood: isInterrupted ? 0 : parsedAmount,
    };
  
    if (!donation.existingDonor) {
      payload.bloodTypeId = Number(bloodTypeId);
    }
  
    onSave(payload);
  };
  
  

  const statusDisabled = loadingStatuses || !!statusesError;
  const bloodGroupDisabled =
    loadingBloodTypes || !!bloodTypesError || lockBloodType;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Bloodtype color="error" />
          <Typography variant="h6">Edytuj donację</Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ marginLeft: 'auto' }}
            size="small"
          >
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3} mt={1}>
          <Stack spacing={1}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="subtitle1">Kwestionariusz</Typography>

              <Button
                size="small"
                variant="outlined"
                onClick={() => setShowQuestionnaire((prev) => !prev)}
                disabled={!questionnaire && !questionnaireError}
              >
                {showQuestionnaire ? 'Ukryj odpowiedzi' : 'Pokaż odpowiedzi'}
              </Button>
            </Stack>

            {questionnaireError && (
              <Typography variant="body2" color="error">
                {questionnaireError}
              </Typography>
            )}

            {showQuestionnaire && questionnaire && (
              <Stack
                spacing={1}
                sx={{
                  maxHeight: 220,
                  overflowY: 'auto',
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: 1,
                  p: 1.5,
                  bgcolor: '#fafafa',
                }}
              >
                {questionnaire.questionnaireTitle && (
                  <>
                    <Typography variant="subtitle2" gutterBottom>
                      {questionnaire.questionnaireTitle}
                    </Typography>
                    <Divider />
                  </>
                )}

                {(questionnaire.answers || []).map((ans, index) => (
                  <Stack key={ans.questionId ?? index} spacing={0.5} sx={{ pt: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {ans.questionText}
                    </Typography>

                    {ans.answerFlag != null && (
                      <Typography variant="body2">
                        Odpowiedź: {ans.answerFlag ? 'TAK' : 'NIE'}
                      </Typography>
                    )}

                    {ans.answerText && (
                      <Typography variant="body2">
                        Odpowiedź: {ans.answerText}
                      </Typography>
                    )}

                    {index < (questionnaire.answers.length - 1) && (
                      <Divider sx={{ mt: 1 }} />
                    )}
                  </Stack>
                ))}

                {(!questionnaire.answers || questionnaire.answers.length === 0) && (
                  <Typography variant="body2">
                    Brak odpowiedzi w kwestionariuszu.
                  </Typography>
                )}
              </Stack>
            )}
          </Stack>

          <FormControl fullWidth size="small" disabled={statusDisabled}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {statusesError && (
            <Typography variant="body2" color="error">
              {statusesError}
            </Typography>
          )}

          <TextField
            label="Ilość oddanej krwi (l)"
            type="number"
            size="small"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputProps={{ min: 0, step: 0.01 }}
          />

          <FormControl fullWidth size="small" disabled={bloodGroupDisabled}>
            <InputLabel id="bloodtype-label">Grupa krwi</InputLabel>
            <Select
              labelId="bloodtype-label"
              value={bloodTypeId}
              label="Grupa krwi"
              onChange={(e) => setBloodTypeId(e.target.value)}
            >
              {bloodTypes.map((bt) => (
                <MenuItem key={bt.id} value={String(bt.id)}>
                  {bt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {bloodTypesError && (
            <Typography variant="body2" color="error">
              {bloodTypesError}
            </Typography>
          )}

          {donation.existingDonor && donation.bloodGroupLabel && (
            <Typography variant="body2">
              Grupa krwi dawcy: {donation.bloodGroupLabel}
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ pr: 3, pb: 2 }}>
        <Button onClick={onClose}>Anuluj</Button>
        <Button
          variant="contained"
          color="error"
          disabled={!canSave}
          onClick={handleSave}
        >
          Zapisz
        </Button>
      </DialogActions>
    </Dialog>
  );
}
