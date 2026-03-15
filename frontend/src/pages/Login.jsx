import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Link,
    InputAdornment,
    IconButton,
    Paper,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import { useNavigate } from "react-router-dom";
import apiBackend from "../services/apiBackend";
import AppAlert from "../components/AppAlert";
import { useAuth } from "../context/AuthContext";

// Keyframes for animations
const floatAnimation = {
    "@keyframes float": {
        "0%, 100%": { transform: "translateY(0px)" },
        "50%": { transform: "translateY(-20px)" },
    },
};
const floatSlowAnimation = {
    "@keyframes floatSlow": {
        "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
        "50%": { transform: "translateY(-12px) rotate(5deg)" },
    },
};
const pulseAnimation = {
    "@keyframes pulse": {
        "0%, 100%": { boxShadow: "0 0 0 0 rgba(255,255,255,0.15)" },
        "50%": { boxShadow: "0 0 0 12px rgba(255,255,255,0)" },
    },
};
const fadeInUp = {
    "@keyframes fadeInUp": {
        "0%": { opacity: 0, transform: "translateY(16px)" },
        "100%": { opacity: 1, transform: "translateY(0)" },
    },
};
const shimmer = {
    "@keyframes shimmer": {
        "0%": { backgroundPosition: "-200% 0" },
        "100%": { backgroundPosition: "200% 0" },
    },
};

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const closeAlert = () => {
        setAlert((prev) => ({ ...prev, open: false }));
    };

    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const handleLogin = async (e) => {
        e.preventDefault();

        const showAlert = (message, severity = "success") => {
            setAlert({ open: true, message, severity });
        };

        try {
            const response = await apiBackend.post("/login", { email, password });
            const data = response.data;

            if (data.token) {
                login(data.token.token);
                showAlert("Login realizado com sucesso!", "success");
                setTimeout(() => {
                    navigate("/");
                }, 500);
            } else {
                showAlert("Erro ao fazer login: Credenciais inválidas.", "error");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.mensagem ||
                "Erro ao fazer login. Verifique suas credenciais.";
            showAlert(errorMessage, "error");
        }
    };

    const features = [
        { icon: <ConfirmationNumberIcon sx={{ fontSize: 20 }} />, text: "Gestão completa de tickets" },
        { icon: <SpeedIcon sx={{ fontSize: 20 }} />, text: "Acompanhamento em tempo real" },
        { icon: <SecurityIcon sx={{ fontSize: 20 }} />, text: "Controle de acesso por perfil" },
        { icon: <HeadsetMicIcon sx={{ fontSize: 20 }} />, text: "Suporte técnico organizado" },
    ];

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
                    maxWidth: "1050px",
                    borderRadius: "20px",
                    overflow: "hidden",
                    display: "flex",
                    minHeight: "560px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                }}
            >
                {/* Left - Hero Panel */}
                <Box
                    sx={{
                        width: "48%",
                        background: "linear-gradient(170deg, #3a4a3d 0%, #2F3A32 40%, #232b25 100%)",
                        padding: "48px 40px",
                        display: { xs: "none", md: "flex" },
                        flexDirection: "column",
                        justifyContent: "center",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {/* Floating particles */}
                    <Box sx={{
                        ...floatAnimation,
                        position: "absolute", top: 40, right: 40,
                        width: 10, height: 10, borderRadius: "50%",
                        background: "rgba(255,255,255,0.12)",
                        animation: "float 4s ease-in-out infinite",
                    }} />
                    <Box sx={{
                        ...floatSlowAnimation,
                        position: "absolute", top: "30%", right: "20%",
                        width: 6, height: 6, borderRadius: "50%",
                        background: "rgba(255,255,255,0.08)",
                        animation: "floatSlow 5s ease-in-out infinite 0.5s",
                    }} />
                    <Box sx={{
                        ...floatAnimation,
                        position: "absolute", bottom: 80, right: 60,
                        width: 8, height: 8, borderRadius: "50%",
                        background: "rgba(255,255,255,0.1)",
                        animation: "float 6s ease-in-out infinite 1s",
                    }} />
                    <Box sx={{
                        ...floatSlowAnimation,
                        position: "absolute", bottom: "40%", left: "15%",
                        width: 5, height: 5, borderRadius: "50%",
                        background: "rgba(255,255,255,0.06)",
                        animation: "floatSlow 7s ease-in-out infinite 0.3s",
                    }} />
                    <Box sx={{
                        ...floatAnimation,
                        position: "absolute", top: "55%", right: "10%",
                        width: 7, height: 7, borderRadius: "50%",
                        background: "rgba(255,255,255,0.07)",
                        animation: "float 5.5s ease-in-out infinite 1.5s",
                    }} />

                    {/* Glowing circles */}
                    <Box sx={{
                        ...floatSlowAnimation,
                        position: "absolute", top: -60, right: -60,
                        width: 200, height: 200, borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
                        animation: "floatSlow 8s ease-in-out infinite",
                    }} />
                    <Box sx={{
                        ...floatAnimation,
                        position: "absolute", bottom: -40, left: -40,
                        width: 150, height: 150, borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
                        animation: "float 9s ease-in-out infinite 0.5s",
                    }} />

                    {/* Logo with pulse */}
                    <Box
                        sx={{
                            ...pulseAnimation,
                            width: 58,
                            height: 58,
                            borderRadius: "14px",
                            background: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 4,
                            animation: "pulse 3s ease-in-out infinite",
                        }}
                    >
                        <SupportAgentIcon sx={{ fontSize: 32, color: "#fff" }} />
                    </Box>

                    <Typography variant="h4" fontWeight={800} color="#fff" sx={{ mb: 0.5, lineHeight: 1.2 }}>
                        Help Desk
                    </Typography>
                    <Typography variant="h5" fontWeight={600} color="rgba(255,255,255,0.5)" sx={{ mb: 3, lineHeight: 1.3 }}>
                        Ticket System
                    </Typography>

                    <Typography variant="body2" color="rgba(255,255,255,0.55)" sx={{ mb: 5, lineHeight: 1.8, maxWidth: 320 }}>
                        Gerencie e resolva seus chamados de forma eficiente com nosso portal de suporte.
                    </Typography>

                    {/* Features with staggered fade-in */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {features.map((f, i) => (
                            <Box
                                key={i}
                                sx={{
                                    ...fadeInUp,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    color: "rgba(255,255,255,0.7)",
                                    animation: `fadeInUp 0.5s ease-out ${0.3 + i * 0.15}s both`,
                                    transition: "transform 0.2s, background 0.2s",
                                    borderRadius: "10px",
                                    padding: "6px 8px",
                                    margin: "0 -8px",
                                    "&:hover": {
                                        background: "rgba(255,255,255,0.04)",
                                        transform: "translateX(4px)",
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: "8px",
                                        background: "rgba(255,255,255,0.07)",
                                        border: "1px solid rgba(255,255,255,0.05)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    {f.icon}
                                </Box>
                                <Typography variant="body2" fontWeight={500} fontSize="0.85rem">
                                    {f.text}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Right - Login Form */}
                <Box
                    sx={{
                        flex: 1,
                        padding: { xs: "40px 28px", md: "48px 52px" },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        backgroundColor: "#fff",
                    }}
                >
                    {/* Mobile logo */}
                    <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1, mb: 4 }}>
                        <SupportAgentIcon sx={{ fontSize: 28, color: "#2F3A32" }} />
                        <Typography fontWeight={700} fontSize={16} color="#2F3A32">HelpDesk</Typography>
                    </Box>

                    <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5, color: "#1a1a1a" }}>
                        Bem-vindo de volta!
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#999", mb: 4 }}>
                        Insira suas credenciais para acessar o sistema.
                    </Typography>

                    {/* Email */}
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
                            mb: 2.5,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "10px",
                                backgroundColor: "#f9f9f9",
                                "&:hover fieldset": { borderColor: "#2F3A32" },
                                "&.Mui-focused fieldset": { borderColor: "#2F3A32" },
                            },
                        }}
                    />

                    {/* Senha */}
                    <Typography variant="caption" fontWeight={600} sx={{ color: "#555", mb: 0.5 }}>
                        Senha
                    </Typography>
                    <TextField
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        variant="outlined"
                        size="small"
                        type={showPassword ? "text" : "password"}
                        sx={{
                            mb: 1,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "10px",
                                backgroundColor: "#f9f9f9",
                                "&:hover fieldset": { borderColor: "#2F3A32" },
                                "&.Mui-focused fieldset": { borderColor: "#2F3A32" },
                            },
                        }}
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

                    <Box textAlign="right" sx={{ mb: 3 }}>
                        <Link
                            component="button"
                            underline="hover"
                            fontSize="0.8rem"
                            fontWeight={500}
                            sx={{ color: "#2F3A32" }}
                            onClick={() => navigate("/forgot-password")}
                        >
                            Esqueceu a senha?
                        </Link>
                    </Box>

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleLogin}
                        disableElevation
                        sx={{
                            ...shimmer,
                            backgroundColor: "#2F3A32",
                            padding: "12px",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            borderRadius: "10px",
                            textTransform: "none",
                            letterSpacing: 0.3,
                            position: "relative",
                            overflow: "hidden",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            "&:hover": {
                                backgroundColor: "#1f2c20",
                                transform: "translateY(-1px)",
                                boxShadow: "0 4px 15px rgba(47,58,50,0.4)",
                            },
                            "&:active": {
                                transform: "translateY(0)",
                            },
                            "&::after": {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
                                backgroundSize: "200% 100%",
                                animation: "shimmer 3s ease-in-out infinite",
                            },
                        }}
                    >
                        Entrar
                    </Button>

                    <Typography variant="caption" sx={{ color: "#ccc", textAlign: "center", mt: 4 }}>
                        Help Desk Ticket System v1.0
                    </Typography>
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
