import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes/AppRouter";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./context/AuthContext"; // ⬅️ ADICIONAR

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, sans-serif",
  }
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider> 
          <AppRouter />
        </AuthProvider> 
      </BrowserRouter>
    </ThemeProvider>
  );
}