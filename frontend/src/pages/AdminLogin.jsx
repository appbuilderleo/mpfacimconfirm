import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress,
  InputAdornment
} from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
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
      <Container maxWidth="sm" className="flex-1 flex flex-col justify-center py-8">
        <Box className="w-full max-w-md mx-auto bg-card/30 backdrop-blur-xl p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.07)] relative z-10 text-center">
          <Box className="flex justify-center mb-6">
            <img 
              src="/Marca MP2.png" 
              alt="Logo Maputo Província" 
              className="h-16 w-auto object-contain"
            />
          </Box>
          
          <Typography variant="h5" className="font-bold text-foreground mb-6">
            Acesso Restrito
          </Typography>

          {errorMsg && (
            <Box className="bg-destructive/10 p-3 rounded text-destructive text-sm mb-4">
              {errorMsg}
            </Box>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <TextField
              fullWidth
              placeholder="Utilizador"
              variant="outlined"
              size="small"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineOutlinedIcon className="text-primary/70" />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '9999px',
                  backgroundColor: 'var(--color-card)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                  paddingLeft: 1.5,
                  '& fieldset': { borderColor: 'transparent' },
                  '&:hover fieldset': { borderColor: 'transparent' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)', borderWidth: '1px' }
                }
              }}
            />
            <TextField
              fullWidth
              placeholder="Palavra-passe"
              type="password"
              variant="outlined"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon className="text-primary/70" />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '9999px',
                  backgroundColor: 'var(--color-card)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                  paddingLeft: 1.5,
                  '& fieldset': { borderColor: 'transparent' },
                  '&:hover fieldset': { borderColor: 'transparent' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)', borderWidth: '1px' }
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={isLoading}
              className="mt-6 py-3 text-base font-bold shadow-md hover:shadow-lg rounded-full"
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
            </Button>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminLogin;
