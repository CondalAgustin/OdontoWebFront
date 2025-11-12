import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  InputAdornment,

} from '@mui/material'
import { AccountCircle, Lock } from '@mui/icons-material'
import { useEffect, useState } from 'react'
// @ts-ignore
import AOS from 'aos'
import { useNavigate } from 'react-router-dom'
import CustomSnackbar from '../components/CustomSnackbar'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { CircularProgress } from '@mui/material'

const Login = () => {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [snack, setSnack] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'info' | 'warning',
  })
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    AOS.init({ duration: 800 })
  }, [])

  const handleLogin = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: usuario,
          passwordHash: password,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText)
      }

      const data = await response.json()
      login(data)
      setSnack({ open: true, message: '¡Bienvenido!', severity: 'success' })
      setTimeout(() => navigate('/'), 200)
    } catch (err: any) {
      const mensaje = err.message?.includes('dado de baja')
        ? err.message
        : 'Error al iniciar sesión. Verifique sus credenciales.'

      setSnack({
        open: true,
        message: mensaje,
        severity: 'error',
      })
    } finally {
      setLoading(false)
    }
  }


  return (
    <Box
      sx={{
        height: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <Paper
        elevation={6}
        data-aos="zoom-in"
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 4,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.75)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
        }}
      >
        <Typography
          variant="h4"
          sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold' }}
        >
          Iniciar sesión
        </Typography>

        <TextField
          label="Usuario"
          fullWidth
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleLogin}
            sx={{
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: 3,
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            Entrar
          </Button>
        )}

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          ¿No tenés cuenta?{' '}
          <Link to="/UsuarioRegistro" style={{ color: '#4caf50', fontWeight: 'bold' }}>
            Registrate gratis
          </Link>
        </Typography>
      </Paper>

      <CustomSnackbar
        open={snack.open}
        onClose={() => setSnack({ ...snack, open: false })}
        message={snack.message}
        severity={snack.severity}
      />
    </Box>
  )
}

export default Login
