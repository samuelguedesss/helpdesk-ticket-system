import React, { useState } from "react";
import { Box, Button, TextField, Typography, Link, Paper } from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useNavigate } from "react-router-dom";
import apiBackend from "../services/apiBackend";
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
                background: "#2F3A32",
                justifyContent: "center",
                alignItems: "center",
                padding: 2,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: "95%",
                    maxWidth: "460px",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                    backgroundColor: "#fff",
                    padding: { xs: "36px 28px", md: "44px 40px" },
                }}
            >
                <Box
                    sx={{
                        width: 52,
                        height: 52,
                        borderRadius: "12px",
                        backgroundColor: "#2F3A32",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                    }}
                >
                    <LockResetIcon sx={{ fontSize: 26, color: "#fff" }} />
                </Box>

                <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5, color: "#1a1a1a" }}>
                    Esqueceu sua senha?
                </Typography>
                <Typography variant="body2" sx={{ color: "#999", mb: 4, lineHeight: 1.7 }}>
                    Informe seu e-mail cadastrado e enviaremos um link para redefinir sua senha.
                </Typography>

                <Typography variant="caption" fontWeight={600} sx={{ color: "#555", mb: 0.5 }}>
                    E-mail
                </Typography>
                <TextField
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            backgroundColor: "#f9f9f9",
                            "&:hover fieldset": { borderColor: "#2F3A32" },
                            "&.Mui-focused fieldset": { borderColor: "#2F3A32" },
                        },
                    }}
                />

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    disableElevation
                    sx={{
                        backgroundColor: "#2F3A32",
                        padding: "12px",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        borderRadius: "10px",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#1f2c20" },
                    }}
                >
                    {loading ? "Enviando..." : "Enviar link de recuperação"}
                </Button>

                <Box textAlign="center" sx={{ mt: 3 }}>
                    <Link
                        component="button"
                        underline="hover"
                        fontSize="0.85rem"
                        fontWeight={500}
                        sx={{ color: "#2F3A32" }}
                        onClick={() => navigate("/login")}
                    >
                        Voltar para o login
                    </Link>
                </Box>
            </Paper>

            <AppAlert open={alert.open} message={alert.message} severity={alert.severity} onClose={closeAlert} />
        </Box>
    );
}
