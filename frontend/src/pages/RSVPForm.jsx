import React, { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Divider,
  InputAdornment
} from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { ThemeToggle } from '../components/ThemeToggle';

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-08-31T00:00:00');
    
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box className="flex gap-4 justify-center mt-4">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <Box key={unit} className="flex flex-col items-center">
          <Typography variant="h5" className="font-bold text-primary">
            {value.toString().padStart(2, '0')}
          </Typography>
          <Typography variant="caption" className="text-muted-foreground uppercase tracking-wider text-[10px]">
            {unit === 'days' ? 'Dias' : unit === 'hours' ? 'Horas' : unit === 'minutes' ? 'Minutos' : 'Segundos'}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const RSVPForm = () => {
  const { register, handleSubmit, formState: { errors, isValid }, control } = useForm({
    mode: 'onChange' // Enables real-time validation for isValid
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Watch the checkbox state to enable/disable button
  const privacidadeAceite = useWatch({
    control,
    name: "privacidade_aceite",
    defaultValue: false
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const apiUrl = 'http://localhost:5000/api/rsvp';
      await axios.post(apiUrl, data);
      setSuccess(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Erro ao submeter formulário. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Box className="min-h-screen bg-background flex flex-col">
        <Box className="w-full flex justify-end p-4">
          <ThemeToggle />
        </Box>
        <Container maxWidth="sm" className="flex-1 flex items-center justify-center p-4">
          <Box className="p-8 text-center bg-transparent">
            <Typography variant="h4" className="text-primary font-bold mb-4">
              Participação Confirmada!
            </Typography>
            <Typography variant="body1" className="text-muted-foreground mb-6">
              Obrigado por confirmar a sua presença. Vemo-nos na FACIM 2026!
            </Typography>
            
            <Button 
              variant="outlined" 
              color="primary"
              onClick={() => window.location.reload()}
            >
              Nova Inscrição
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen relative overflow-hidden flex flex-col font-sans bg-background">
      {/* Decorative background blobs for glassmorphism to pop */}
      <Box className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <Box className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <Box className="w-full flex justify-end p-4 relative z-10">
        <ThemeToggle />
      </Box>
      <Container maxWidth="sm" className="flex-1 flex flex-col py-4 px-4 sm:px-6">
        
        {/* Top Info Section */}
        <Box className="text-center mb-8 flex flex-col items-center">
          <img src="/Marca MP2.png" alt="Maputo Província" className="h-24 mb-6 object-contain" />
          
          <Typography variant="h3" component="h1" className="font-black text-foreground tracking-tighter mb-6" style={{ fontWeight: 900 }}>
            FACIM 2026
          </Typography>
          
          <Box className="w-full max-w-md mx-auto bg-primary/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] mb-4">
            <Typography variant="subtitle1" className="text-primary font-semibold">
              Lançamento da Campanha Maputo Província a Caminho da 61ª FACIM 2026
            </Typography>
          </Box>

          <Box className="flex flex-col gap-2 mt-2 text-muted-foreground w-full max-w-md mx-auto bg-card/30 backdrop-blur-md p-5 rounded-3xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] mb-8">
            <Box className="flex items-center justify-center gap-2">
              <LocationOnOutlinedIcon fontSize="small" className="text-primary" />
              <Typography variant="body2">
                Platinum Lodge, Município da Matola, Bairro de Tchumene 2
              </Typography>
            </Box>
            <Box className="flex items-center justify-center gap-2 mt-1">
              <CalendarTodayOutlinedIcon fontSize="small" className="text-primary" />
              <Typography variant="body2" className="font-medium">
                27-07-2026 <span className="mx-2 opacity-50">|</span> 10h00
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Form Section */}
        <Box className="w-full max-w-md mx-auto bg-card/30 backdrop-blur-xl p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.07)] relative z-10">
          <Typography variant="h6" className="text-center font-bold text-foreground mb-6">
            Confirme a sua presença
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <TextField
              fullWidth
              placeholder="Nome Completo"
              variant="outlined"
              size="small"
              {...register('nome', { 
                required: 'Nome é obrigatório',
                validate: value => value.trim().split(' ').length >= 2 || 'Insira o nome completo'
              })}
              error={!!errors.nome}
              helperText={errors.nome?.message}
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
              placeholder="Email ou Telefone"
              type="email"
              variant="outlined"
              size="small"
              {...register('email', { 
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineOutlinedIcon className="text-primary/70" />
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
              placeholder="Celular / WhatsApp"
              variant="outlined"
              size="small"
              {...register('celular', { required: 'Celular é obrigatório' })}
              error={!!errors.celular}
              helperText={errors.celular?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneOutlinedIcon className="text-primary/70" />
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

            <FormControlLabel
              className="mt-2"
              control={
                <Checkbox
                  color="primary"
                  disabled={!isValid}
                  {...register('privacidade_aceite')}
                />
              }
              label={
                <Typography variant="body2" className={`text-sm ${isValid ? 'text-foreground' : 'text-muted-foreground opacity-70'}`}>
                  Aceito a <Link to="/privacidade" className="text-primary hover:underline">política de privacidade</Link>.
                </Typography>
              }
            />

            {errorMsg && (
              <Box className="bg-destructive/10 p-3 rounded text-destructive text-sm">
                {errorMsg}
              </Box>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={isLoading || !isValid || !privacidadeAceite}
              className="py-3 mt-6 text-base font-bold shadow-md hover:shadow-lg rounded-full"
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirmar Participação'}
            </Button>
          </form>
        </Box>

        {/* Footer Section */}
        <Box className="mt-16 mb-8 text-center">
          <Typography variant="h6" className="text-foreground tracking-[0.2em] font-black uppercase mb-4" style={{ fontWeight: 900 }}>
            SAVE THE DATE <span className="text-primary mx-2">•</span> 31/08 - 06/09
          </Typography>
          <Countdown />
        </Box>

      </Container>
    </Box>
  );
};

export default RSVPForm;
