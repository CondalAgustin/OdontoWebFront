// src/context/TriviaContext.tsx
import { createContext, useContext, useState } from "react";
import { useLoader } from "../context/LoaderContext";

const API_URL = import.meta.env.VITE_API_URL;

type Jugador = {
  usuarioid: number;
  nombre: string;
  apellido: string;
  puntaje: number;
};

type TriviaContextType = {
  ranking: Jugador[];
  obtenerTopJugadores: () => Promise<void>;
  registrarPuntaje: (usuarioid: number, puntaje: number) => Promise<void>;
};

const TriviaContext = createContext<TriviaContextType | null>(null);

export const TriviaProvider = ({ children }: { children: React.ReactNode }) => {
  const [ranking, setRanking] = useState<Jugador[]>([]);
  const { setLoading } = useLoader();

  const obtenerTopJugadores = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/Servicios/topJugadores`);
      const data = await res.json();
      setRanking(data);
    } catch (err) {
      console.error("Error cargando ranking:", err);
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

      // 🔥 Después de registrar ACTUALIZAMOS el ranking global
      await obtenerTopJugadores();
    } catch (err) {
      console.error("Error registrando puntaje:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TriviaContext.Provider
      value={{
        ranking,
        obtenerTopJugadores,
        registrarPuntaje,
      }}
    >
      {children}
    </TriviaContext.Provider>
  );
};

// Hook para usar el contexto fácilmente
export const useTrivia = () => {
  const context = useContext(TriviaContext);
  if (!context) {
    throw new Error("useTrivia debe usarse dentro de TriviaProvider");
  }
  return context;
};
