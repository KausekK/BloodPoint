import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider, createTheme } from "@mui/material/styles";
import 'toastr/build/toastr.min.css';
import toastr from 'toastr';

toastr.options = {
  positionClass: 'toast-top-right',
  tapToDismiss: false,
  closeButton: true,
  preventDuplicates: true,
  timeOut: 5000,
};
const theme = createTheme({
  palette: {
    primary: { main: "#e11b1e" }, 
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
