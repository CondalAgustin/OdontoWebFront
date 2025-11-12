// src/components/RecordatorioTurno.tsx
import { Card, CardContent, Typography } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

interface Props {
    idUsuario: number
}

//const API = 'https://localhost:44381/api'
const API_URL = import.meta.env.VITE_API_URL;


const RecordatorioTurno = ({ idUsuario }: Props) => {
    const [turnoProximo, setTurnoProximo] = useState<any | null>(null)

    useEffect(() => {
        const fetchTurnos = async () => {
            const res = await fetch(`${API_URL}/Turnos/proximos/${idUsuario}`)
            const data = await res.json()

            const mañana = dayjs().add(1, 'day').format('YYYY-MM-DD')
            const turno = data.find((t: any) => t.fechaTurno.startsWith(mañana))
            if (turno) setTurnoProximo(turno)
        }

        fetchTurnos()
    }, [idUsuario])

    if (!turnoProximo) return null

    return (
        <Card
            sx={{
                position: {
                    xs: 'static',   // flujo normal en móviles/netbook
                    md: 'absolute', // flotante solo desde pantallas medianas
                },
                top: {
                    md: 100
                },
                right: {
                    md: 30
                },
                width: {
                    xs: '100%',   // ocupa ancho completo en móviles
                    md: 300       // ancho fijo en desktop
                },
                bgcolor: '#e3f2fd',
                borderLeft: '6px solid #1976d2',
                boxShadow: 4,
                zIndex: 10,
                mb: {
                    xs: 2,
                    md: 0
                }
            }}
        >
            <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                    ¡Recordatorio de turno!
                </Typography>
                <Typography>
                    <CalendarMonthIcon fontSize="small" sx={{ mr: 1 }} />
                    Mañana ({dayjs(turnoProximo.fechaTurno).format('DD/MM')})
                </Typography>
                <Typography>
                    <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                    {turnoProximo.horaTurno.slice(0, 5)} hs para {turnoProximo.especialidad}
                </Typography>
            </CardContent>
        </Card>

    )
}

export default RecordatorioTurno
