import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Stack,
    Checkbox,
    FormControlLabel,
    IconButton,
    Paper,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import apiBackend from "../services/apiBackend";
import AppAlert from "./AppAlert";
import BackButton from "../components/BackButton";

export default function AddSubcategoryformFild() {
    //PEGAR AMBOS OS PARÂMETROS DA URL
    const { categoryId, subcategoryId } = useParams();
    const navigate = useNavigate();

    //DETECTAR MODO (CRIAR ou EDITAR)
    const isEditMode = !!subcategoryId;

    const [categoryName, setCategoryName] = useState("");
    const [subcategoryData, setSubcategoryData] = useState({
        name: "",
        description: "",
    });

    const [formFields, setFormFields] = useState([
        {
            id: Date.now(),
            label: "",
            placeholder: "",
            type: "text",
            required: false,
        },
    ]);

    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode && subcategoryId) {
            // ⬅️ MODO EDIÇÃO - Carregar dados da subcategoria
            loadSubcategoryData(subcategoryId);
        } else if (categoryId) {
            // ⬅️ MODO CRIAÇÃO - Buscar apenas nome da categoria
            fetchCategoryName(categoryId);
        }
    }, [subcategoryId, categoryId, isEditMode]);

    // ⬅️ NOVA FUNÇÃO - CARREGAR DADOS DA SUBCATEGORIA (MODO EDIÇÃO)
    const loadSubcategoryData = async (id) => {
        try {
            setLoading(true);
            const response = await apiBackend.get(`/subcategories/${id}`);
            const data = response.data;

            // Preencher dados básicos
            setSubcategoryData({
                name: data.name || "",
                description: data.description || "",
            });

            // Buscar nome da categoria
            if (data.id_category) {
                fetchCategoryName(data.id_category);
            }

            // Preencher campos dinâmicos (se existirem)
            if (data.formFields && data.formFields.length > 0) {
                const loadedFields = data.formFields.map((field) => ({
                    id: field.id, // ⬅️ Usar ID do banco no modo edição
                    label: field.label,
                    placeholder: field.placeholder || "",
                    type: field.type,
                    required: field.required,
                }));
                setFormFields(loadedFields);
            }

        } catch (error) {
            console.error("Erro ao carregar subcategoria:", error);
            showAlert("Erro ao carregar dados da subcategoria", "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategoryName = async (catId) => {
        try {
            const response = await apiBackend.get(`/categories/${catId}`);
            setCategoryName(response.data.name);
        } catch (error) {
            console.error("Erro ao buscar categoria:", error);
        }
    };

    const showAlert = (message, severity = "success") => {
        setAlert({ open: true, message, severity });
    };

    const closeAlert = () => {
        setAlert((prev) => ({ ...prev, open: false }));
    };

    const handleAddField = () => {
        setFormFields([
            ...formFields,
            {
                id: Date.now(), // ⬅️ Novo campo sempre usa timestamp
                label: "",
                placeholder: "",
                type: "text",
                required: false,
            },
        ]);
    };

    const handleRemoveField = (id) => {
        if (formFields.length > 1) {
            setFormFields(formFields.filter((field) => field.id !== id));
        }
    };

    const handleFieldChange = (id, fieldName, value) => {
        setFormFields(
            formFields.map((field) =>
                field.id === id ? { ...field, [fieldName]: value } : field
            )
        );
    };

    const handleSave = async () => {
        if (!subcategoryData.name) {
            showAlert("Nome da subcategoria é obrigatório", "error");
            return;
        }

        const invalidFields = formFields.some((field) => !field.label.trim());
        if (invalidFields) {
            showAlert("Todos os campos devem ter um título", "error");
            return;
        }

        try {
            const payload = {
                name: subcategoryData.name,
                description: subcategoryData.description || null,
                formFields: formFields.map((field, index) => ({
                    label: field.label,
                    placeholder: field.placeholder || null,
                    type: field.type,
                    required: field.required,
                    order_index: index,
                })),
            };

            if (isEditMode) {
                // ⬅️ MODO EDIÇÃO - PUT
                await apiBackend.put(`/subcategories/${subcategoryId}`, payload);
                showAlert("Subcategoria atualizada com sucesso!", "success");
            } else {
                // ⬅️ MODO CRIAÇÃO - POST
                payload.id_category = Number(categoryId);
                await apiBackend.post("/subcategories", payload);
                showAlert("Subcategoria criada com sucesso!", "success");
            }

            setTimeout(() => {
                navigate("/Gerenciar-categoria");
            }, 1500);

        } catch (error) {
            showAlert(
                error.response?.data?.error ||
                `Erro ao ${isEditMode ? 'atualizar' : 'salvar'} subcategoria`,
                "error"
            );
        }
    };

    const handleCancel = () => {
        navigate("/Gerenciar-categoria");
    };

    // ⬅️ LOADING STATE
    if (loading) {
        return (
            <Box sx={{ p: 7, backgroundColor: "#fdfdfd", minHeight: "100vh" }}>
                <Typography>Carregando...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 7, backgroundColor: "#fdfdfd", minHeight: "100vh" }}>
            <BackButton to="/Gerenciar-categoria" />
            {/* ⬅️ TÍTULO DINÂMICO */}
            
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, mt: -2 }}>
                {isEditMode ? "Editar Subcategoria" : "Adicionar Subcategoria"}
            </Typography>

            <Paper elevation={0} sx={{ p: 4, border: "1px solid #e0e0e0", borderRadius: 2 }}>
                <Box sx={{ display: "flex", gap: 4 }}>
                    {/* LADO ESQUERDO - Informações da Subcategoria */}
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600} mb={3}>
                            Informações da subcategoria
                        </Typography>

                        <Box mb={2}>
                            <Typography variant="body2" fontWeight={500} mb={1}>
                                Nome da subcategoria <span style={{ color: "red" }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                value={subcategoryData.name}
                                onChange={(e) =>
                                    setSubcategoryData({
                                        ...subcategoryData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Digite o nome da subcategoria..."
                            />
                        </Box>

                        <Box mb={2}>
                            <Typography variant="body2" fontWeight={500} mb={1}>
                                Categoria vinculada
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                value={categoryName}
                                disabled
                                sx={{
                                    "& .MuiInputBase-input.Mui-disabled": {
                                        WebkitTextFillColor: "#666",
                                        backgroundColor: "#f5f5f5",
                                    },
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography variant="body2" fontWeight={500} mb={1}>
                                Descrição da subcategoria
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                multiline
                                rows={6}
                                value={subcategoryData.description}
                                onChange={(e) =>
                                    setSubcategoryData({
                                        ...subcategoryData,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Descreva claramente o objetivo desta subcategoria..."
                            />
                        </Box>
                    </Box>

                    {/* LADO DIREITO - Perguntas do Chamado */}
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600} mb={1}>
                            Perguntas do chamado
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={3} fontSize={13}>
                            Defina abaixo as informações que o usuário deverá preencher ao abrir um
                            chamado nesta subcategoria.
                        </Typography>

                        <Box sx={{ maxHeight: "450px", overflowY: "auto", pr: 1 }}>
                            {formFields.map((field, index) => (
                                <Accordion
                                    key={field.id}
                                    defaultExpanded={index === 0}
                                    sx={{
                                        mb: 1.5,
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "6px !important",
                                        "&:before": { display: "none" },
                                        boxShadow: "none",
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        sx={{
                                            backgroundColor: "#fafafa",
                                            borderRadius: "6px",
                                            minHeight: "48px !important",
                                            "& .MuiAccordionSummary-content": {
                                                margin: "8px 0",
                                            },
                                        }}
                                    >
                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            sx={{ width: "100%", pr: 1 }}
                                        >
                                            <Typography fontWeight={600} fontSize={14}>
                                                Pergunta {index + 1}
                                            </Typography>
                                            {formFields.length > 1 && (
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveField(field.id);
                                                    }}
                                                    sx={{ color: "error.main" }}
                                                >
                                                    <DeleteOutlineIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                        </Stack>
                                    </AccordionSummary>

                                    <AccordionDetails sx={{ pt: 2, pb: 2 }}>
                                        <Box mb={1.5}>
                                            <Typography variant="body2" fontWeight={500} mb={0.5} fontSize={13}>
                                                Título
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                value={field.label}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        field.id,
                                                        "label",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Digite o título da pergunta"
                                            />
                                        </Box>

                                        <Box mb={1.5}>
                                            <Typography variant="body2" fontWeight={500} mb={0.5} fontSize={13}>
                                                Placeholder
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                value={field.placeholder}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        field.id,
                                                        "placeholder",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Digite o placeholder da pergunta"
                                            />
                                        </Box>

                                        <Box mb={1}>
                                            <Typography variant="body2" fontWeight={500} mb={0.5} fontSize={13}>
                                                Tipo de campo
                                            </Typography>
                                            <TextField
                                                select
                                                fullWidth
                                                size="small"
                                                value={field.type}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        field.id,
                                                        "type",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <MenuItem value="text">Texto</MenuItem>
                                                <MenuItem value="number">Número</MenuItem>
                                                <MenuItem value="textarea">Área de Texto</MenuItem>
                                            </TextField>
                                        </Box>

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    size="small"
                                                    checked={field.required}
                                                    onChange={(e) =>
                                                        handleFieldChange(
                                                            field.id,
                                                            "required",
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                            }
                                            label={
                                                <Typography fontSize={13}>Obrigatório</Typography>
                                            }
                                        />
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>

                        <Button
                            fullWidth
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={handleAddField}
                            sx={{
                                mt: 2,
                                py: 1.2,
                                borderRadius: 1,
                                textTransform: "none",
                                backgroundColor: "#e8f5e9",
                                color: "#2e7d32",
                                fontWeight: 500,
                                fontSize: 14,
                                "&:hover": {
                                    backgroundColor: "#c8e6c9",
                                },
                            }}
                        >
                            Adicionar nova pergunta
                        </Button>
                    </Box>
                </Box>

                {/* BOTÕES RODAPÉ */}
                <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 4 }}>
                    <Button
                        onClick={handleCancel}
                        variant="outlined"
                        sx={{
                            color: "#666",
                            borderColor: "#ccc",
                            textTransform: "uppercase",
                            px: 3,
                            fontSize: 13,
                            fontWeight: 600,
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        sx={{
                            backgroundColor: "#2F3A32",
                            "&:hover": { backgroundColor: "#1e2a22" },
                            textTransform: "uppercase",
                            px: 3,
                            fontSize: 13,
                            fontWeight: 600,
                        }}
                    >
                        {/* ⬅️ TEXTO DINÂMICO NO BOTÃO */}
                        {isEditMode ? "Salvar Alterações" : "Salvar Subcategoria"}
                    </Button>
                </Stack>
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