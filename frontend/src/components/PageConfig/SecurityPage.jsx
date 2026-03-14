import React from "react";
import {
  Box, Typography, Divider, FormControl,
  Button, InputLabel, OutlinedInput,
  InputAdornment, IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../context/AuthContext";
import apiBackend from "../../services/apiBackend";
import AppAlert from "../../components/AppAlert";

export default function SecurityPage() {
  const { user } = useAuth();

  const [showPassword, setShowPassword] = React.useState({
    current: false, new: false, confirm: false,
  });

  const [form, setForm] = React.useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });

  const [alert, setAlert] = React.useState({
    open: false, message: "", severity: "success",
  });

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      return setAlert({ open: true, message: "Preencha todos os campos", severity: "error" });
    }

    if (form.newPassword !== form.confirmPassword) {
      return setAlert({ open: true, message: "As senhas não coincidem", severity: "error" });
    }

    if (form.newPassword.length < 6) {
      return setAlert({ open: true, message: "A nova senha deve ter pelo menos 6 caracteres", severity: "error" });
    }

    try {
      await apiBackend.patch(`/user/${user.id}/password`, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      setAlert({ open: true, message: "Senha alterada com sucesso!", severity: "success" });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });

    } catch (error) {
      const msg = error.response?.data?.mensagem || "Erro ao alterar senha";
      setAlert({ open: true, message: msg, severity: "error" });
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1100, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 2, md: 8 } }}>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 2 }}>
        Segurança
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
        Alterar senha
      </Typography>

      <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="current-password">Senha atual</InputLabel>
          <OutlinedInput
            id="current-password"
            type={showPassword.current ? "text" : "password"}
            label="Senha atual"
            placeholder="Digite sua senha atual..."
            value={form.currentPassword}
            onChange={handleChange("currentPassword")}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => togglePassword("current")}>
                  {showPassword.current ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="new-password">Nova senha</InputLabel>
            <OutlinedInput
              id="new-password"
              type={showPassword.new ? "text" : "password"}
              label="Nova senha"
              placeholder="Digite sua nova senha..."
              value={form.newPassword}
              onChange={handleChange("newPassword")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => togglePassword("new")}>
                    {showPassword.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="confirm-password">Confirme sua nova senha</InputLabel>
            <OutlinedInput
              id="confirm-password"
              type={showPassword.confirm ? "text" : "password"}
              label="Confirme sua nova senha"
              placeholder="Digite a senha novamente..."
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => togglePassword("confirm")}>
                    {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ px: 4, backgroundColor: "#2f3e34", "&:hover": { backgroundColor: "#253128" } }}
          >
            Salvar alterações
          </Button>
        </Box>
      </Box>

      <AppAlert
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
}