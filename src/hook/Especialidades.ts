// src/hooks/useEspecialidades.ts
import { useState } from "react";
import { useLoader } from "../context/LoaderContext";

const API_URL = import.meta.env.VITE_API_URL;

export const useEspecialidades = () => {
  const [especialidades, setEspecialidades] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { setLoading } = useLoader();

  const obtenerEspecialidades = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/Servicios`);
      const data = await res.json();
      setEspecialidades(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const crearEspecialidad = async (data: { nombre: string; descripcion: string }) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/Servicios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error al crear especialidad");
      await obtenerEspecialidades();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const editarEspecialidad = async (id: number, data: { nombre: string; descripcion: string }) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/Servicios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error al editar especialidad");
      await obtenerEspecialidades();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const eliminarEspecialidad = async (id: number) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/Servicios/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar especialidad");
      await obtenerEspecialidades();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    especialidades,
    error,
    obtenerEspecialidades,
    crearEspecialidad,
    editarEspecialidad,
    eliminarEspecialidad,
  };
};
