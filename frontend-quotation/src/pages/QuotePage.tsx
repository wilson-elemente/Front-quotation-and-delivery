import {
    TextField,
    Button,
    Container,
    Typography,
    Paper,
    Box,
    Card,
    CardContent,
    Divider,
    Alert,
} from '@mui/material';
import { useState } from 'react';
import { registerShipment } from '../services/shipmentService';
import type { RegisterShipmentDTO } from '../types';

import { useForm, } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Grid from '@mui/material/Grid';
import { getQuote } from '../services/quoteService';
import type { QuoteResponseDTO } from '../types/index';



type FormData = {
    origin: string;
    destination: string;
    weightKg: number;
    lengthCm: number;
    widthCm: number;
    heightCm: number;
};


const schema = yup.object().shape({
    origin: yup.string().required('Origen requerido'),
    destination: yup
        .string()
        .required('Destino requerido')
        .notOneOf([yup.ref('origin')], 'Origen y destino deben ser diferentes'),
    weightKg: yup
        .number()
        .min(1, 'Peso debe ser mayor a 0')
        .typeError('Peso es requerido')
        .positive('Debe ser mayor a 0')
        .required('Peso es requerido'),
    lengthCm: yup
        .number()
        .typeError('Largo es requerido')
        .positive('Debe ser mayor a 0')
        .required('Largo es requerido'),
    widthCm: yup
        .number()
        .typeError('Ancho es requerido')
        .positive('Debe ser mayor a 0')
        .required('Ancho es requerido'),
    heightCm: yup
        .number()
        .typeError('Alto es requerido')
        .positive('Debe ser mayor a 0')
        .required('Alto es requerido'),
});



export default function QuotePage() {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });



    const [quote, setQuote] = useState<QuoteResponseDTO | null>(null);

    const onSubmit = async (data: FormData) => {
        try {
            const res: QuoteResponseDTO = await getQuote(data);
            const priceSoles = res.priceCents
            setQuote(res);
            alert(`Precio de la cotización:= ${priceSoles} Pesos Colombianos`);
        } catch (err) {
            console.error(err);
            alert('Error al obtener la cotización');
        }
    };

    const handleConfirmShipment = async () => {
        if (!quote) return;

        const formValues = getValues(); // 

        const payload: RegisterShipmentDTO = {
            ...formValues,
            quotedPriceCents: quote.priceCents,
        };
        try {
            const response = await registerShipment(payload);
            alert(`Envío registrado con ID: ${response.id}`);
            // Aquí podrías redirigir o limpiar el formulario
        } catch (error) {
            console.error(error);
            alert('Error al registrar el envío');
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                💰 Cotizar envío
            </Typography>

            <Paper sx={{ p: 4, mb: 4, backgroundColor: '#fafafa' }}>
                {/* Formulario de cotización */}
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', mb: 3 }}>
                        📦 Información del paquete
                    </Typography>
                    
                    <Grid container spacing={3}>
                        {/* Origen y Destino */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="🗺️ Ciudad de origen"
                                fullWidth
                                variant="outlined"
                                sx={{ backgroundColor: 'white' }}
                                {...register('origin')}
                                error={!!errors.origin}
                                helperText={errors.origin?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="🎯 Ciudad de destino"
                                fullWidth
                                variant="outlined"
                                sx={{ backgroundColor: 'white' }}
                                {...register('destination')}
                                error={!!errors.destination}
                                helperText={errors.destination?.message}
                            />
                        </Grid>

                        {/* Peso */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="⚖️ Peso (kg)"
                                type="number"
                                fullWidth
                                variant="outlined"
                                sx={{ backgroundColor: 'white' }}
                                inputProps={{ step: "any", min: "0.1" }}
                                {...register('weightKg', { valueAsNumber: true })}
                                error={!!errors.weightKg}
                                helperText={errors.weightKg?.message}
                            />
                        </Grid>

                        {/* Dimensiones */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="📏 Largo (cm)"
                                type="number"
                                fullWidth
                                variant="outlined"
                                sx={{ backgroundColor: 'white' }}
                                inputProps={{ min: "1" }}
                                {...register('lengthCm', { valueAsNumber: true })}
                                error={!!errors.lengthCm}
                                helperText={errors.lengthCm?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="📐 Ancho (cm)"
                                type="number"
                                fullWidth
                                variant="outlined"
                                sx={{ backgroundColor: 'white' }}
                                inputProps={{ min: "1" }}
                                {...register('widthCm', { valueAsNumber: true })}
                                error={!!errors.widthCm}
                                helperText={errors.widthCm?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="📊 Alto (cm)"
                                type="number"
                                fullWidth
                                variant="outlined"
                                sx={{ backgroundColor: 'white' }}
                                inputProps={{ min: "1" }}
                                {...register('heightCm', { valueAsNumber: true })}
                                error={!!errors.heightCm}
                                helperText={errors.heightCm?.message}
                            />
                        </Grid>

                        {/* Botón de cotizar */}
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ 
                                    py: 1.5,
                                    backgroundColor: '#1976d2',
                                    '&:hover': { backgroundColor: '#1565c0' },
                                    fontSize: '1.1rem'
                                }}
                            >
                                🔍 Obtener cotización
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                {/* Resultado de la cotización */}
                {quote && (
                    <Box sx={{ mt: 4 }}>
                        <Divider sx={{ mb: 3 }} />
                        <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
                            💰 Resultado de la cotización
                        </Typography>
                        
                        <Card sx={{ mb: 3, backgroundColor: 'white', boxShadow: 2 }}>
                            <CardContent>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Precio total estimado
                                        </Typography>
                                        <Typography variant="h4" fontWeight="bold" color="success.main">
                                            💵 ${quote.priceCents.toLocaleString()} COP
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Peso facturable calculado
                                        </Typography>
                                        <Typography variant="h6">
                                            📦 {quote.chargeableWeight} kg
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>


                        <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            size="large"
                            onClick={handleConfirmShipment}
                            sx={{ 
                                py: 1.5,
                                fontSize: '1.1rem',
                                backgroundColor: '#4caf50',
                                '&:hover': { backgroundColor: '#45a049' }
                            }}
                        >
                            ✅ Confirmar y registrar envío
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}
