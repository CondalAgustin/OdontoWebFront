import { useState } from 'react'
import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ArrowBack } from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import { useUsuarios } from '../../hook/Usuarios'

const UsuarioCrearAdmin = () => {
    const navigate = useNavigate()
    const { auth } = useAuth()
    const { crearUsuario } = useUsuarios();

    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        dni: '',
        sexo: '',
        rol: 'Paciente',
        passwordHash: '',
    })


    const [loading, setLoading] = useState(false)
    const [successDialogOpen, setSuccessDialogOpen] = useState(false)
    const [errorDialogOpen, setErrorDialogOpen] = useState(false)
    const [validationError, setValidationError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const validateForm = () => {
        if (
            !form.nombre ||
            !form.apellido ||
            !form.email ||
            !form.telefono ||
            !form.dni ||
            !form.sexo ||
            !form.passwordHash
        ) {
            setValidationError('Todos los campos son obligatorios.')
            return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(form.email)) {
            setValidationError('El email no tiene un formato válido.')
            return false
        }

        if (!/^\d{7,8}$/.test(form.dni)) {
            setValidationError('El DNI debe tener entre 7 y 8 dígitos.')
            return false
        }

        setValidationError('')
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)

        try {
            const rolId = form.rol === 'Paciente' ? 3 : 2

            const usuarioParaEnviar = {
                ...form,
                rolId,            // <- Se agrega como número
                rol: undefined    // <- Opcional: si el backend no acepta "rol", lo eliminás
            }

            await crearUsuario(usuarioParaEnviar)

            setSuccessDialogOpen(true)
            setForm({
                nombre: '',
                apellido: '',
                email: '',
                telefono: '',
                dni: '',
                sexo: '',
                rol: 'Paciente',
                passwordHash: '',
            })

        } catch (error) {
            console.error('Error al crear usuario:', error)
            setErrorDialogOpen(true)
        } finally {
            setLoading(false)
        }
    }


    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', py: 2 }}>
            <Paper sx={{ p: 4, mt: 4 }}>
                <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate('/admin', { state: { tab: 'usuarios' } })}
                    sx={{ mb: 2 }}>
                    Volver a la lista
                </Button>
                <Typography variant="h6" gutterBottom>
                    Crear nuevo usuario
                </Typography>

                {validationError && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        {validationError}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField label="Nombre" name="nombre" fullWidth margin="normal" value={form.nombre} onChange={handleChange} />
                    <TextField label="Apellido" name="apellido" fullWidth margin="normal" value={form.apellido} onChange={handleChange} />
                    <TextField label="Email" name="email" type="email" fullWidth margin="normal" value={form.email} onChange={handleChange} />
                    <TextField label="Teléfono" name="telefono" fullWidth margin="normal" value={form.telefono} onChange={handleChange} />
                    <TextField label="DNI" name="dni" fullWidth margin="normal" value={form.dni} onChange={handleChange} />

                    <TextField
                        select
                        label="Sexo"
                        name="sexo"
                        fullWidth
                        margin="normal"
                        value={form.sexo}
                        onChange={handleChange}
                    >
                        <MenuItem value="Masculino">Masculino</MenuItem>
                        <MenuItem value="Femenino">Femenino</MenuItem>
                        <MenuItem value="Otro">Otro</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="Rol"
                        name="rol"
                        fullWidth
                        margin="normal"
                        value={form.rol}
                        onChange={handleChange}
                    >
                        <MenuItem value="Paciente">Paciente</MenuItem>
                        {auth?.rol === 'gerente' && (
                            <MenuItem value="admin">Admin</MenuItem>
                        )}
                    </TextField>

                    <TextField label="Contraseña" name="passwordHash" type="password" fullWidth margin="normal" value={form.passwordHash} onChange={handleChange} />

                    <Box sx={{ position: 'relative', mt: 2 }}>
                        <Button type="submit" variant="contained" fullWidth disabled={loading}>
                            Crear
                        </Button>
                        {loading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                            />
                        )}
                    </Box>
                </Box>
            </Paper>

            {/* Modal de éxito */}
            <Dialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
                <DialogTitle>¡Éxito!</DialogTitle>
                <DialogContent>El usuario se ha creado correctamente.</DialogContent>
                <DialogActions>
                    <Button onClick={() => setSuccessDialogOpen(false)}>Aceptar</Button>
                </DialogActions>
            </Dialog>

            {/* Modal de error */}
            <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>Hubo un problema al crear el usuario. Intenta más tarde.</DialogContent>
                <DialogActions>
                    <Button onClick={() => setErrorDialogOpen(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default UsuarioCrearAdmin
