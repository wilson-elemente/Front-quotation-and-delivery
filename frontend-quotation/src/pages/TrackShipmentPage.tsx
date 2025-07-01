import { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    Stepper,
    Step,
    StepLabel,
    Alert,
    Paper,
    Box,
    Card,
    CardContent,
    Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { getShipmentStatusHistory } from '../services/statusService';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export default function TrackShipmentPage() {
    const [shipmentId, setShipmentId] = useState('');
    const [statusHistory, setStatusHistory] = useState<string[]>([]);
    const [currentStatus, setCurrentStatus] = useState<string | null>(null);
    const [hasQueried, setHasQueried] = useState(false);
    const [shipmentData, setShipmentData] = useState<any>(null);
    const socketRef = useRef<Socket | null>(null);
    const steps = ['En espera', 'En tránsito', 'Entregado'];

    const [error, setError] = useState('');

    useEffect(() => {
        if (!shipmentId) return;

        socketRef.current?.disconnect();
        const socket = io('http://localhost:3000', {
            query: { shipmentId },
        });

        socket.on('statusUpdate', (data: { status: string }) => {
            setStatusHistory((prev) => {
                if (!Array.isArray(prev)) return [data.status];
                return prev.includes(data.status) ? prev : [...prev, data.status];
            });
            setCurrentStatus(data.status);
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
        };
    }, [shipmentId]);

    const handleTrack = async () => {
        try {
            setError('');
            setStatusHistory([]);
            setCurrentStatus(null);
            setShipmentData(null);
            setHasQueried(true);

            const response = await getShipmentStatusHistory(shipmentId);
            
            const currentState = response.currentStatus || response.status || null;
            const history = response.statusHistory || response.history || (Array.isArray(response) ? response : []);
            
            setStatusHistory(Array.isArray(history) ? history : []);
            setCurrentStatus(currentState);
            setShipmentData(response);
        } catch (err) {
            setError('No se pudo obtener el estado del envío');
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Seguimiento de envío
            </Typography>

            <Paper sx={{ p: 4, mb: 4, backgroundColor: '#fafafa' }}>
                <Box component="form" onSubmit={(e) => { e.preventDefault(); handleTrack(); }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="ID de envío"
                                value={shipmentId}
                                onChange={(e) => setShipmentId(e.target.value)}
                                variant="outlined"
                                sx={{ backgroundColor: 'white' }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleTrack}
                                sx={{ 
                                    py: 1.5,
                                    backgroundColor: '#1976d2',
                                    '&:hover': { backgroundColor: '#1565c0' }
                                }}
                            >
                                Consultar envío
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                {shipmentData && (
                    <Box sx={{ mt: 4 }}>
                        <Divider sx={{ mb: 3 }} />
                        <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
                            📦 Detalles del envío
                        </Typography>
                        <Card sx={{ mb: 3, backgroundColor: 'white', boxShadow: 1 }}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            ID del envío
                                        </Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            {shipmentData.id || shipmentId}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Fecha de creación
                                        </Typography>
                                        <Typography variant="body1">
                                            {shipmentData.createdAt 
                                                ? new Date(shipmentData.createdAt).toLocaleString('es-ES')
                                                : 'No disponible'
                                            }
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">
                                            Ruta del envío
                                        </Typography>
                                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                            📍 {shipmentData.origin || 'Origen no especificado'} 
                                            <span style={{ margin: '0 8px' }}>→</span> 
                                            📍 {shipmentData.destination || 'Destino no especificado'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="body2" color="text.secondary">
                                            Peso
                                        </Typography>
                                        <Typography variant="body1">
                                            ⚖️ {shipmentData.weightKg ? `${shipmentData.weightKg} kg` : 'N/A'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="body2" color="text.secondary">
                                            Dimensiones
                                        </Typography>
                                        <Typography variant="body1">
                                            📏 {shipmentData.lengthCm && shipmentData.widthCm && shipmentData.heightCm 
                                                ? `${shipmentData.lengthCm}×${shipmentData.widthCm}×${shipmentData.heightCm} cm`
                                                : 'N/A'
                                            }
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="body2" color="text.secondary">
                                            Precio cotizado
                                        </Typography>
                                        <Typography variant="body1" fontWeight="bold" color="success.main">
                                            💰 S/ {shipmentData.quotedPriceCents 
                                                ? (shipmentData.quotedPriceCents / 100).toFixed(2)
                                                : 'N/A'
                                            }
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Box>
                )}

                {hasQueried && (
                    <Box sx={{ mt: 3 }}>
                        <Alert severity="info" sx={{ mb: 3 }}>
                            {currentStatus 
                                ? `📋 Estado actual: ${currentStatus}` 
                                : '⏳ Consultando estado del envío... Estado actual: Desconocido'
                            }
                        </Alert>

                        <Stepper 
                            activeStep={currentStatus ? steps.indexOf(currentStatus) : -1} 
                            alternativeLabel 
                            sx={{ 
                                mt: 2,
                                '& .MuiStepLabel-root .Mui-completed': {
                                    color: '#4caf50',
                                },
                                '& .MuiStepLabel-root .Mui-active': {
                                    color: '#1976d2',
                                }
                            }}
                        >
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                )}

                {statusHistory.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
                            📅 Historial de estados
                        </Typography>
                        <Card sx={{ backgroundColor: 'white', boxShadow: 1 }}>
                            <CardContent>
                                <List>
                                    {statusHistory.map((status, index) => (
                                        <ListItem key={index} divider={index < statusHistory.length - 1}>
                                            <ListItemText 
                                                primary={status}
                                                secondary={`Actualización ${index + 1}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ mt: 3 }}>
                        ❌ {error}
                    </Alert>
                )}
            </Paper>
        </Container>
    );
}
