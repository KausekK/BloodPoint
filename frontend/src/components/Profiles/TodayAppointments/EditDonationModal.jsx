import React, { useState, useEffect } from 'react';
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
  Stack
} from '@mui/material';
import { Bloodtype, Close } from '@mui/icons-material';
import { listBloodTypes } from '../../../services/BloodTypeService';
import { listAppointmentStatuses } from '../../../services/AppointmentStatusService';

const APPOINTMENT_STATUS_LABELS = {
  UMOWIONA: "Umówiona",
  ODWOLANA: "Odwołana",
  ZREALIZOWANA: "Zrealizowana",
  PRZERWANA: "Przerwana",
};

export default function EditDonationModal({
  open,
  onClose,
  donation = {},
  onSave
}) {
  const [status, setStatus] = useState(donation.status || '');
  const [amount, setAmount] = useState(donation.amountOfBlood || '');
  const [bloodGroup, setBloodGroup] = useState(donation.bloodGroup || '');

  const [bloodTypes, setBloodTypes] = useState([]);
  const [loadingBloodTypes, setLoadingBloodTypes] = useState(false);
  const [bloodTypesError, setBloodTypesError] = useState('');

  const [statusOptions, setStatusOptions] = useState([]);
  const [loadingStatuses, setLoadingStatuses] = useState(false);
  const [statusesError, setStatusesError] = useState('');

  useEffect(() => {
    setStatus(donation.status || '');
    setAmount(donation.amountOfBlood || '');
    setBloodGroup(donation.bloodGroup || '');
  }, [donation]);

  
  useEffect(() => {
    if (!open) return;

    (async () => {
      try {
        setLoadingBloodTypes(true);
        setBloodTypesError('');
        const bts = await listBloodTypes();
        setBloodTypes(Array.isArray(bts) ? bts : []);
      } catch (e) {
        console.error('Nie udało się pobrać grup krwi:', e);
        setBloodTypes([]);
        setBloodTypesError('Nie udało się pobrać listy grup krwi.');
      } finally {
        setLoadingBloodTypes(false);
      }
    })();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    (async () => {
      try {
        setLoadingStatuses(true);
        setStatusesError('');
        const statuses = await listAppointmentStatuses();
        const opts = (Array.isArray(statuses) ? statuses : []).map((s) => ({
          value: s,
          label: APPOINTMENT_STATUS_LABELS[s] || s,
        }));
        setStatusOptions(opts);
      } catch (e) {
        console.error('Nie udało się pobrać statusów wizyt:', e);
        setStatusOptions([]);
        setStatusesError('Nie udało się pobrać listy statusów.');
      } finally {
        setLoadingStatuses(false);
      }
    })();
  }, [open]);

  const handleSave = () => {
    onSave({
      status,
      amountOfBlood: amount,
      bloodGroup,
    });
  };

  const statusDisabled = loadingStatuses || !!statusesError;
  const bloodGroupDisabled = loadingBloodTypes || !!bloodTypesError;

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
          {/* STATUS */}
          <FormControl fullWidth size="small" disabled={statusDisabled}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={status}
              label="Status"
              onChange={e => setStatus(e.target.value)}
            >
              {statusOptions.map(opt => (
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

          {/* ILOŚĆ KRWI */}
          <TextField
            label="Ilość oddanej krwi (ml)"
            type="number"
            size="small"
            fullWidth
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            inputProps={{ min: 0, step: 50 }}
          />

          {/* GRUPA KRWI */}
          <FormControl fullWidth size="small" disabled={bloodGroupDisabled}>
            <InputLabel id="bloodgroup-label">Grupa krwi</InputLabel>
            <Select
              labelId="bloodgroup-label"
              value={bloodGroup}
              label="Grupa krwi"
              onChange={e => setBloodGroup(e.target.value)}
            >
              {bloodTypes.map(bt => (
                <MenuItem key={bt.id} value={bt.label}>
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
        </Stack>
      </DialogContent>

      <DialogActions sx={{ pr: 3, pb: 2 }}>
        <Button onClick={onClose}>Anuluj</Button>
        <Button
          variant="contained"
          color="error"
          disabled={
            !status ||
            !amount ||
            !bloodGroup ||
            !!bloodTypesError ||
            !!statusesError
          }
          onClick={handleSave}
        >
          Zapisz
        </Button>
      </DialogActions>
    </Dialog>
  );
}
