import { Container, Typography, Button, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, backgroundColor: '#fafafa' }} elevation={4}>
        <Typography variant="h3" align="center" gutterBottom>
          🎉 Bienvenido al Dashboard
        </Typography>
        <Typography variant="h6" align="center" gutterBottom>
          Has iniciado sesión con éxito.
        </Typography>
        <Box textAlign="center">
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleLogout}
            sx={{ 
              mt: 3, 
              py: 1.5,
              fontSize: '1.1rem'
            }}
          >
            🚪 Cerrar sesión
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
