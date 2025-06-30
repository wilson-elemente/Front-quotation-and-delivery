import { useForm } from 'react-hook-form';
import { TextField, Button, Container, Typography } from '@mui/material';
import { register as registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

type FormData = {
  email: string;
  password: string;
};

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data.email, data.password);
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      navigate('/');
    } catch (error) {
      alert('Error al registrar. El usuario ya puede existe.');
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Registro
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          {...register('email', { required: true })}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          {...register('password', { required: true })}
        />
        <Button type="submit" variant="contained" color="primary">
          Registrar
        </Button>
      </form>
    </Container>
  );
}
