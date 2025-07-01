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
} from '@mui/material';
import { getShipmentStatusHistory } from '../services/statusService';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export default function TrackShipmentPage() {
    const [shipmentId, setShipmentId] = useState('');
    const [statusHistory, setStatusHistory] = useState<string[]>([]);
    const [currentStatus, setCurrentStatus] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const steps = ['En espera', 'En tránsito', 'Entregado'];

    const [error, setError] = useState('');

    useEffect(() => {
        if (!shipmentId) return;

        // Cerrar conexión previa si existe
        socketRef.current?.disconnect();

        // Conectar nuevo socket con el shipmentId
        const socket = io('http://localhost:3000', {
            query: { shipmentId },
        });

        socket.on('statusUpdate', (data: { status: string }) => {
            console.log('Estado actualizado por WebSocket:', data.status);
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

            const history = await getShipmentStatusHistory(shipmentId);
            setStatusHistory(history);
            setCurrentStatus(history[history.length - 1] ?? null);
            console.log('Buscando estado para ID:', shipmentId);
        } catch (err) {
            console.error(err);
            setError('No se pudo obtener el estado del envío');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Seguimiento de envío
            </Typography>

            <TextField
                label="ID de envío"
                fullWidth
                margin="normal"
                value={shipmentId}
                onChange={(e) => setShipmentId(e.target.value)}
            />

            <Button variant="contained" color="primary" onClick={handleTrack}>
                Consultar
            </Button>
            {currentStatus && (
                <Stepper activeStep={steps.indexOf(currentStatus)} alternativeLabel sx={{ mt: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            )}

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

            {currentStatus && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    Estado actual: {currentStatus}
                </Alert>
            )}

            {statusHistory.length > 0 && (
                <>
                    <Typography variant="h6" sx={{ mt: 4 }}>
                        Historial de estados:
                    </Typography>
                    <List>
                        {statusHistory.map((status, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={status} />
                            </ListItem>
                        ))}
                    </List>
                </>
            )}
        </Container>
    );
}
