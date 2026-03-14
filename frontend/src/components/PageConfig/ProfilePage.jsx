import {
  Box,
  Typography,
  Avatar,
  Button,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import apiBackend from "../../services/apiBackend";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiBackend.get(`/user/${authUser.id}`);
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    if (authUser?.id) fetchUser();
  }, [authUser]);

  const handleUploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await apiBackend.post(`/user/${authUser.id}/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // atualiza a URL da foto já com a URL pré-assinada retornada pelo backend
      setUser((prev) => ({ ...prev, foto_user: response.data.url }));
    } catch (error) {
      console.error("Erro ao fazer upload do avatar:", error);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      setUploading(true);
      await apiBackend.delete(`/user/${authUser.id}/avatar`);
      setUser((prev) => ({ ...prev, foto_user: null }));
    } catch (error) {
      console.error("Erro ao remover avatar:", error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1100,
        mx: "auto",
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 8 },
      }}
    >
      <Typography variant="h4" color="#2F3A32" fontWeight={600} sx={{ mb: 2 }}>
        Perfil
      </Typography>

      <Divider sx={{ mb: { xs: 2, md: 4 } }} />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: { xs: 2, md: 0 },
          mb: { xs: 3, md: 4 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {uploading ? (
            <Box sx={{ width: 160, height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Avatar
              src={user?.foto_user || undefined}
              sx={{ width: 160, height: 160, fontSize: 48 }}
            >
              {!user?.foto_user && user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          )}

          {user?.foto_user && (
            <IconButton color="error" onClick={handleDeleteAvatar} disabled={uploading}>
              <DeleteIcon />
            </IconButton>
          )}
        </Box>

        <Button
          variant="outlined"
          startIcon={<UploadIcon />}
          disabled={uploading}
          onClick={() => inputRef.current.click()}
          sx={{ alignSelf: { xs: "flex-start", md: "center" } }}
        >
          Carregar uma nova imagem
        </Button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleUploadAvatar}
        />
      </Box>

      <Divider sx={{ mb: { xs: 2, md: 3 } }} />

      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        <Typography fontWeight={600} color="#2F3A32" sx={{ mb: 0.5 }}>
          Nome
        </Typography>
        <Typography color="text.secondary">
          {user?.name || "—"}
        </Typography>
      </Box>

      <Divider sx={{ mb: { xs: 2, md: 3 } }} />

      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        <Typography fontWeight={600} color="#2F3A32" sx={{ mb: 0.5 }}>
          Contato
        </Typography>
        <Typography color="text.secondary">
          {user?.email || "—"}
        </Typography>
      </Box>

      <Divider sx={{ mb: { xs: 2, md: 3 } }} />

      <Box sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography fontWeight={600} fontSize="17px" color="#2F3A32" sx={{ mb: 0.5 }}>
          Departamento
        </Typography>
        <Typography color="text.secondary">
          {user?.department?.name || "—"}
        </Typography>
      </Box>
    </Box>
  );
}