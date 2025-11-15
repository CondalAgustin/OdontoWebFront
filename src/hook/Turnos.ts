import { useState } from "react";
import { useLoader } from "../context/LoaderContext";

const API_URL = import.meta.env.VITE_API_URL;

 export const useTurnos = () => {
  const { setLoading } = useLoader();
  const [turnos, setTurnos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const obtenerMisTurnos = async (idUsuario: number) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/Turnos/mis-turnos/${idUsuario}`);
      if (!res.ok) throw new Error("Error al obtener turnos");
      const data = await res.json();
      setTurnos(data); // 👈 usamos un solo estado
      return data;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const obtenerHistorialTurnos = async (idUsuario: number) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/Turnos/historial-turnos/${idUsuario}`);
      if (!res.ok) throw new Error("Error al obtener historial");
      const data = await res.json();
      setTurnos(data); // 👈 actualizamos el mismo estado
      return data;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelarTurno = async (idTurno: number) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/Turnos/cancelar/${idTurno}`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("No se pudo cancelar el turno");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    turnos,
    error,
    obtenerMisTurnos,
    obtenerHistorialTurnos,
    cancelarTurno,
  };
};

