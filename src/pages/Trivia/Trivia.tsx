import { useState, useEffect } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useEspecialidades } from "../../hook/Especialidades.ts";
import TopJugadores from "./TopJugadores.tsx";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTrivia } from "../../hook/TriviaContext.tsx";

type Pregunta = {
  id: number;
  pregunta: string;
  opciones: string[];
  correcta: string;
  dificultad: "facil" | "dificil";
};

const Trivia = () => {
  const [indice, setIndice] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [timer, setTimer] = useState(30);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string | null>(null);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const { preguntasRandom, obtenerPreguntas } = useEspecialidades();
  const { registrarPuntaje } = useTrivia();
  const actual: Pregunta | undefined = preguntasRandom[indice];
  const usuario = JSON.parse(localStorage.getItem("auth") || "{}");
  const [isGuest, setIsGuest] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);

  const reiniciar = () => {
    setIndice(0);
    setPuntaje(0);
    setFinalizado(false);
    setRespuestaSeleccionada(null);
    setRespuestaCorrecta(null);
    setBloqueado(false);
    obtenerPreguntas();
  };

  useEffect(() => {
    console.log("usuario: ", usuario.id)
    if (usuario?.id === undefined) {
      setShowPopup(true);
    }
    obtenerPreguntas();
  }, []);

  useEffect(() => {
    if (respuestaSeleccionada === null) return;

    const t = setTimeout(() => {
      handleSiguiente();
    }, 1000);

    return () => clearTimeout(t);
  }, [respuestaSeleccionada]);

  useEffect(() => {
    if (finalizado || !actual) return;

    setTimer(30);
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setTimeout(() => handleSiguiente(), 0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [indice, finalizado, actual]);

  const handleSiguiente = () => {
    console.log("SE EJECUTO handleSiguiente");
    if (bloqueado) return;       // ⛔ evita doble ejecución
    setBloqueado(true);
    setRespuestaSeleccionada(null);
    setRespuestaCorrecta(null);

    if (indice + 1 < preguntasRandom.length) {
      setIndice((i) => i + 1);
      setBloqueado(false);
    } else {
      setFinalizado(true);

      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

      console.log(usuario)
      if (usuario?.id && isGuest != true) {
        registrarPuntaje(usuario.id, puntaje).then(() => {
          console.log("Puntaje guardado en BD correctamente.");
        });
      } else {
        console.warn("No se encontró usuario logueado, no se registró el puntaje.");
      }
    }
  };

  const handleRespuesta = (opcion: string) => {
    if (!actual || respuestaSeleccionada !== null) return;

    setRespuestaSeleccionada(opcion);

    const correcta = actual.opciones[["A", "B", "C", "D"].indexOf(actual.correcta)];
    const esCorrecta = opcion === correcta;

    setRespuestaCorrecta(esCorrecta);

    if (esCorrecta) {
      setPuntaje(prev => prev + 1);
    }
  };


  if (!actual && !finalizado) {
    return <Typography textAlign="center" mt={5}>Cargando preguntas...</Typography>;
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 5,
        p: 3,
        minHeight: "70vh", // para mantener centrado visualmente
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {!finalizado && (
        <Typography variant="body2" sx={{ mb: 1, color: "gray", textAlign: "center" }}>
          Tiempo restante: {timer}s
        </Typography>
      )}

      <AnimatePresence mode="wait">
        {!finalizado ? (
          <motion.div
            key={indice}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            <Paper
              elevation={4}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 3,
                background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
              }}
            >
              <Typography variant="h5" gutterBottom>
                Pregunta {indice + 1} de {preguntasRandom.length}
              </Typography>
              <Typography variant="h6" sx={{ mb: 3 }}>
                {actual?.pregunta}
              </Typography>

              {actual?.opciones.map((op) => {
                const isSelected = respuestaSeleccionada === op;
                const isCorrect = respuestaCorrecta && isSelected;
                const isWrong = respuestaCorrecta === false && isSelected;

                return (
                  <motion.div
                    key={op}
                    whileTap={{ scale: 0.95 }}
                    animate={
                      isWrong
                        ? { x: [0, -10, 10, -10, 10, 0] }
                        : {}
                    }
                    transition={{ duration: 0.4 }}
                  >
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        mb: 2,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 500,
                        color: isCorrect
                          ? "#2e7d32" // verde suave
                          : isWrong
                            ? "#d32f2f"
                            : "inherit",
                        borderColor: isCorrect
                          ? "#81c784" // verde claro
                          : isWrong
                            ? "#e57373"
                            : "rgba(0,0,0,0.23)",
                        backgroundColor: isCorrect
                          ? "#e8f5e9"
                          : isWrong
                            ? "#ffebee"
                            : "transparent",
                        "&:hover": {
                          backgroundColor: isCorrect
                            ? "#c8e6c9"
                            : isWrong
                              ? "#ffcdd2"
                              : "#f5f5f5",
                        },
                      }}
                      onClick={() => handleRespuesta(op)}
                      disabled={respuestaSeleccionada !== null}
                    >
                      {op}
                      {isCorrect && " 👍"}
                      {isWrong && " ❌"}
                    </Button>
                  </motion.div>
                );
              })}
            </Paper>
          </motion.div>
        ) : (
          <motion.div
            key="resultado"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 3,
                background: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
                boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              <Typography variant="h4" gutterBottom>
                ¡Trivia completada! 🎉
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Tu puntaje: {puntaje} / {preguntasRandom.length}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {puntaje === preguntasRandom.length
                  ? "¡Excelente! Sos un crack de la salud dental 😎"
                  : "Bien hecho, seguí practicando tu sonrisa 😁"}
              </Typography>

              <Button
                variant="contained"
                onClick={reiniciar}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1,
                  textTransform: "none",
                }}
              >
                Jugar de nuevo
              </Button>
            </Box>

            {/* 👇 Componente del ranking debajo del resultado */}
            <TopJugadores jugadorActualPuntaje={puntaje} isGuest={isGuest} />
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showPopup} onClose={() => { }} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700, textAlign: "center" }}>
          ¡Bienvenido a la Trivia! 🎮
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", pb: 1 }}>
          No tenés una sesión activa.
          <br />
          Si querés que tus puntos sumen en el ranking, iniciá sesión.
          <br />
          También podés jugar como invitado.
        </DialogContent>

        <DialogActions sx={{ display: "flex", justifyContent: "space-between", px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setIsGuest(true);
              setShowPopup(false);
            }}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Jugar como invitado
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate("/login")}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Iniciar sesión
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Trivia;
