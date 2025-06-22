import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme
} from '@mui/material';

export default function ConfirmModal({
  open,
  title = 'Potwierdzenie',
  description = 'Czy na pewno chcesz kontynuować?',
  onConfirm,
  onCancel
}) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      PaperProps={{
        sx: { borderRadius: 2, p: 2 }
      }}
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>
          Nie
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            ml: 1,
            bgcolor: theme.palette.error.main,
            '&:hover': { bgcolor: theme.palette.error.dark }
          }}
        >
          Tak
        </Button>
      </DialogActions>
    </Dialog>
  );
}
