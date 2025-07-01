import { useForm } from 'react-hook-form';
import { TextField, Button, Container, Typography, Paper, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useState } from 'react';
type FormData = {
    email: string;
    password: string;
};

export default function LoginPage() {
    const { register, handleSubmit } = useForm<FormData>();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const onSubmit = async (data: FormData) => {
        try {
            setError('');
            const response = await login(data.email, data.password);
            localStorage.setItem('token', response.token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            setError('Credenciales inválidas. Verifique su correo y contraseña.');
        }
    };
    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Typography variant="h4" align="center" gutterBottom>
                🔒 Iniciar Sesión
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
                            backgroundColor: '#1976d2',
                            '&:hover': { backgroundColor: '#1565c0' }
                        }}
                    >
                        🔓 Iniciar Sesión
                    </Button>
                </Box>

                {error && <Alert severity="error" sx={{ mt: 2 }}>❌ {error}</Alert>}
            </Paper>
        </Container>
    );
}