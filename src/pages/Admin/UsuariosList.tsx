import { useEffect, useState } from 'react'
import {
  Box,
  Paper,
  Table,
  Container,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Fab,
  Stack,
  Switch,
  FormControlLabel,
} from '@mui/material'
import { Edit, Delete, Add, Restore } from '@mui/icons-material'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useUsuarios } from "../../hook/Usuarios";


const UsuariosList = () => {
  //const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [mostrarActivos, setMostrarActivos] = useState(true)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [usuarioSeleccionadoId, setUsuarioSeleccionadoId] = useState<number | null>(null)
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false)
  const { auth } = useAuth()

  const navigate = useNavigate()
  const { usuarios, obtenerUsuarios, eliminarUsuario, reactivarUsuario } = useUsuarios();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        await obtenerUsuarios()
      } catch (error) {
        console.error('Error al obtener usuarios:', error)
      }
    }

    fetchUsuarios()
  }, [])

  const handleEditar = (id: number) => {
    console.log(`Editar usuario con ID: ${id}`)
  }

  const handleEliminar = (id: number) => {
    setUsuarioSeleccionadoId(id)
    setOpenConfirmDialog(true)
  }

  const confirmarEliminacion = async () => {
    if (usuarioSeleccionadoId === null) return

    try {
      await eliminarUsuario(usuarioSeleccionadoId)
      await obtenerUsuarios()
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
    } finally {
      setOpenConfirmDialog(false)
      setUsuarioSeleccionadoId(null)
    }
  }

  const handleRestaurar = (id: number) => {
    setUsuarioSeleccionadoId(id)
    setOpenRestoreDialog(true)
  }

  const confirmarRestauracion = async () => {
    if (usuarioSeleccionadoId === null) return

    try {
      await reactivarUsuario(usuarioSeleccionadoId)
    } catch (error) {
      console.error('Error al reactivar usuario:', error)
    } finally {
      setOpenRestoreDialog(false)
      setUsuarioSeleccionadoId(null)
    }
  }

  const handleAgregar = () => {
    navigate('/admin/usuarioCrearAdmin')
  }

  const usuariosFiltrados = usuarios.filter((u) => u.estaActivo === mostrarActivos)

  return (
    <Box sx={{ position: 'relative' }}>
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirmar baja</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas dar de baja a este usuario? Podrás reactivarlo luego si lo deseas.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={confirmarEliminacion} color="error" variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openRestoreDialog}
        onClose={() => setOpenRestoreDialog(false)}
      >
        <DialogTitle>Confirmar activación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Deseás reactivar a este usuario? Volverá a estar disponible en el sistema.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRestoreDialog(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={confirmarRestauracion} color="success" variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <Container sx={{ py: 6, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }} data-aos="fade-up">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Usuarios registrados</Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={mostrarActivos}
                  onChange={() => setMostrarActivos(!mostrarActivos)}
                  color="success"
                />
              }
              label={mostrarActivos ? 'Activos' : 'Inactivos'}
            />
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>DNI</TableCell>
                  <TableCell>Sexo</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Fecha de creación</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuariosFiltrados.map((usuario) => {
                  const puedeEditarODarDeBaja =
                    auth?.rol === 'gerente' || (auth?.rol === 'admin' && usuario.rol === 'paciente')

                  return (
                    <TableRow key={usuario.id}>
                      <TableCell>{usuario.nombre}</TableCell>
                      <TableCell>{usuario.dni}</TableCell>
                      <TableCell>{usuario.sexo}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>{usuario.telefono}</TableCell>
                      <TableCell>{usuario.fechaRegistro}</TableCell>
                      <TableCell>{usuario.rol}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" justifyContent="center" spacing={1}>
                          {mostrarActivos ? (
                            puedeEditarODarDeBaja && (
                              <>
                                <IconButton color="primary" onClick={() => handleEditar(usuario.id)}>
                                  <Edit />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleEliminar(usuario.id)}>
                                  <Delete />
                                </IconButton>
                              </>
                            )
                          ) : (
                            <IconButton color="success" onClick={() => handleRestaurar(usuario.id)}>
                              <Restore />
                            </IconButton>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Fab
          color="primary"
          onClick={handleAgregar}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <Add />
        </Fab>
      </Container>
    </Box>
  )
}

export default UsuariosList
