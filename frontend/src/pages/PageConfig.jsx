import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";

import ProfilePage from "../components/PageConfig/ProfilePage";
import SecurityPage from "../components/PageConfig/SecurityPage";

export default function PageConfig() {
  const location = useLocation();
  const [active, setActive] = useState(location.state?.tab || "perfil");
  const [openContactModal, setOpenContactModal] = useState(false);

  const handleOpen = () => setOpenContactModal(true);
  const handleClose = () => setOpenContactModal(false);

  const renderContent = () => {
    switch (active) {
      case "perfil":
        return <ProfilePage />;
      case "seguranca":
        return <SecurityPage />;
      default:
        return <ProfilePage />;
    }
  };

  const menuItemSx = (isActive) => ({
    position: "relative",
    px: { xs: 1, md: 6 },
    py: { xs: 1, md: 1.5 },
    "&:hover": { backgroundColor: "transparent" },
    "&.Mui-selected": { backgroundColor: "transparent" },
    "&.Mui-selected:hover": { backgroundColor: "transparent" },
    "&::before": {
      content: '""',
      position: "absolute",
      left: { xs: 6, md: 11 },
      right: { xs: 6, md: 11 },
      top: 4,
      bottom: 4,
      borderRadius: 2,
      backgroundColor: "transparent",
      transform: "translateX(-6px)",
      opacity: 0,
      transition: "all 0.2s ease",
      zIndex: 0,
    },
    "&:hover::before": {
      backgroundColor: "rgba(0,0,0,0.04)",
      transform: "translateX(0)",
      opacity: 1,
    },
    "&.Mui-selected::before": {
      backgroundColor: "rgba(0,0,0,0.08)",
      transform: "translateX(0)",
      opacity: 1,
    },
    "&.Mui-selected:hover::before": {
      backgroundColor: "rgba(0,0,0,0.10)",
    },
    "& .MuiTypography-root": {
      position: "relative",
      zIndex: 1,
      fontSize: { xs: 14, md: 20 },
      fontWeight: isActive ? 600 : 400,
      color: "#2F3A32",
    },
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {/* SUBMENU */}
        <Box
          sx={{
            width: { xs: "100%", md: 460 },
            minHeight: "calc(100vh - 64px)",
            borderRight: { xs: "none", md: "1px solid #e0e0e0" },
            borderBottom: { xs: "1px solid #e0e0e0", md: "none" },
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <List
            sx={{
              display: "flex",
              flexDirection: { xs: "row", md: "column" },
              justifyContent: { xs: "space-around", md: "flex-start" },
            }}
          >
            <ListItemButton
              disableRipple
              selected={active === "perfil"}
              onClick={() => setActive("perfil")}
              sx={menuItemSx(active === "perfil")}
            >
              <ListItemText primary="Perfil" />
            </ListItemButton>

            <ListItemButton
              disableRipple
              selected={active === "seguranca"}
              onClick={() => setActive("seguranca")}
              sx={menuItemSx(active === "seguranca")}
            >
              <ListItemText primary="Segurança" />
            </ListItemButton>
          </List>

          <Box sx={{ mt: "auto", px: { xs: 2, md: 6 }, py: 3 }}>
            <Typography
              component="button"
              onClick={handleOpen}
              sx={{
                background: "none",
                border: "none",
                p: 0,
                fontSize: 14,
                color: "#6b6b6b",
                textDecoration: "underline",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              Entrar em contato com o administrador
            </Typography>
          </Box>
        </Box>

        {/* CONTEÚDO */}
        <Box sx={{ flex: 1, px: { xs: 2, md: 0 }, py: { xs: 2, md: 0 } }}>
          {renderContent()}
        </Box>
      </Box>

      {/* MODAL */}
      <Modal open={openContactModal} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", md: "40%" },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" fontWeight={600} mb={3} color="#2F3A32">
            Entrar em contato com o administrador
          </Typography>

          <Typography color="text.secondary" mb={3}>
            O contato com o administrador deve ser utilizado apenas para assuntos relacionados à plataforma, como erros de funcionamento, bugs, problemas de acesso, melhorias, sugestões, dúvidas sobre o uso do sistema ou ajustes de design. Para questões relacionadas aos chamados ou solicitações internas, utilize os canais apropriados dentro da própria ferramenta.
          </Typography>

          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
              <TextField
                label="Nome"
                placeholder="Informe seu nome e sobrenome"
                fullWidth
                size="small"
                sx={{ "& label.Mui-focused": { color: "#2F3A32" }, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#ccc" }, "&:hover fieldset": { borderColor: "#2F3A32" }, "&.Mui-focused fieldset": { borderColor: "#2F3A32" } } }}
              />
              <TextField
                label="E-mail corporativo"
                placeholder="Informe seu e-mail"
                fullWidth
                size="small"
                type="email"
                sx={{ "& label.Mui-focused": { color: "#2F3A32" }, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#ccc" }, "&:hover fieldset": { borderColor: "#2F3A32" }, "&.Mui-focused fieldset": { borderColor: "#2F3A32" } } }}
              />
            </Box>

            <TextField
              label="Descrição"
              placeholder="Informe os detalhes do que está acontecendo..."
              fullWidth
              multiline
              rows={4}
              sx={{ "& label.Mui-focused": { color: "#2F3A32" }, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#ccc" }, "&:hover fieldset": { borderColor: "#2F3A32" }, "&.Mui-focused fieldset": { borderColor: "#2F3A32" } } }}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
              <Button onClick={handleClose} sx={{ color: "#2F3A32" }}>Cancelar</Button>
              <Button variant="contained" sx={{ backgroundColor: "#2F3A32" }}>Enviar</Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}