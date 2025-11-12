import React, { useEffect, useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Typography, IconButton, Table, TableBody, TableCell,
  DialogContentText,
  TableHead, TableRow, Paper, Snackbar, Alert,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useEspecialidades } from "../../hook/Especialidades";

interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string;
}

const Especialidades = () => {
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Especialidad | null>(null);
  const [formValues, setFormValues] = useState({ nombre: "", descripcion: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [usuarioSeleccionadoId, setUsuarioSeleccionadoId] = useState<number | null>(null)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)

  const {
    especialidades,
    obtenerEspecialidades,
    crearEspecialidad,
    editarEspecialidad,
    eliminarEspecialidad,
  } = useEspecialidades();

  useEffect(() => {
    obtenerEspecialidades();
  }, []);

  const handleOpen = (esp?: Especialidad) => {
    setEditing(esp || null);
    setFormValues(esp ? { nombre: esp.nombre, descripcion: esp.descripcion } : { nombre: "", descripcion: "" });
    setOpenForm(true);
  };

  const handleClose = () => setOpenForm(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormValues({ ...formValues, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      if (editing) {
        await editarEspecialidad(editing.id, formValues);
        setSnackbar({ open: true, message: "Especialidad actualizada", severity: "success" });
      } else {
        await crearEspecialidad(formValues);
        setSnackbar({ open: true, message: "Especialidad creada", severity: "success" });
      }
      setOpenForm(false);
    } catch {
      setSnackbar({ open: true, message: "Error al guardar", severity: "error" });
    }
  };

  const confirmarEliminacion = async () => {
    if (usuarioSeleccionadoId === null) return
    try {
      await eliminarEspecialidad(usuarioSeleccionadoId)
      setSnackbar({ open: true, message: "Especialidad eliminada", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Error al eliminar", severity: "error" });
    } finally {
      setOpenConfirmDialog(false)
      setUsuarioSeleccionadoId(null)
    }
  };

  const handleEliminar = (id: number) => {
    setUsuarioSeleccionadoId(id)
    setOpenConfirmDialog(true)
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Especialidades</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Agregar especialidad
      </Button>

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

      <Paper sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {especialidades.map((esp) => (
              <TableRow key={esp.id}>
                <TableCell>{esp.nombre}</TableCell>
                <TableCell>{esp.descripcion}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(esp)}><Edit /></IconButton>
                  <IconButton color="error"   onClick={() => handleEliminar(esp.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={openForm} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Editar" : "Agregar"} especialidad</DialogTitle>
        <DialogContent>
          <TextField label="Nombre" name="nombre" fullWidth margin="normal"
            value={formValues.nombre} onChange={handleChange} />
          <TextField label="Descripción" name="descripcion" fullWidth margin="normal"
            multiline rows={3} value={formValues.descripcion} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity as any} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Especialidades;
