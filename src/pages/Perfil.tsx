import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/system';
import Snackbar from '@mui/material/Snackbar';
import { useUsuarios } from '../hook/Usuarios';
import MuiAlert from '@mui/material/Alert';
import type { AlertColor } from '@mui/material/Alert';

const ProfileContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  gap: '2rem',
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
  flexWrap: 'wrap',
});

const Section = styled(Paper)(() => ({
  flex: 1,
  padding: '1.5rem',
  minWidth: '300px',
}));

const SectionTitle = styled(Typography)(() => ({
  marginBottom: '1.5rem',
  fontWeight: 'bold',
}));

const FormField = styled(Box)(() => ({
  marginBottom: '1rem',
}));

const Profile = () => {
  const [profileData, setProfileData] = useState({
    nombre: ' ',
    apellido: ' ',
    email: ' ',
    telefono: ' ',
    sexo: ' ',
    dni: ' ',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('info');
  const { cambiarContrasenia, obtenerPerfil , actualizarPerfil } = useUsuarios();

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const Alert = React.forwardRef<HTMLDivElement, any>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const showSnackbar = (message: string, severity: AlertColor = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      showSnackbar('Correo electrónico inválido', 'warning');
      return;
    }

    if (!/^\d+$/.test(profileData.telefono)) {
      showSnackbar('El teléfono debe contener solo números', 'warning');
      return;
    }
    try {
      await actualizarPerfil(profileData)
      showSnackbar('Perfil actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
      showSnackbar('Hubo un problema al actualizar tu perfil', 'error');
    }

  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword.length < 6) {
      showSnackbar('La nueva contraseña debe tener al menos 6 caracteres', 'warning');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showSnackbar('Las contraseñas no coinciden', 'warning');
      return;
    }

    try {
      await cambiarContrasenia({
        contraseniaActual: passwordData.currentPassword,
        nuevaContrasenia: passwordData.newPassword,
        confirmarContrasenia: passwordData.confirmPassword,
      })
      showSnackbar('Contraseña actualizada correctamente', 'success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error)
      const msg = await error?.message || 'Error al cambiar contraseña';
      showSnackbar(msg, 'error');
    }
  }

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const datos = await obtenerPerfil()
        setProfileData(datos)
      } catch (error) {
        console.error('Error al cargar perfil:', error)
      }
    }

    cargarPerfil()
  }, [])


  return (
    <Box>
      <Typography variant="h4" align="center" sx={{ my: 4 }}>
        Mi Perfil
      </Typography>

      <ProfileContainer>
        {/* Datos personales */}
        <Section elevation={3}>
          <SectionTitle variant="h5">Datos personales</SectionTitle>
          <form onSubmit={handleProfileSubmit}>
            <FormField>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={profileData.nombre}
                onChange={handleProfileChange}
              />
            </FormField>

            <FormField>
              <TextField
                fullWidth
                label="Apellido"
                name="apellido"
                value={profileData.apellido}
                onChange={handleProfileChange}
              />
            </FormField>

            <FormField>
              <TextField
                fullWidth
                label="Correo electrónico"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleProfileChange}
              />
            </FormField>

            <FormField>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={profileData.telefono}
                onChange={handleProfileChange}
              />
            </FormField>

            <FormField>
              <TextField
                fullWidth
                select
                label="Sexo"
                name="sexo"
                value={profileData.sexo}
                onChange={handleProfileChange}
              >
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Femenino">Femenino</MenuItem>
                <MenuItem value="Otro">Otro</MenuItem>
              </TextField>
            </FormField>

            <FormField>
              <TextField
                fullWidth
                label="DNI"
                name="dni"
                value={profileData.dni}
                InputProps={{ readOnly: true }}
              />
            </FormField>


            <Button type="submit" variant="contained" fullWidth>
              Guardar cambios
            </Button>
          </form>
        </Section>

        {/* Contraseña */}
        <Section elevation={3}>
          <SectionTitle variant="h5">Cambiar contraseña</SectionTitle>
          <form onSubmit={handlePasswordSubmit}>
            <FormField>
              <TextField
                fullWidth
                label="Contraseña actual"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
            </FormField>

            <FormField>
              <TextField
                fullWidth
                label="Nueva contraseña"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
            </FormField>

            <FormField>
              <TextField
                fullWidth
                label="Confirmar nueva contraseña"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
            </FormField>

            <Button type="submit" variant="outlined" fullWidth>
              Cambiar contraseña
            </Button>
          </form>
        </Section>
      </ProfileContainer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default Profile;
