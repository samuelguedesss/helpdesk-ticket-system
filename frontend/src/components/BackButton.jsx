import React from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function BackButton({ to }) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (to) {
            navigate(to); // Vai para rota específica
        } else {
            navigate(-1); // Volta para página anterior
        }
    };

    return (
        <Tooltip title="Voltar" placement="right">
            <IconButton
                onClick={handleBack}
                sx={{
                    color: "#2F3A32",
                    backgroundColor: "#f5f5f5",
                    "&:hover": { backgroundColor: "#e0e0e0" },
                    mb: 1,
                    top: -15,
                    left: -10,
                }}
            >
                <ArrowBackIcon sx={{ fontSize: 17 }} />
            </IconButton>
        </Tooltip>
    );
}