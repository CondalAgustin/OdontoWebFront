import { CircularProgress, Box } from "@mui/material";
import { useLoader } from "../context/LoaderContext";

const Loader = () => {
  const { loading } = useLoader();

  if (!loading) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 2000,
      }}
    >
      <CircularProgress size={70} sx={{ color: "white" }} />
    </Box>
  );
};

export default Loader;
