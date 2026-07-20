import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import RSVPForm from './pages/RSVPForm'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import PoliticaPrivacidade from './pages/PoliticaPrivacidade'
import { ThemeProvider, useTheme } from './components/ThemeProvider'

// Dynamically create the Material-UI theme to sync with Tailwind Claude theme
const ThemedApp = () => {
  const { theme } = useTheme();
  
  const muiTheme = createTheme({
    palette: {
      mode: theme === 'dark' ? 'dark' : 'light',
      primary: {
        main: '#da6040', // Claude orange
      },
      secondary: {
        main: theme === 'dark' ? '#ececed' : '#11181c', // Foreground
      },
      background: {
        default: theme === 'dark' ? '#111110' : '#f9fafb',
        paper: theme === 'dark' ? '#191918' : '#ffffff',
      },
      text: {
        primary: theme === 'dark' ? '#ececed' : '#11181c',
        secondary: theme === 'dark' ? '#909090' : '#687076',
      }
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: 'none',
        fontWeight: 600,
      }
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          }
        }
      }
    }
  });

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RSVPForm />} />
          <Route path="/privacidade" element={<PoliticaPrivacidade />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <ThemedApp />
    </ThemeProvider>
  )
}

export default App
