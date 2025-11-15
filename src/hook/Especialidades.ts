// src/hooks/useEspecialidades.ts
import { useState } from "react";
import { useLoader } from "../context/LoaderContext";

const API_URL = import.meta.env.VITE_API_URL;

export const useEspecialidades = () => {
  const [especialidades, setEspecialidades] = useState<any[]>([]);
  const [preguntasRandom, setPreguntasRandom] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ranking, setRanking] = useState<any[]>([]);
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

  const registrarPuntaje = async (usuarioid: number, puntaje: number) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/Servicios/registrarPuntaje`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioid, puntaje }),
      });

      if (!res.ok) throw new Error("Error al registrar puntaje");
      const data = await res.json();
      await obtenerTopJugadores();
      return data;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const obtenerTopJugadores = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/Servicios/topJugadores`);
      if (!res.ok) throw new Error("Error al obtener el top de jugadores");

      const data = await res.json();
      setRanking(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  const obtenerPreguntas = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/Servicios/obtenerPreguntas`);
      const data = await res.json();
      setPreguntasRandom(data);
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
    ranking,
    preguntasRandom,
    obtenerEspecialidades,
    registrarPuntaje,
    obtenerTopJugadores,
    obtenerPreguntas,
    crearEspecialidad,
    editarEspecialidad,
    eliminarEspecialidad,
  };
};
