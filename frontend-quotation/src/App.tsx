import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import QuotePage from './pages/QuotePage';
import type { JSX } from 'react';
import TrackShipmentPage from './pages/TrackShipmentPage';
import NavBar from './components/NavBar';
import { AuthProvider } from './contexts/AuthContext';


function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/quote"
            element={
              <PrivateRoute>
                <QuotePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/track"
            element={
              <PrivateRoute>
                <TrackShipmentPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
