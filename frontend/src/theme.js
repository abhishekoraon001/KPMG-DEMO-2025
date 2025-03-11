import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Primary color
    },
    secondary: {
      main: '#dc004e', // Secondary color
    },
    success: {
      main: '#4caf50', // Success color
    },
    error: {
      main: '#f44336', // Error color
    },
    warning: {
      main: '#ff9800', // Warning color
    },
  },
  spacing: 8, // Default spacing
});

export default theme;