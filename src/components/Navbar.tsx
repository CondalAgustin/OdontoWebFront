import {
  AppBar, Toolbar, Typography, Button, Box, Tooltip, Slide,
  IconButton, Drawer, List, ListItem, ListItemText, Divider
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useAuth } from '../context/AuthContext'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { ListItemButton } from '@mui/material'

const Navbar = () => {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setDrawerOpen(false)
  }

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const renderMenuItems = (
    <>
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/" onClick={() => setDrawerOpen(false)}>
          <ListItemText primary="Inicio" />
        </ListItemButton>
      </ListItem>
      {auth?.rol === 'paciente' || auth?.rol === 'admin' && (
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/perfil" onClick={() => setDrawerOpen(false)}>
            <ListItemText primary="Perfil" />
          </ListItemButton>
        </ListItem>
      )}
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/turnos" onClick={() => setDrawerOpen(false)}>
          <ListItemText primary="Turnos" />
        </ListItemButton>
      </ListItem>

      {auth?.rol === 'paciente' && (
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/misTurnos" onClick={() => setDrawerOpen(false)}>
            <ListItemText primary="Mis turnos" />
          </ListItemButton>
        </ListItem>
      )}

      {(auth?.rol === 'gerente' || auth?.rol === 'admin') && (
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/admin" onClick={() => setDrawerOpen(false)}>
            <ListItemText primary="Admin" />
          </ListItemButton>
        </ListItem>
      )}

      {auth ? (
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      ) : (
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/login" onClick={() => setDrawerOpen(false)}>
            <ListItemText primary="Login" />
          </ListItemButton>
        </ListItem>
      )}

    </>
  )

  return (
    <Slide in direction="down">
      <AppBar position="static" color="primary" sx={{ px: 2 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* IZQUIERDA: Logo + Bienvenida */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MedicalServicesIcon fontSize="large" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              OdontoWeb
            </Typography>
            {!isMobile && auth && (
              <Typography variant="body1" sx={{ ml: 2 }}>
                Bienvenido, {auth.nombre}
              </Typography>
            )}
          </Box>

          {/* CENTRO: MI PERFIL (solo si no es mobile) */}
          {!isMobile && auth && (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <Button
                component={Link}
                to="/perfil"
                sx={{
                  bgcolor: '#fff',
                  color: '#1976d2',
                  px: 3,
                  py: 1,
                  borderRadius: 5,
                  fontWeight: 'bold',
                  boxShadow: 3,
                  '&:hover': {
                    bgcolor: '#e3f2fd',
                    boxShadow: 5,
                  },
                }}
              >
                MI PERFIL
              </Button>
            </Box>
          )}

          {/* DERECHA: Botones en desktop, hamburguesa en mobile */}
          {isMobile ? (
            <IconButton color="inherit" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box>
              <Button color="inherit" component={Link} to="/">
                Inicio
              </Button>
              <Button color="inherit" component={Link} to="/turnos">
                Turnos
              </Button>
              {auth?.rol === 'paciente' && (
                <Button color="inherit" component={Link} to="/misTurnos">
                  Mis turnos
                </Button>
              )}

              {(auth?.rol === 'gerente' || auth?.rol === 'admin') && (
                <Button color="inherit" component={Link} to="/admin">
                  Admin
                </Button>
              )}
              {auth ? (
                <Tooltip title="Cerrar sesión">
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </Tooltip>
              ) : (
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
              )}
            </Box>
          )}
        </Toolbar>

        {/* Drawer (menú lateral para mobile) */}
        <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
          <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
            <List>
              {auth && (
                <ListItem>
                  <Typography variant="subtitle1">
                    Bienvenido, {auth.nombre}
                  </Typography>
                </ListItem>
              )}
              <Divider />
              {renderMenuItems}
            </List>
          </Box>
        </Drawer>
      </AppBar>
    </Slide>
  )
}

export default Navbar
