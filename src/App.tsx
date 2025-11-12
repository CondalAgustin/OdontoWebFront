// src/App.tsx
import './App.css'
import Navbar from './components/Navbar'
import AppRoutes from './routes/AppRoutes'
import Footer from './components/Footer'
import { Box, CssBaseline } from '@mui/material'
import Loader from './components/Loader'

function App() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <CssBaseline /> {/* Asegura estilos base y reseteo limpio */}
      <Navbar />
      
      <Box component="main" sx={{ flex: 1 }}>
        <AppRoutes />
      </Box>
        <Loader />
      <Footer />
    </Box>
  )
}

export default App
