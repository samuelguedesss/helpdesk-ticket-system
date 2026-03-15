import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Link,
    Paper,
    InputAdornment,
    IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiBackend from "../services/apiBackend";
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

    const inputSx = {
        mb: 2,
        "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            backgroundColor: "#f9f9f9",
            "&:hover fieldset": { borderColor: "#2F3A32" },
            "&.Mui-focused fieldset": { borderColor: "#2F3A32" },
        },
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
                {/* TOKEN INVÁLIDO */}
                {tokenValido === false && (
                    <>
                        <Box
                            sx={{
                                width: 52,
                                height: 52,
                                borderRadius: "12px",
                                backgroundColor: "#c62828",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 3,
                            }}
                        >
                            <ErrorOutlineIcon sx={{ fontSize: 26, color: "#fff" }} />
                        </Box>

                        <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5, color: "#1a1a1a" }}>
                            Link inválido ou expirado
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#999", mb: 4, lineHeight: 1.7 }}>
                            Este link de redefinição de senha não é mais válido. Solicite um novo link.
                        </Typography>

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => navigate("/forgot-password")}
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
                            Solicitar novo link
                        </Button>
                    </>
                )}

                {/* FORMULÁRIO */}
                {tokenValido === true && (
                    <>
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
                            <LockIcon sx={{ fontSize: 26, color: "#fff" }} />
                        </Box>

                        <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5, color: "#1a1a1a" }}>
                            Redefinir senha
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#999", mb: 4, lineHeight: 1.7 }}>
                            Digite sua nova senha abaixo. Ela deve ter pelo menos 8 caracteres, uma letra maiúscula, um número e um caractere especial.
                        </Typography>

                        <Typography variant="caption" fontWeight={600} sx={{ color: "#555", mb: 0.5 }}>
                            Nova senha
                        </Typography>
                        <TextField
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            fullWidth
                            variant="outlined"
                            size="small"
                            type={showPassword ? "text" : "password"}
                            sx={inputSx}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Typography variant="caption" fontWeight={600} sx={{ color: "#555", mb: 0.5 }}>
                            Confirmar nova senha
                        </Typography>
                        <TextField
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            fullWidth
                            variant="outlined"
                            size="small"
                            type={showConfirm ? "text" : "password"}
                            sx={{ ...inputSx, mb: 3 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowConfirm(!showConfirm)} size="small">
                                            {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
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
                            {loading ? "Salvando..." : "Salvar nova senha"}
                        </Button>
                    </>
                )}

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
