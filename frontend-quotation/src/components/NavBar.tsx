import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function NavBar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          📦 QuotaShip
        </Typography>
        
        {isAuthenticated ? (
          // Usuario autenticado
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/dashboard"
              sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
            >
              🏠 Dashboard
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/quote"
              sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
            >
              💰 Cotizar
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/track"
              sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
            >
              📍 Rastrear
            </Button>
            <Button 
              color="inherit" 
              onClick={handleLogout}
              sx={{ 
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                marginLeft: 2,
                borderLeft: '1px solid rgba(255,255,255,0.3)',
                paddingLeft: 2
              }}
            >
              🚪 Salir
            </Button>
          </Box>
        ) : (
          // Usuario no autenticado
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/"
              sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
            >
              🔓 Iniciar Sesión
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/register"
              sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
            >
              ✨ Registrarse
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
