import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Link, Paper, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import imgLoginn from "../assets/Rectangle140.png";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiBackend from '../services/apiBackend';
import AppAlert from "../components/AppAlert";

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tokenValido, setTokenValido] = useState(null);

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
    const closeAlert = () => setAlert((prev) => ({ ...prev, open: false }));

    // Valida o token assim que a página carrega
    useEffect(() => {
        const verificarToken = async () => {
            if (!token) { setTokenValido(false); return; }
            try {
                await apiBackend.get(`/password-reset/verify/${token}`);
                setTokenValido(true);
            } catch {
                setTokenValido(false);
            }
        };
        verificarToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setAlert({ open: true, message: "As senhas não coincidem.", severity: "warning" });
            return;
        }

        setLoading(true);
        try {
            await apiBackend.post("/password-reset/reset", { token, newPassword });
            setAlert({ open: true, message: "Senha redefinida com sucesso!", severity: "success" });
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            const msg = error.response?.data?.message || "Erro ao redefinir senha. Tente novamente.";
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
                    <Box sx={{ position: "absolute", top: "25px", left: "30px", display: "flex", alignItems: "center", gap: 1, opacity: 0.7 }}>
                        <SupportAgentIcon sx={{ fontSize: 32, color: "#2F3A32" }} />
                        <Typography fontWeight={700} fontSize={16} color="#2F3A32">HelpDesk</Typography>
                    </Box>

                    {/* TOKEN INVÁLIDO */}
                    {tokenValido === false && (
                        <>
                            <Typography variant="h5" fontWeight={700} mb={1}>
                                Link inválido ou expirado
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#808080" }} mb={4}>
                                Este link de redefinição de senha não é mais válido. Solicite um novo link.
                            </Typography>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => navigate("/esqueci-senha")}
                                sx={{ backgroundColor: "#2D3E2E", padding: "12px", fontWeight: "bold", "&:hover": { backgroundColor: "#1f2c20" } }}
                            >
                                SOLICITAR NOVO LINK
                            </Button>
                        </>
                    )}

                    {/* FORMULÁRIO */}
                    {tokenValido === true && (
                        <>
                            <Typography variant="h5" fontWeight={700} mb={1}>
                                Redefinir senha
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#808080" }} mb={4}>
                                Digite sua nova senha abaixo. Ela deve ter pelo menos 8 caracteres, uma letra maiúscula, um número e um caractere especial.
                            </Typography>

                            <TextField
                                label="Nova senha"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                fullWidth
                                variant="outlined"
                                type={showPassword ? "text" : "password"}
                                sx={{ mb: 2, backgroundColor: "#ffffff", border: "1px solid #E2E2E2" }}
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

                            <TextField
                                label="Confirmar nova senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                fullWidth
                                variant="outlined"
                                type={showConfirm ? "text" : "password"}
                                sx={{ mb: 3, backgroundColor: "#ffffff", border: "1px solid #E2E2E2" }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowConfirm(!showConfirm)}>
                                                {showConfirm ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading}
                                sx={{ backgroundColor: "#2D3E2E", padding: "12px", fontWeight: "bold", "&:hover": { backgroundColor: "#1f2c20" } }}
                            >
                                {loading ? "SALVANDO..." : "SALVAR NOVA SENHA"}
                            </Button>
                        </>
                    )}

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