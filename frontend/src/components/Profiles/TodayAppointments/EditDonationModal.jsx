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
import { BLOOD_GROUPS } from '../../shared/const/BloodGroups';
import { APPOINTMENT_STATUS } from '../../shared/const/AppointmentStatus';

const STATUS_OPTIONS = [
  { value: APPOINTMENT_STATUS.UMOWIONA, label: "Umówiona" },
  { value: APPOINTMENT_STATUS.ODWOLANA, label: "Odwołana" },
  { value: APPOINTMENT_STATUS.ZREALIZOWANA, label: "Zrealizowana" },
  { value: APPOINTMENT_STATUS.PRZERWANA, label: "Przerwana" },
];

export default function EditDonationModal({
  open,
  onClose,
  donation = {},
  onSave
}) {
  const [status, setStatus] = useState(donation.status || '');
  const [amount, setAmount] = useState(donation.amountOfBlood || '');
  const [bloodGroup, setBloodGroup] = useState(donation.bloodGroup || '');

  useEffect(() => {
    setStatus(donation.status || '');
    setAmount(donation.amountOfBlood || '');
    setBloodGroup(donation.bloodGroup || '');
  }, [donation]);

  const handleSave = () => {
    onSave({ status, amountOfBlood: amount, bloodGroup });
  };

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
          <FormControl fullWidth size="small">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={status}
              label="Status"
              onChange={e => setStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Ilość oddanej krwi (ml)"
            type="number"
            size="small"
            fullWidth
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            inputProps={{ min: 0, step: 50 }}
          />

          <FormControl fullWidth size="small">
            <InputLabel id="bloodgroup-label">Grupa krwi</InputLabel>
            <Select
              labelId="bloodgroup-label"
              value={bloodGroup}
              label="Grupa krwi"
              onChange={e => setBloodGroup(e.target.value)}
            >
              {BLOOD_GROUPS.map(bg => (
                <MenuItem key={bg} value={bg}>
                  {bg}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ pr: 3, pb: 2 }}>
        <Button onClick={onClose}>Anuluj</Button>
        <Button
          variant="contained"
          color="error"
          disabled={!status || !amount || !bloodGroup}
          onClick={handleSave}
        >
          Zapisz
        </Button>
      </DialogActions>
    </Dialog>
  );
}
