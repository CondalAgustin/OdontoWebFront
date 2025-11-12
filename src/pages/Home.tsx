// @ts-ignore
import Slider from 'react-slick'
// @ts-ignore
import AOS from 'aos'
import { useEffect } from 'react'
import { Box, Container, Typography, Button } from '@mui/material'
import imgCarrusel1 from '../assets/imgCarrusel1.jpg'
import imgCarrusel2 from '../assets/imgCarrusel2.jpg'
import imgCarrusel3 from '../assets/imgCarrusel3.jpg'
import implantesDentales from '../assets/implantesDentales.png'
import brackets from '../assets/brackets.jpeg'
import alineadores from '../assets/alineadoresInvisibles.jpeg'
import blancos from '../assets/blancos.jpeg'
import protesis from '../assets/protesis.png'
import preventiva from '../assets/preventiva.png'
import sacarDiente from '../assets/sacarDiente.jpg'
import RecordatorioTurno from '../components/RecordatorioTurno'
import { useAuth } from '../context/AuthContext'


const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 800 })
  }, [])


  const { auth } = useAuth()

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  }

  return (
    <>
      {auth?.rol === 'paciente' && (
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <RecordatorioTurno idUsuario={auth.id} />
        </Box>

      )}
      {/* Carrusel */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 4,
          mb: 6,
          mt: 3,
        }}
      >
        <Box
          sx={{
            width: 400,
            height: 250,
            overflow: 'hidden',
            borderRadius: 2,
            flexShrink: 0,
            ml: { xs: 0, md: 0 },
          }}
        >
          <Slider {...sliderSettings}>
            {[imgCarrusel1, imgCarrusel2, imgCarrusel3].map((img, idx) => (
              <Box
                key={idx}
                sx={{ width: '100%', height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <img src={img} alt={`slide-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </Box>
            ))}
          </Slider>
        </Box>

        <Container maxWidth="lg" sx={{ flex: 1 }}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" data-aos="fade-up">Bienvenido a OdontoWeb</Typography>
            <Typography variant="body1" data-aos="fade-up" data-aos-delay="400" sx={{ mt: 2 }}>
              Atención profesional, tecnología de última generación y un compromiso con tu sonrisa.
            </Typography>
            <Button variant="contained" color="primary" size="large" sx={{ mt: 4 }} href="/turnos" data-aos="zoom-in">
              Sacar turno
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Servicios visuales */}
      <Box sx={{ backgroundColor: '#f9f9f9', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" data-aos="fade-right" sx={{ mb: 4, textAlign: 'center' }}>
            Nuestros servicios
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
            {[{ titulo: 'Implantes dentales', descripcion: 'Reposición de piezas mediante cirugía con implantes de titanio. Comodidad y naturalidad.', imagen: implantesDentales },
            { titulo: 'Ortodoncia & Ortopedia', descripcion: 'Brackets metálicos y estéticos. Tratamientos fijos y removibles de última generación.', imagen: brackets },
            { titulo: 'Alineadores Invisibles', descripcion: 'Placas transparentes que corrigen tu sonrisa sin molestias. Alternativa moderna a los brackets.', imagen: alineadores },
            { titulo: 'Blanqueamiento Dental', descripcion: 'Tratamiento estético para aclarar varios tonos el color original de los dientes.', imagen: blancos },
            { titulo: 'Prótesis Fijas y Removibles', descripcion: 'Reposición inmediata de piezas dentales perdidas. Soluciones estéticas y funcionales.', imagen: protesis },
            { titulo: 'Odontología preventiva', descripcion: 'La higiene bucal meticulosa y las visitas regulares al dentista son esenciales para garantizar nuestra salud bucodental.', imagen: preventiva },
            ].map((servicio, index) => (
              <Box
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                sx={{ width: 300, borderRadius: 3, overflow: 'hidden', boxShadow: 3, backgroundColor: '#fff', transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.02)' } }}
              >
                <img src={servicio.imagen} alt={servicio.titulo} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" color="primary" gutterBottom>{servicio.titulo}</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>{servicio.descripcion}</Typography>
                  <Button variant="contained" color="success" size="small">Ver más</Button>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Card destacada ocupando ancho completo */}
          <Box
            data-aos="fade-up"
            sx={{ mt: 6, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'center', boxShadow: 3, p: 3, borderRadius: 3, backgroundColor: '#fff' }}
          >
            <Box sx={{ flex: 1 }}>
              <img
                src={sacarDiente}
                alt="Destacado"
                style={{ width: '100%', maxHeight: 250, objectFit: 'cover', borderRadius: 8 }}
              />
            </Box>
            <Box sx={{ flex: 2 }}>
              <Typography variant="h5" gutterBottom>Sacamos dientes a las piñas</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                No tengas miedo, nuestros expertos se aseguran de que no te duela, vivas la mejor experiencia y de forma agradable
              </Typography>
              <Button variant="contained" color="success">Ver más</Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default Home
