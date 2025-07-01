import { useForm } from 'react-hook-form';
import { TextField, Button, Container, Typography, Paper, Box, Alert } from '@mui/material';
import { register as registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

type FormData = {
  email: string;
  password: string;
};

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data.email, data.password);
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      navigate('/');
    } catch (error) {
      setError('Error al registrar. El usuario ya existe o la conexión falló.');
      console.error(error);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        🎆 Crear Cuenta
      </Typography>

      <Paper sx={{ p: 4, backgroundColor: '#fafafa' }} elevation={4}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="📧 Correo Electrónico"
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ backgroundColor: 'white' }}
            {...register('email', { required: true })}
            error={!!error}
          />
          <TextField
            label="🔑 Contraseña"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ backgroundColor: 'white' }}
            {...register('password', { required: true })}
          />
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ 
              mt: 2, 
              py: 1.5,
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#45a049' }
            }}
          >
            ✨ Crear Cuenta
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mt: 2 }}>❌ {error}</Alert>}
      </Paper>
    </Container>
  );
}
