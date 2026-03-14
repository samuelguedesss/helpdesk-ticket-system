import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper
} from "@mui/material";
import apiBackend from "../services/apiBackend";
import AppAlert from "./AppAlert";

export default function CategorySubcategoryScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEditMode, setIsEditMode] = useState(false);

    const [categoryData, setCategoryData] = useState({
        name: "",
        description: ""
    });

    /* 🔔 ALERT STATE */
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    /* 🔔 ALERT FUNCTIONS */
    const showAlert = (message, severity = "success") => {
        setAlert({
            open: true,
            message,
            severity,
        });
    };

    const closeAlert = () => {
        setAlert((prev) => ({ ...prev, open: false }));
    };

    // Detecta se é edição e busca os dados
    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            fetchCategoryData(id);
        }
    }, [id]);

    // Busca dados da categoria para edição
    const fetchCategoryData = async (categoryId) => {
        try {
            const response = await apiBackend.get(`/categories/${categoryId}`);
            setCategoryData({
                name: response.data.name || "",
                description: response.data.description || ""
            });
        } catch (error) {
            showAlert("Erro ao carregar categoria", "error");
            console.error("Erro ao buscar categoria:", error);
        }
    };

    // Salva ou atualiza categoria
    const categoryRegister = async () => {
        if (!categoryData.name) {
            showAlert("Nome da categoria é obrigatório", "error");
            return;
        }

        const payload = {
            name: String(categoryData.name),
            description:
                typeof categoryData.description === "string"
                    ? categoryData.description
                    : null,
        };

        try {
            if (isEditMode) {
                // UPDATE
                await apiBackend.put(`/categories/${id}`, payload);
                showAlert("Categoria atualizada com sucesso!", "success");

                setTimeout(() => {
                    navigate("/Gerenciar-categoria");
                }, 1500);
            } else {
                // CREATE
                await apiBackend.post("/categories", payload);
                showAlert("Categoria cadastrada com sucesso!", "success");
                setCategoryData({ name: "", description: "" });
            }
        } catch (error) {
            showAlert(
                error.response?.data?.error || `Erro ao ${isEditMode ? 'atualizar' : 'salvar'} categoria`,
                "error"
            );
        }
    };

    return (
        <Box sx={{ p: 7, backgroundColor: "#fdfdfd", minHeight: "100vh" }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, mt: -2, textAlign: "center" }}>
                {isEditMode ? "Editar Categoria" : "Cadastrar Categoria"}
            </Typography>

            <Paper elevation={0} sx={{ p: 4, maxWidth: 600, mx: "auto", border: "1px solid #e0e0e0", borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600} mb={3}>
                    {isEditMode ? "Informações da Categoria" : "Nova Categoria"}
                </Typography>

                <TextField
                    label="Nome da Categoria"
                    fullWidth
                    margin="normal"
                    value={categoryData.name}
                    onChange={(e) =>
                        setCategoryData({ ...categoryData, name: e.target.value })
                    }
                    placeholder="Digite o nome da categoria..."
                />

                <TextField
                    label="Descrição"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={categoryData.description}
                    onChange={(e) =>
                        setCategoryData({
                            ...categoryData,
                            description: e.target.value
                        })
                    }
                    placeholder="Descreva a categoria..."
                />

                <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "flex-end" }}>
                    <Button
                        variant="outlined"
                        sx={{
                            color: '#666',
                            borderColor: '#ccc',
                            textTransform: "uppercase",
                            px: 3
                        }}
                        onClick={() => navigate("/Gerenciar-categoria")}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#2F3A32',
                            '&:hover': { backgroundColor: '#1c261f' },
                            textTransform: "uppercase",
                            px: 3
                        }}
                        onClick={categoryRegister}
                    >
                        {isEditMode ? "Atualizar" : "Salvar"}
                    </Button>
                </Box>
            </Paper>

            {/* 🔔 ALERT GLOBAL */}
            <AppAlert
                open={alert.open}
                message={alert.message}
                severity={alert.severity}
                onClose={closeAlert}
            />
        </Box>
    );
}