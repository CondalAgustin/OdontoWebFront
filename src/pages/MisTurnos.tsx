import { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Button, Snackbar, Alert,
} from '@mui/material';
import { useTurnos } from '../hook/Turnos';
// @ts-ignore
import AOS from 'aos';
import 'aos/dist/aos.css';

const MisTurnos = () => {
    //const [turnos, setTurnos] = useState<any[]>([]);
    //const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [vista, setVista] = useState<'futuros' | 'historial'>('futuros');
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'error' | 'success' | 'warning' | 'info';
    }>({ open: false, message: '', severity: 'success' });
    const authData = JSON.parse(localStorage.getItem('auth') || '{}')
    const usuarioId = authData.id; // 🔁 Reemplazar por el ID del usuario logueado (desde el contexto o JWT)
    useEffect(() => {
        AOS.init({ duration: 600, once: true });
        cargarTurnos();
    }, []);

    const { turnos, obtenerMisTurnos, obtenerHistorialTurnos, cancelarTurno } = useTurnos();

    const cargarTurnos = async () => {
        try {
            const data =
                vista === 'futuros'
                    ? await obtenerMisTurnos(usuarioId)
                    : await obtenerHistorialTurnos(usuarioId);
            console.log(data)
        } catch (err) {
            setSnackbar({ open: true, message: 'Error al cargar los turnos', severity: 'error' });
        }
    };


    const handleCancelar = async (id: number) => {
        try {
            await cancelarTurno(id);
            setSnackbar({ open: true, message: 'Turno cancelado correctamente', severity: 'success' });
            cargarTurnos(); // refrescar lista
        } catch (err: any) {
            setSnackbar({ open: true, message: err.message || 'Error al cancelar', severity: 'error' });
        }
    };

    const puedeCancelar = (fechaTurno: string, horaTurno: string, estado: string) => {
        if (estado !== 'Confirmado') return false;

        const fechaFormateada = fechaTurno.split('T')[0]; // "2025-07-18"
        console.log('fechaFormateada', fechaFormateada)
        const fecha = new Date(`${fechaFormateada}T${horaTurno}`); // "2025-07-18T10:00"
        console.log('fecha', fecha)

        const ahora = new Date();
        console.log('ahora', ahora)

        const diferenciaHoras = (fecha.getTime() - ahora.getTime()) / (1000 * 60 * 60);
        console.log("DIF", diferenciaHoras)
        return diferenciaHoras > 12;
    };

    useEffect(() => {
        cargarTurnos();
    }, []);

    useEffect(() => {
        cargarTurnos();
    }, [vista]);


    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', padding: 3 }}>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    mb: 2,
                }}
            >
                <Button
                    variant={vista === 'futuros' ? 'contained' : 'outlined'}
                    onClick={() => setVista('futuros')}
                    sx={{
                        color: vista === 'futuros' ? 'white' : 'green',
                        backgroundColor: vista === 'futuros' ? 'green' : 'transparent',
                        borderColor: 'green',
                        '&:hover': {
                            backgroundColor: 'rgba(0,128,0,0.1)', // verde muy suave
                            borderColor: 'green',
                        },
                    }}
                >
                    Próximos Turnos
                </Button>
                <Button
                    variant={vista === 'historial' ? 'contained' : 'outlined'}
                    onClick={() => setVista('historial')}
                    sx={{
                        color: vista === 'historial' ? 'white' : 'green',
                        backgroundColor: vista === 'historial' ? 'green' : 'transparent',
                        borderColor: 'green',
                        '&:hover': {
                            backgroundColor: 'rgba(0,128,0,0.1)',
                            borderColor: 'green',
                        },
                    }}
                >
                    Historial
                </Button>
            </Box>

            <Typography variant="h4" gutterBottom>
                {vista === 'futuros' ? 'Mis Turnos' : 'Historial de Turnos'}
            </Typography>

            {turnos.length === 0 ? (
                <Typography>No tenés turnos registrados.</Typography>
            ) : (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                        gap: 2,
                    }}
                >
                    {turnos.map((turno, i) => (
                        <Paper
                            key={turno.id}
                            sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                            data-aos="fade-up"
                            data-aos-delay={i * 100}
                        >
                            <Typography><strong>Fecha:</strong> {turno.fechaTurno.split('T')[0]}</Typography>
                            <Typography><strong>Hora:</strong> {turno.horaTurno}</Typography>
                            <Typography><strong>Especialidad:</strong> {turno.nombreEspecialidad}</Typography>
                            <Typography><strong>Estado:</strong> {turno.estado}</Typography>

                            {puedeCancelar(turno.fechaTurno, turno.horaTurno, turno.estado) && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleCancelar(turno.id)}
                                    sx={{ mt: 2, alignSelf: 'center' }}
                                >
                                    Cancelar turno
                                </Button>
                            )}
                        </Paper>
                    ))}

                </Box>

            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MisTurnos;
