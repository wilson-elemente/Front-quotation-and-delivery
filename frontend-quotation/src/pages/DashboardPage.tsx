import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h3" gutterBottom>
        Welcome to the Dashboard!
      </Typography>
      <Typography variant="h6" gutterBottom>
        You have successfully logged in.
      </Typography>
      <Button 
        variant="outlined" 
        color="secondary" 
        onClick={handleLogout}
        sx={{ mt: 2 }}
      >
        Logout
      </Button>
    </Container>
  );
}
