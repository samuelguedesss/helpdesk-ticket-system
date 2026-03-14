import {
    Box,
    Typography,
    TextField,
    MenuItem,
    Paper,
    Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import apiBackend from "../services/apiBackend";
import DynamicCalledForm from "../components/DynamicCalledForm";
import UploadPlaceholder from "../components/UploadPlaceholder";
import AppAlert from "../components/AppAlert";
import BackButton from "../components/BackButton";

export default function CalledOpen() {

    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    const [categoryId, setCategoryId] = useState("");
    const [subcategoryId, setSubcategoryId] = useState("");
    const [activeTab, setActiveTab] = useState("category");

    const [formFields, setFormFields] = useState([]);
    const [formData, setFormData] = useState({});

    const [attachments, setAttachments] = useState([]);

    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    /* 🎨 Estilo padrão do Select */
    const selectStyle = {
        width: 399,

        "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            "& fieldset": {
                borderColor: "#9E9E9E",
                borderWidth: "1px",
            },
            "&:hover fieldset": {
                borderColor: "#9E9E9E",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#9E9E9E",
                borderWidth: "1px",
            },
        },

        "& .MuiSelect-icon": {
            color: "#9E9E9E",
        },

        /* 🔥 NOVO — REMOVE AZUL DO LABEL */
        "& .MuiInputLabel-root": {
            color: "#2F3A32",
        },
        "& .MuiInputLabel-root.Mui-focused": {
            color: "#2F3A32",
        },
        "& .MuiInputLabel-root.MuiInputLabel-shrink": {
            color: "#2F3A32",
        },
    };

    /* 🎨 MenuProps (dropdown) */
    const selectMenuProps = {
        disablePortal: true,
        PaperProps: {
            elevation: 0,
            sx: {
                mt: "6px",
                border: "1px solid #9E9E9E",
                borderRadius: "10px",

                maxWidth: 260,        // largura máxima
                overflowY: "auto",    // scroll vertical
                overflowX: "hidden",  // sem scroll lateral
            },
        },
        MenuListProps: {
            sx: {
                p: 0,
            },
        },
    };

    /* 🎨 Estilo dos itens (REMOVE AZUL) */
    const menuItemStyle = {
        fontSize: 14,
        px: 2,
        py: 1.2,
        borderRadius: "10px",

        whiteSpace: "normal",     // ✅ permite quebra de linha
        wordBreak: "break-word", // quebra palavras longas se precisar

        "&.Mui-selected": {
            backgroundColor: "#F5F5F5",
        },
        "&.Mui-selected:hover": {
            backgroundColor: "#EEEEEE",
        },
        "&:hover": {
            backgroundColor: "#F0F0F0",
        },
    };
    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        if (categoryId) {
            loadSubcategories(categoryId);
            setSubcategoryId("");
            setFormFields([]);
            setFormData({});
            setActiveTab("subcategory");
        } else {
            setSubcategories([]);
            setSubcategoryId("");
            setActiveTab("category");
        }
    }, [categoryId]);

    useEffect(() => {
        if (subcategoryId) {
            loadFormFields(subcategoryId);
        }
    }, [subcategoryId]);

    const loadCategories = async () => {
        try {
            const response = await apiBackend.get("/categories");
            setCategories(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        }
    };

    const loadSubcategories = async (id) => {
        try {
            const response = await apiBackend.get(
                `/subcategories/by-category/${id}`
            );

            // ⬅️ FILTRAR APENAS SUBCATEGORIAS ATIVAS (ativo = 1)
            const subcategoriasAtivas = Array.isArray(response.data)
                ? response.data.filter(sub => sub.ativo === 1)
                : [];

            setSubcategories(subcategoriasAtivas);

        } catch (error) {
            console.error("Erro ao carregar subcategorias:", error);
        }
    };


    const loadFormFields = async (id) => {
        try {
            const response = await apiBackend.get(
                `/subcategories/${id}/form-fields`
            );
            console.log("formFields:", response.data);
            setFormFields(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Erro ao carregar campos do formulário:", error);
        }
    };

    const handleFieldChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

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

    const handleOpenCalled = async (e) => {
        e.preventDefault();

        try {
            // ✅ VALIDAÇÃO: Verificar campos obrigatórios
            const camposObrigatorios = formFields.filter(field => field.required);
            const camposVazios = camposObrigatorios.filter(field => {
                const valor = formData[field.id];
                return !valor || valor.trim() === '';
            });

            if (camposVazios.length > 0) {
                const nomesVazios = camposVazios.map(f => f.label).join(', ');
                showAlert(
                    `Por favor, preencha os campos obrigatórios: ${nomesVazios}`,
                    "warning"
                );
                return; // ❌ Não prossegue
            }

            // ✅ Prossegue com a criação do chamado
            const calledResponse = await apiBackend.post("/called", {
                id_category: categoryId,
                id_subcategory: subcategoryId,
            });

            const idCalled = calledResponse.data.id || calledResponse.data.id_called;

            if (!idCalled) {
                throw new Error("Erro ao criar chamado");
            }

            const fieldsPayload = formFields.map((field) => ({
                id_field: field.id,
                value: formData[field.id] || "",
            }));

            await apiBackend.post(`/calledFieldValues/${idCalled}/field`, {
                fields: fieldsPayload,
            });

            if (attachments.length > 0) {
                for (const file of attachments) {
                    const formDataFile = new FormData();
                    formDataFile.append("file", file);
                    await apiBackend.post(`/calledsAttachments/${idCalled}`, formDataFile, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                }
            }

            showAlert("Chamado aberto com sucesso!");

            // Limpar formulário
            setCategoryId("");
            setSubcategoryId("");
            setFormFields([]);
            setFormData({});
            setAttachments([]);
            setActiveTab("category");

        } catch (error) {
            console.error(error);
            showAlert(
                error.response?.data?.error || "Erro ao abrir chamado",
                "error"
            );
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            {/* TÍTULO */}
            <BackButton to="/" />
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 600,
                    textAlign: "center",
                    mb: 1,
                    mt: 1,
                    color: "#2F3A32"
                }}
            >
                Solicitação de Chamado
            </Typography>

            {/* STEPS (mantém largura menor) */}
            <Box
                sx={{
                    display: "flex",
                    mt: 2,
                    maxWidth: "500px",
                    mx: "auto",
                }}
            >
                <Box
                    onClick={() => setActiveTab("category")}
                    sx={{
                        flex: 1,
                        textAlign: "center",
                        cursor: "pointer",
                        color: "#2F3A32",
                        borderBottom:
                            activeTab === "category"
                                ? "2px solid #b4b0b0ff"
                                : "1px solid #b4b0b0ff",
                        fontWeight:
                            activeTab === "category" ? "bold" : "normal",
                    }}
                >
                    Categoria
                </Box>

                <Box
                    onClick={() =>
                        categoryId && setActiveTab("subcategory")
                    }
                    sx={{
                        flex: 1,
                        textAlign: "center",
                        cursor: categoryId ? "pointer" : "not-allowed",
                        color: "#2F3A32",
                        borderBottom:
                            activeTab === "subcategory"
                                ? "2px solid #b4b0b0ff"
                                : "1px solid #b4b0b0ff",
                        fontWeight:
                            activeTab === "subcategory"
                                ? "bold"
                                : "normal",
                        opacity: categoryId ? 1 : 0.5,
                    }}
                >
                    Subcategoria
                </Box>
            </Box>

            {/* CONTEÚDO */}
            <Paper
                elevation={0}
                sx={{
                    backgroundColor: "transparent",
                    mt: 4,
                    p: 2,
                }}
            >
                {/* CATEGORIA */}
                {activeTab === "category" && (
                    <>
                        <Typography
                            sx={{
                                mb: 2,
                                fontSize: 16,
                                color: "#2F3A32",
                                textAlign: "center",
                                mt: -2,
                            }}
                        >
                            Selecione a categoria do chamado
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                select
                                size="small"
                                label="Categoria"
                                value={categoryId}
                                onChange={(e) =>
                                    setCategoryId(e.target.value)
                                }
                                sx={selectStyle}
                                SelectProps={{
                                    MenuProps: selectMenuProps,
                                }}
                            >
                                {categories.map((category) => (
                                    <MenuItem
                                        key={category.id}
                                        value={category.id}
                                        sx={menuItemStyle}
                                    >
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </>
                )}

                {/* SUBCATEGORIA */}
                {activeTab === "subcategory" && (
                    <>
                        <Typography
                            sx={{
                                mb: 3,
                                fontSize: 16,
                                color: "#2F3A32",
                                textAlign: "center",
                                mt: -2,
                            }}
                        >
                            Selecione a subcategoria do chamado
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                select
                                size="small"
                                label="Subcategoria"
                                value={subcategoryId}
                                onChange={(e) =>
                                    setSubcategoryId(e.target.value)
                                }
                                sx={selectStyle}
                                SelectProps={{
                                    MenuProps: selectMenuProps,
                                }}
                            >
                                {subcategories.map((subcategory) => (
                                    <MenuItem
                                        key={subcategory.id}
                                        value={subcategory.id}
                                        sx={menuItemStyle}
                                    >
                                        {subcategory.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </>
                )}

                {/* FORMULÁRIO */}
                {subcategoryId && (
                    <Box
                        sx={{
                            mt: 5,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        {/* CONTAINER CORRETO DO FORMULÁRIO */}
                        <Box
                            sx={{
                                width: "100%",
                                maxWidth: 650, // 280 + 280 + espaçamento
                            }}
                        >
                            <DynamicCalledForm
                                fields={formFields}
                                formData={formData}
                                onChange={handleFieldChange}
                            />

                            <UploadPlaceholder onFilesChange={setAttachments} />

                            <Box
                                sx={{
                                    mt: 4,
                                    textAlign: "center",
                                }}
                            >
                                <Button
                                    variant="contained"
                                    onClick={handleOpenCalled}
                                    sx={{
                                        backgroundColor: "#2F3A32",
                                        textTransform: "none",
                                        width: "194px",
                                        borderRadius: "20px",
                                    }}
                                >
                                    Abrir chamado
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                )}
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