import React from 'react';
import {
  Dialog,
  DialogActions,
  Box,
  Typography,
  Button,
  useTheme
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function CustomModal({ open, onClose, dateString, timeString }) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: '#fff5f3',
          borderRadius: 3,
          boxShadow: 5,
          p: 0,
        }
      }}
      BackdropProps={{
        sx: { backgroundColor: 'rgba(0,0,0,0.2)' }
      }}
    >
      <Box
        sx={{
          height: 48,
          backgroundColor: theme.palette.error.main,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        }}
      />

      <Box
        sx={{
          px: 4,
          pt: 4,
          textAlign: 'center'
        }}
      >
        <CheckCircleIcon
          sx={{
            fontSize: 80,
            color: theme.palette.error.main,
            mb: 2
          }}
        />

        <Typography
          variant="h6"
          component="p"
          sx={{
            fontWeight: 'bold',
            lineHeight: 1.3,
            whiteSpace: 'pre-line'
          }}
        >
          {`Wizyta została umówiona w dniu\n${dateString} o godzinie\n${timeString}`}
        </Typography>
      </Box>

      <DialogActions sx={{ justifyContent: 'center', pb: 4 }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            bgcolor: theme.palette.error.main,
            borderRadius: 6,
            px: 6,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              bgcolor: theme.palette.error.dark
            }
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
