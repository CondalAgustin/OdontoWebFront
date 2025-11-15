import {
  Box,
  Typography,
  MenuItem,
  TextField,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoader } from '../context/LoaderContext';

//const API = 'https://localhost:44381/api'
const API_URL = import.meta.env.VITE_API_URL;


const Turnos = () => {
  const [especialidades, setEspecialidades] = useState<any[]>([])
  const [especialidadId, setEspecialidadId] = useState('')
  const [fecha, setFecha] = useState('')
  const [horarios, setHorarios] = useState<string[]>([])
  const [horaSeleccionada, setHoraSeleccionada] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const { setLoading } = useLoader();
  const [dniDialogOpen, setDniDialogOpen] = useState(false)
  const [dni, setDni] = useState('')
  const [paciente, setPaciente] = useState<{ id: number, nombre: string } | null>(null)

  const [auth, setAuth] = useState<any>({})
  const navigate = useNavigate()

  const cargarEspecialidades = async () => {

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/Servicios`)
      const data = await res.json()
      setEspecialidades(data)

    } catch (err) {
      setSnackbar({ open: true, message: 'Error al cargar las especialidades', severity: 'error' })
    } finally {
      setLoading(false);
    }


  }

  const buscarHorarios = async () => {
    if (!fecha) return
    console.log(fecha)
    const res = await fetch(`${API_URL}/Turnos/disponibles?fecha=${fecha}`)
    const data = await res.json()
    setHorarios(data)
  }

  const reservarTurno = async () => {
    if (!especialidadId || !fecha || !horaSeleccionada) return

    try {
      setLoading(true);
      const usuarioIdDestino = esAdminOGerente ? paciente?.id : auth.id

      if (!usuarioIdDestino) {
        setSnackbar({ open: true, message: 'Debe asignar un paciente válido', severity: 'warning' })
        return
      }

      const body = {
        usuarioId: usuarioIdDestino,
        FechaTurno: fecha,
        HoraTurno: horaSeleccionada,
        Estado: 'Confirmado',
        idEspecialidad: especialidadId,
        usuarioRegistroTurnoId: auth.id,
      }

      const res = await fetch(`${API_URL}/Turnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error('Error al reservar turno')

      setSnackbar({ open: true, message: 'Turno reservado con éxito', severity: 'success' })
      setHoraSeleccionada('')
      setPaciente(null)
      setDni('')
      await buscarHorarios()
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al reservar turno', severity: 'error' })
    } finally {
      setLoading(false);
    }
  }

  const buscarPacientePorDni = async () => {
    try {
      const res = await fetch(`${API_URL}/Usuarios/buscarPorDni/${dni}`)
      if (!res.ok) throw new Error('Usuario no encontrado')

      const data = await res.json()
      setPaciente(data)
      setSnackbar({ open: true, message: 'Usuario encontrado', severity: 'success' })
      setDniDialogOpen(false)
    } catch (err) {
      setPaciente(null)
      setSnackbar({ open: true, message: 'Usuario no encontrado con ese DNI', severity: 'error' })
    }
  }

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem('auth') || '{}')
    setAuth(authData)

    if (!authData.token) {
      setSnackbar({ open: true, message: 'Debe iniciar sesión para pedir un turno', severity: 'error' })
      navigate('/login')
    } else {
      cargarEspecialidades()
    }
  }, [])

  const esAdminOGerente = auth.rol === 'admin' || auth.rol === 'gerente'

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center">
        Reservar Turno
      </Typography>

      <TextField
        fullWidth
        select
        label="Especialidad"
        value={especialidadId}
        onChange={(e) => setEspecialidadId(e.target.value)}
        sx={{ mb: 2 }}
      >
        {especialidades.map((esp) => (
          <MenuItem key={esp.id} value={esp.id}>
            {esp.nombre}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        type="date"
        label="Fecha"
        value={fecha}
        onChange={(e) => {
          const nuevaFecha = e.target.value
          const selectedDate = new Date(nuevaFecha)
          const day = selectedDate.getDay()

          if (day === 5 || day === 6) {
            setSnackbar({
              open: true,
              message: 'No se pueden reservar turnos los sábados ni domingos.',
              severity: 'warning',
            })
            return
          }

          setFecha(nuevaFecha)
          setHorarios([])
          setHoraSeleccionada('')
        }}
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
      />

      <Button variant="contained" fullWidth onClick={buscarHorarios} disabled={!fecha}>
        Buscar horarios disponibles
      </Button>

      {esAdminOGerente && (
        <Box sx={{ my: 2 }}>
          <Button variant="outlined" fullWidth onClick={() => setDniDialogOpen(true)}>
            Asignar a otro usuario por DNI
          </Button>
        </Box>
      )}

      {paciente && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Turno será asignado a: <strong>{paciente.nombre}</strong>
        </Alert>
      )}

      {horarios.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Seleccioná un horario:
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" },
              gap: 2,            // equivalente a spacing={2}
              mt: 2,
            }}
          >
            {horarios.map((hora: string) => (
              <Box key={hora}>
                <Button
                  variant={hora === horaSeleccionada ? "contained" : "outlined"}
                  onClick={() => setHoraSeleccionada(hora)}
                  fullWidth
                >
                  {hora.slice(0, 5)} hs
                </Button>
              </Box>
            ))}
          </Box>

          <Button
            sx={{ mt: 3 }}
            variant="contained"
            fullWidth
            disabled={
              !horaSeleccionada ||
              (esAdminOGerente && !paciente)
            }
            onClick={reservarTurno}
          >
            Confirmar turno
          </Button>
        </Box>
      )}

      <Dialog open={dniDialogOpen} onClose={() => setDniDialogOpen(false)}>
        <DialogTitle>Asignar turno a otro usuario</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="DNI del paciente"
            fullWidth
            margin="dense"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDniDialogOpen(false)}>Cancelar</Button>
          <Button onClick={buscarPacientePorDni} variant="contained">Buscar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity as any}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  )
}

export default Turnos
