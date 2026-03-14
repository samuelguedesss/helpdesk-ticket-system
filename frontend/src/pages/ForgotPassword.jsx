import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Link, Paper } from "@mui/material";
import imgLoginn from "../assets/Rectangle140.png";
import imgLogoGrc from "../assets/logoGrc.png";
import { useNavigate } from "react-router-dom";
import apiBackend from '../services/apiBackend';
import AppAlert from "../components/AppAlert";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
    const closeAlert = () => setAlert((prev) => ({ ...prev, open: false }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiBackend.post("/password-reset/request", { email });
            setAlert({ open: true, message: "E-mail de redefinição enviado com sucesso!", severity: "success" });
        } catch (error) {
            const msg = error.response?.data?.message || "Erro ao enviar e-mail. Verifique o endereço informado.";
            setAlert({ open: true, message: msg, severity: "error" });
        } finally {
            setLoading(false);
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
                        position: "relative",
                    }}
                >
                    {/* LOGO */}
                    <Box sx={{ position: "absolute", top: "35px", left: "40px" }}>
                        <img src={imgLogoGrc} width={120} alt="Logo" style={{ opacity: 0.6 }} />
                    </Box>

                    <Typography variant="h5" fontWeight={700} mb={1}>
                        Esqueceu sua senha?
                    </Typography>

                    <Typography variant="body2" sx={{ color: "#808080" }} mb={4}>
                        Informe seu e-mail cadastrado e enviaremos um link para redefinir sua senha.
                    </Typography>

                    <TextField
                        label="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 3, backgroundColor: "#ffffff", border: "1px solid #E2E2E2" }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{
                            backgroundColor: "#2D3E2E",
                            padding: "12px",
                            fontWeight: "bold",
                            "&:hover": { backgroundColor: "#1f2c20" },
                        }}
                    >
                        {loading ? "ENVIANDO..." : "ENVIAR LINK"}
                    </Button>

                    <Box textAlign="center" sx={{ mt: 3 }}>
                        <Link
                            component="button"
                            underline="always"
                            fontSize="0.875rem"
                            sx={{ color: "#808080" }}
                            onClick={() => navigate("/login")}
                        >
                            Voltar para o login
                        </Link>
                    </Box>
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
                        alt="Illustration"
                        sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "26px" }}
                    />
                </Box>
            </Paper>

            <AppAlert open={alert.open} message={alert.message} severity={alert.severity} onClose={closeAlert} />
        </Box>
    );
}