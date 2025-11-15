// src/components/TopJugadores.tsx
import { useEffect, useState } from "react";
import { Box, Typography, Paper, Avatar, Divider, Chip } from "@mui/material";
import { motion } from "framer-motion";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import confetti from "canvas-confetti";
import { useTrivia } from "../../hook/TriviaContext";

type Jugador = {
    usuarioid: number;
    nombre: string;
    apellido: string;
    puntaje: number;
};

interface Props {
    jugadorActualPuntaje?: number;
    isGuest?: boolean;
}

const TopJugadores = ({ jugadorActualPuntaje, isGuest }: Props) => {
    const [isTop3, setIsTop3] = useState(false);
    const { obtenerTopJugadores, ranking } = useTrivia();


    useEffect(() => {
        obtenerTopJugadores();
    }, []);

    useEffect(() => {
        if (isGuest) {
            setIsTop3(false); // Nunca entra al top3
            return;
        }

        if (ranking.length > 0 && typeof jugadorActualPuntaje === "number") {
            const combinado: Jugador[] = [
                ...ranking,
                { usuarioid: -1, nombre: "Tú", apellido: "", puntaje: jugadorActualPuntaje },
            ];

            combinado.sort((a, b) => b.puntaje - a.puntaje);
            const posicion = combinado.findIndex((el) => el.usuarioid === -1);
            const entroTop3 = posicion >= 0 && posicion < 3;
            setIsTop3(entroTop3);
        }
    }, [ranking, jugadorActualPuntaje, isGuest]);

    useEffect(() => {
        if (isTop3) {
            confetti({
                particleCount: 200,
                spread: 90,
                origin: { y: 0.7 },
                colors: ["#FFD700", "#C0C0C0", "#CD7F32"],
            });
        }
    }, [isTop3]);

    const getMedalColor = (index: number) => {
        if (index === 0) return "#FFD700";
        if (index === 1) return "#C0C0C0";
        if (index === 2) return "#CD7F32";
        return "#9e9e9e";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
        >
            <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        width: "100%",
                        maxWidth: 520,
                        background: "linear-gradient(145deg, #ffffff, #f3f6f9)",
                        boxShadow: isTop3 ? "0 12px 30px rgba(255,215,0,0.08)" : "0 8px 20px rgba(0,0,0,0.06)",
                        border: isTop3 ? "1px solid rgba(255,193,7,0.15)" : undefined,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: "#1976d2" }}>
                            🏆 Top 10 Jugadores
                        </Typography>

                        {isTop3 && (
                            <Chip
                                label="¡Entraste al Top 3! 🎉"
                                color="warning"
                                sx={{ fontWeight: 700 }}
                            />
                        )}
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {ranking.length === 0 && (
                        <Typography textAlign="center" color="text.secondary">
                            No hay jugadores registrados aún.
                        </Typography>
                    )}

                    {ranking.map((j: Jugador, i: number) => {
                        // animación de entrada escalonada y pequeño pulso para los 3 primeros
                        const avatarVariants = {
                            initial: { scale: 1 },
                            pulse: { scale: [1, 1.06, 1], transition: { duration: 1.2, repeat: Infinity } },
                        };

                        return (
                            <motion.div
                                key={`${j.usuarioid}-${i}`}
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.08 }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        p: 1.25,
                                        borderRadius: 2,
                                        mb: 1,
                                        backgroundColor: i < 3 ? "rgba(25,118,210,0.06)" : "rgba(0,0,0,0.02)",
                                        "&:hover": { transform: "translateY(-3px)" },
                                    }}
                                >
                                    <motion.div
                                        variants={avatarVariants}
                                        animate={i < 3 ? "pulse" : "initial"}
                                        style={{ marginRight: 12, display: "inline-block" }}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: getMedalColor(i),
                                                color: "white",
                                                width: 44,
                                                height: 44,
                                                fontSize: 18,
                                            }}
                                        >
                                            {i + 1}
                                        </Avatar>
                                    </motion.div>

                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography sx={{ fontWeight: 600 }}>
                                            {j.nombre} {j.apellido}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Puntaje: {j.puntaje}
                                        </Typography>
                                    </Box>

                                    {i < 3 && <EmojiEventsIcon sx={{ color: getMedalColor(i), ml: 1 }} />}
                                </Box>
                            </motion.div>
                        );
                    })}
                </Paper>
            </Box>
        </motion.div>
    );
};

export default TopJugadores;
