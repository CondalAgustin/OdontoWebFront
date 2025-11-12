import { useState } from "react";
import { useLoader } from "../context/LoaderContext";

const API_URL = import.meta.env.VITE_API_URL;

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { setLoading } = useLoader();

  const obtenerUsuarios = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/Usuarios?incluirInactivos=true`);
      if (!response.ok) throw new Error("Error al obtener usuarios");
      const data = await response.json();
      setUsuarios(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/Usuarios/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar usuario");
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reactivarUsuario = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/Usuarios/reactivar/${id}`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Error al reactivar usuario");
      obtenerUsuarios();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const crearUsuario = async (usuario: any) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/Usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      });

      const text = await response.text();
      if (!response.ok) throw new Error(text || "Error al crear usuario");

      obtenerUsuarios();
    } catch (err: any) {
      setError(err.message);
      throw err; // para poder mostrar snackbar arriba
    } finally {
      setLoading(false);
    }
  };

  const obtenerPerfil = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;

      const response = await fetch(`${API_URL}/Usuarios/perfil`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al obtener perfil");

      return await response.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const actualizarPerfil = async (datos: any) => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;

      const response = await fetch(`${API_URL}/Usuarios/perfilActualizar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      if (!response.ok) throw new Error("Error al actualizar el perfil");
      return await response.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cambiarContrasenia = async (data: any) => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;

      const response = await fetch(`${API_URL}/Usuarios/cambiarContrasenia`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Error al cambiar contraseña");
      return await response.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    usuarios,
    error,
    obtenerUsuarios,
    eliminarUsuario,
    reactivarUsuario,
    crearUsuario,
    obtenerPerfil,
    actualizarPerfil,
    cambiarContrasenia,
  };
};
