import { useState } from 'react'
import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
    MenuItem,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
} from '@mui/material'
import { useUsuarios } from '../hook/Usuarios'


const UsuarioRegistro = () => {
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        passwordHash: '',
        dni: '',
        sexo: '',
    })

    const [loading, setLoading] = useState(false)
    const [successOpen, setSuccessOpen] = useState(false)
    const [errorOpen, setErrorOpen] = useState(false)
    const [validationError, setValidationError] = useState('')
    const { crearUsuario} = useUsuarios();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const validateForm = () => {
        if (
            !form.nombre ||
            !form.apellido ||
            !form.email ||
            !form.telefono ||
            !form.passwordHash ||
            !form.dni ||
            !form.sexo
        ) {
            setValidationError('Todos los campos son obligatorios.')
            return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(form.email)) {
            setValidationError('El email no tiene un formato válido.')
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
            await crearUsuario({ ...form, rolId: 3 })

            setSuccessOpen(true)
            setForm({
                nombre: '',
                apellido: '',
                email: '',
                telefono: '',
                passwordHash: '',
                dni: '',
                sexo: '',
            })
        } catch (error) {
            console.error('Error al registrar usuario:', error)
            setErrorOpen(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', py: 2 }}>
            <Paper sx={{ p: 4, mt: 4 }}>
                <Typography variant="h5" gutterBottom align="center">
                    Registro de Paciente
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
                    <TextField label="Contraseña" name="passwordHash" type="password" fullWidth margin="normal" value={form.passwordHash} onChange={handleChange} />

                    <Box sx={{ position: 'relative', mt: 2 }}>
                        <Button type="submit" variant="contained" fullWidth disabled={loading}>
                            Registrarse
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

            {/* Modal Éxito */}
            <Dialog open={successOpen} onClose={() => setSuccessOpen(false)}>
                <DialogTitle>¡Registro exitoso!</DialogTitle>
                <DialogContent>El paciente se ha registrado correctamente. Ya puede iniciar sesión.</DialogContent>
                <DialogActions>
                    <Button onClick={() => setSuccessOpen(false)}>Aceptar</Button>
                </DialogActions>
            </Dialog>

            {/* Modal Error */}
            <Dialog open={errorOpen} onClose={() => setErrorOpen(false)}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>Hubo un problema al registrar. Intenta nuevamente en unos minutos.</DialogContent>
                <DialogActions>
                    <Button onClick={() => setErrorOpen(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default UsuarioRegistro
