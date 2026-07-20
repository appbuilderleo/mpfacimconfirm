import React from 'react';
import { useTheme } from './ThemeProvider';
import { IconButton } from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <IconButton 
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      color="inherit"
      aria-label="Alternar tema"
      sx={{ ml: 1 }}
    >
      {theme === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
    </IconButton>
  );
}
