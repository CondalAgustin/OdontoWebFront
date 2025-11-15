// src/components/Footer.tsx
import { Box, Container, Typography, IconButton, Stack } from '@mui/material'
import { Facebook, Instagram, YouTube, WhatsApp, GitHub } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import logo from '../assets/Logo.png'

const Footer = () => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
        py: 2,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* Logo + Nombre */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <img
              src={logo}
              alt="Logo"
              style={{ height: 40 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              OdontoWeb
            </Typography>
          </Stack>

          {/* Redes sociales */}
          <Stack direction="row" spacing={2}>
            <IconButton href="#" target="_blank" sx={{ color: 'white' }}>
              <Facebook />
            </IconButton>
            <IconButton href="#" target="_blank" sx={{ color: 'white' }}>
              <Instagram />
            </IconButton>
            <IconButton href="#" target="_blank" sx={{ color: 'white' }}>
              <YouTube />
            </IconButton>
            <IconButton
              href="https://wa.me/541151153162"
              target="_blank"
              sx={{ color: 'white' }}
            >
              <WhatsApp />
            </IconButton>
          </Stack>
        </Box>

        <Typography
          variant="body2"
          sx={{ textAlign: 'center', mt: 0, opacity: 0.8 }}
        >
          Nicolás A. Condal © - 2025 OdontoWeb. Todos los derechos reservados.
        </Typography>
        <Typography
          variant="body2"
          sx={{ textAlign: 'center', mt: 0.5, opacity: 0.85, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}
        >
          Consultas para tus proyectos ➟
          <IconButton
            href="https://github.com/CondalAgustin"
            target="_blank"
            sx={{ color: 'white', padding: 0, fontSize: 16 }}
          >
            <GitHub />
          </IconButton>
        </Typography>

      </Container>
    </Box>
  )
}

export default Footer
