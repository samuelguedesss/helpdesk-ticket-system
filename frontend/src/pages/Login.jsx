import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Link, InputAdornment, IconButton, Paper } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import imgLoginn from "../assets/Rectangle140.png";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useNavigate } from "react-router-dom";
import apiBackend from '../services/apiBackend';
import AppAlert from "../components/AppAlert";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const closeAlert = () => {
        setAlert((prev) => ({ ...prev, open: false }));
    };

    /* 🔔 ALERT STATE */
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const handleLogin = async (e) => {
        e.preventDefault();

        /* 🔔 ALERT FUNCTIONS */
        const showAlert = (message, severity = "success") => {
            setAlert({
                open: true,
                message,
                severity,
            });
        };

        try {
            const response = await apiBackend.post("/login", { email, password });
            const data = response.data;

            if (data.token) {
                login(data.token.token); // ⬅️ MUDOU AQUI
                showAlert("Login realizado com sucesso!", "success");
                setTimeout(() => {
                    navigate("/");
                }, 500);
            } else {
                showAlert("Erro ao fazer login: Credenciais inválidas.", "error");
            }
        } catch (error) {
            // Captura erros do backend (401, 400, 500, etc.)
            const errorMessage = error.response?.data?.mensagem || "Erro ao fazer login. Verifique suas credenciais.";
            showAlert(errorMessage, "error");
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                background: "linear-gradient(120deg, #d8d6c7, #f5f5f5)",
                justifyContent: "center",
                alignItems: "center",
                padding: 2,
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    width: "90%",
                    maxWidth: "1100px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    display: "flex",
                }}
            >

                <Box
                    sx={{
                        flex: 1,
                        padding: "50px 60px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        backgroundColor: "#FFFFFF",
                        position: "relative"
                    }}
                >

                    {/* LOGO */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: "25px",
                            left: "30px",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            opacity: 0.7,
                        }}
                    >
                        <SupportAgentIcon sx={{ fontSize: 32, color: "#2F3A32" }} />
                        <Typography fontWeight={700} fontSize={16} color="#2F3A32">HelpDesk</Typography>
                    </Box>

                    <Typography variant="h5" fontWeight={700} mb={1}>
                        Bem-vindo(a) de volta!
                    </Typography>

                    <Typography variant="body2" sx={{ color: "#808080" }} mb={4}>
                        Por favor, insira os dados de login abaixo.
                    </Typography>

                    {/* Email */}
                    <TextField
                        label="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2, backgroundColor: "#ffffff", border: "1px solid #E2E2E2" }}
                    />

                    {/* Senha */}
                    <TextField
                        label="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        variant="outlined"
                        type={showPassword ? "text" : "password"}
                        sx={{ mb: 1, backgroundColor: "#ffffff", border: "1px solid #E2E2E2" }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Box textAlign="right" sx={{ mb: 3 }}>
                        <Link
                            component="button"
                            underline="always"
                            fontSize="0.875rem"
                            sx={{ color: "#808080" }}
                            onClick={() => navigate("/forgot-password")}
                        >
                            Esqueceu a senha?
                        </Link>
                    </Box>

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleLogin}
                        sx={{
                            backgroundColor: "#2D3E2E",
                            padding: "12px",
                            fontWeight: "bold",
                            "&:hover": { backgroundColor: "#1f2c20" },
                        }}
                    >
                        ENTRAR
                    </Button>
                </Box>

                <Box
                    sx={{
                        width: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "26px",
                        borderRadius: "0 20px 20px 0",
                    }}
                >
                    <Box
                        component="img"
                        src={imgLoginn}
                        alt="Login Illustration"
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "26px",
                        }}
                    />
                </Box>
            </Paper>

            <AppAlert
                open={alert.open}
                message={alert.message}
                severity={alert.severity}
                onClose={closeAlert}
            />
        </Box>
    );
}
