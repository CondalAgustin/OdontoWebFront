import { Box, Container, Tab, Tabs } from '@mui/material'
import { useState, useEffect } from 'react'
import TurnosList from './Admin/TurnosList'
import UsuariosList from './Admin/UsuariosList'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PanelEstadisticas from './Admin/PanelEstadisticas'
import Especialidades from './Admin/Especialidades'
const Admin = () => {
  const location = useLocation()
  const [tab, setTab] = useState(0)
  const { auth } = useAuth()

  // Mapeamos nombres de tabs a índices
  const tabMapping: Record<string, number> = {
    turnos: 0,
    usuarios: 1,
    estadisticas: 2,
  }

  useEffect(() => {
    const tabName = location.state?.tab
    if (tabName && tabMapping.hasOwnProperty(tabName)) {
      setTab(tabMapping[tabName])
    }
  }, [location.state])

  const handleChange = (_: any, newValue: number) => {
    setTab(newValue)
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '85vh', py: 6 }}>
      <Container>
        {/** Tabs dinámicos según rol */}
        <Tabs
          value={tab}
          onChange={handleChange}
          centered
          TabIndicatorProps={{
            style: { backgroundColor: '#4caf50' },
          }}
          textColor="inherit"
        >
          <Tab label="Turnos" />
          <Tab label="Usuarios" />
          {auth?.rol === 'gerente' && <Tab label="Estadísticas" />}
          {auth?.rol === 'gerente' && <Tab label="Especialidades" />}

        </Tabs>
 
        {tab === 0 && <TurnosList />}
        {tab === 1 && <UsuariosList />}
        {auth?.rol === 'gerente' && tab === 2 && <PanelEstadisticas />}
        {auth?.rol === 'gerente' && tab === 3 && <Especialidades />}


      </Container>

    </Box>
  )
}

export default Admin
