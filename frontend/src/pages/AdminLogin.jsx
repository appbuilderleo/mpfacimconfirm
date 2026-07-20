import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { ThemeToggle } from '../components/ThemeToggle';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      const apiUrl = import.meta.env.PROD ? '/api/admin/login' : 'http://localhost:5000/api/admin/login';
      const res = await axios.post(apiUrl, { username, password });
      
      // Save token and redirect
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin');
    } catch (err) {
      setErrorMsg('Credenciais inválidas.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="min-h-screen bg-background flex flex-col">
      <Box className="w-full flex justify-end p-4">
        <ThemeToggle />
      </Box>
      <Container maxWidth="xs" className="flex-1 flex flex-col justify-center py-8">
        <Paper elevation={0} className="p-8 rounded-2xl bg-card border border-border shadow-sm text-center">
          <Box className="flex justify-center mb-4">
            <Box className="bg-primary/10 p-3 rounded-full">
              <LockOutlinedIcon className="text-primary text-4xl" />
            </Box>
          </Box>
          
          <Typography variant="h5" className="font-bold text-foreground mb-6">
            Acesso Restrito
          </Typography>

          {errorMsg && (
            <Box className="bg-destructive/10 p-3 rounded text-destructive text-sm mb-4">
              {errorMsg}
            </Box>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <TextField
              fullWidth
              label="Utilizador"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Palavra-passe"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={isLoading}
              className="mt-4 py-3 font-bold shadow-none"
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin;
