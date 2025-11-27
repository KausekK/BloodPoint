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
  Stack
} from '@mui/material';
import { Bloodtype, Close } from '@mui/icons-material';
import { listBloodTypes } from '../../../services/BloodTypeService';
import { listDonationStatuses } from '../../../services/DonationStatusService';

const DONATION_STATUS_LABELS = {
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
  const [amount, setAmount] = useState(
    donation.amountOfBlood != null ? String(donation.amountOfBlood) : ''
  );
  const [bloodTypeId, setBloodTypeId] = useState(donation.bloodTypeId || '');

  const [bloodTypes, setBloodTypes] = useState([]);
  const [loadingBloodTypes, setLoadingBloodTypes] = useState(false);
  const [bloodTypesError, setBloodTypesError] = useState('');

  const [statusOptions, setStatusOptions] = useState([]);
  const [loadingStatuses, setLoadingStatuses] = useState(false);
  const [statusesError, setStatusesError] = useState('');
  const [lockBloodType, setLockBloodType] = useState(false);


  useEffect(() => {
    setStatus(donation.status || '');
    setAmount(
      donation.amountOfBlood != null ? String(donation.amountOfBlood) : ''
    );
    setBloodTypeId(donation.bloodTypeId || '');
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
        console.error('Nie udało się pobrać statusów wizyt:', e);
        setStatusOptions([]);
        setStatusesError('Nie udało się pobrać listy statusów.');
      } finally {
        setLoadingStatuses(false);
      }
    })();
  }, [open]);

  const parsedAmount = (() => {
    if (!amount && amount !== 0) return NaN;
    const normalized = String(amount).replace(',', '.');
    return parseFloat(normalized);
  })();

  const canSave =
    status &&
    bloodTypeId &&
    !bloodTypesError &&
    !statusesError &&
    Number.isFinite(parsedAmount) &&
    parsedAmount > 0;

  const handleSave = () => {
    onSave({
      donationStatus: status,
      amountOfBlood: parsedAmount,
      bloodTypeId: Number(bloodTypeId),
    });
  };

  const statusDisabled = loadingStatuses || !!statusesError;
  const bloodGroupDisabled = loadingBloodTypes || !!bloodTypesError || lockBloodType;

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
                <MenuItem key={bt.id} value={bt.id}>
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
          disabled={!canSave}
          onClick={handleSave}
        >
          Zapisz
        </Button>
      </DialogActions>
    </Dialog>
  );
}
