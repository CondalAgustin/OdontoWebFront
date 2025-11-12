import {
  Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, Box
} from '@mui/material'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

//const API = 'https://localhost:44381/api'
const API_URL = import.meta.env.VITE_API_URL;

const TurnosList = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Dayjs | null>(dayjs())
  const [turnos, setTurnos] = useState<any[]>([])

  const obtenerTurnos = async (fecha: Dayjs) => {
    try {
      const res = await fetch(`${API_URL}/Turnos/por-fecha?fecha=${fecha.format('YYYY-MM-DD')}`)

      if (!res.ok) {
        console.error("Error al obtener turnos:", res.status, res.statusText)
        setTurnos([]) // evita romper si hay error 500 o similar
        return
      }

      const data = await res.json()

      // aseguramos que sea array
      if (Array.isArray(data)) {
        setTurnos(data)
      } else {
        setTurnos([])
      }

    } catch (error) {
      console.error("Error en fetch turnos:", error)
      setTurnos([])
    }
  }


  useEffect(() => {
    if (fechaSeleccionada) {
      obtenerTurnos(fechaSeleccionada)
    }
  }, [fechaSeleccionada])

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h5" gutterBottom align="center">
        Turnos por día
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          alignItems: 'flex-start',
          justifyContent: 'center',
          mt: 4,
        }}
      >
        {/* Calendario */}
        <Paper elevation={4} sx={{ p: 2, width: 350 }}>
          <Typography variant="body2" gutterBottom align="center">
            Seleccioná la fecha que querés visualizar:
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={fechaSeleccionada}
              onChange={(newDate) => setFechaSeleccionada(newDate)}
            />
          </LocalizationProvider>
        </Paper>

        {/* Tabla */}
        <Paper elevation={4} sx={{ p: 3, flex: 1 }}>
          <Typography variant="h6" gutterBottom align="center">
            Turnos del {fechaSeleccionada?.format('DD/MM/YYYY')}
          </Typography>

          {turnos.length === 0 ? (
            <Typography align="center">No hay turnos para esta fecha.</Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>DNI</TableCell>
                    <TableCell>Paciente</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Teléfono</TableCell>
                    <TableCell>Especialidad</TableCell>
                    <TableCell>Hora</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {turnos?.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.pacienteDni}</TableCell>
                      <TableCell>{t.pacienteNombre}</TableCell>
                      <TableCell>{t.pacienteEmail}</TableCell>
                      <TableCell>{t.pacienteTelefono}</TableCell>
                      <TableCell>{t.especialidad}</TableCell>
                      <TableCell>{t.horaTurno}</TableCell>
                      <TableCell>{t.estado}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </Container>
  )


}

export default TurnosList
