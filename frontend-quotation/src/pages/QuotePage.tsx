import {
    TextField,
    Button,
    Container,
    Typography,

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
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Cotizar envío
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <TextField
                            label="Origen"
                            fullWidth
                            {...register('origin')}
                            error={!!errors.origin}
                            helperText={errors.origin?.message}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            label="Destino"
                            fullWidth
                            {...register('destination')}
                            error={!!errors.destination}
                            helperText={errors.destination?.message}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            label="Peso (kg)"
                            type="number"
                            fullWidth
                            inputProps={{ step: "any" }}
                            {...register('weightKg', { valueAsNumber: true })}
                            error={!!errors.weightKg}
                            helperText={errors.weightKg?.message}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            label="Largo (cm)"
                            type="number"
                            fullWidth
                            {...register('lengthCm', { valueAsNumber: true })}
                            error={!!errors.lengthCm}
                            helperText={errors.lengthCm?.message}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            label="Ancho (cm)"
                            type="number"
                            fullWidth
                            {...register('widthCm', { valueAsNumber: true })}
                            error={!!errors.widthCm}
                            helperText={errors.widthCm?.message}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            label="Alto (cm)"
                            type="number"
                            fullWidth
                            {...register('heightCm', { valueAsNumber: true })}
                            error={!!errors.heightCm}
                            helperText={errors.heightCm?.message}
                        />
                    </Grid>
                </Grid>


                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                >
                    Siguiente
                </Button>

                {quote && (
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 2, ml: 2 }}
                        onClick={handleConfirmShipment}
                    >
                        Confirmar envío
                    </Button>
                )}
            </form>
        </Container>
    );
}
