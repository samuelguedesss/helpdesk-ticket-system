import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    InputAdornment,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    Stack,
    Popover,
    Divider,
    Switch,
    Chip,
} from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useNavigate } from "react-router-dom";
import apiBackend from "../services/apiBackend";
import BackButton from "../components/BackButton";

export default function ManageCategory() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCategories, setFilteredCategories] = useState([]);

    // Popover
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        applySearch();
    }, [searchTerm, categories]);

    const fetchCategories = async () => {
        try {
            const response = await apiBackend.get("/categories");
            setCategories(response.data);
            setFilteredCategories(response.data);

            // Buscar subcategorias para cada categoria
            response.data.forEach(category => {
                fetchSubcategories(category.id);
            });
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }
    };

    const fetchSubcategories = async (categoryId) => {
        try {
            const response = await apiBackend.get(`/subcategories/by-category/${categoryId}`);
            setSubcategories(prev => ({
                ...prev,
                [categoryId]: response.data
            }));
        } catch (error) {
            console.error(`Erro ao buscar subcategorias da categoria ${categoryId}:`, error);
        }
    };

    //  NOVA FUNÇÃO PARA ATIVAR/INATIVAR SUBCATEGORIA
    const handleToggleSubcategory = async (subcategoryId, categoryId, currentStatus) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;

            await apiBackend.patch(`/subcategories/${subcategoryId}/status`, {
                ativo: newStatus
            });

            // Atualizar o estado local
            setSubcategories(prev => ({
                ...prev,
                [categoryId]: prev[categoryId].map(sub =>
                    sub.id === subcategoryId
                        ? { ...sub, ativo: newStatus }
                        : sub
                )
            }));

            console.log(`Subcategoria ${subcategoryId} ${newStatus === 1 ? 'ativada' : 'inativada'} com sucesso`);

        } catch (error) {
            console.error("Erro ao atualizar subcategoria:", error);
            alert("Erro ao atualizar status da subcategoria");
        }
    };

    const applySearch = () => {
        if (searchTerm === "") {
            setFilteredCategories(categories);
            return;
        }

        const filtered = categories.filter(category => {
            const categoryMatch = category.name?.toLowerCase().includes(searchTerm.toLowerCase());

            const subcategoryMatch = subcategories[category.id]?.some(sub =>
                sub.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );

            return categoryMatch || subcategoryMatch;
        });

        setFilteredCategories(filtered);
    };

    const handleOpenFilter = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseFilter = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ p: 7, backgroundColor: "#fdfdfd", minHeight: "100vh" }}>
            <BackButton to="/" />
            {/* Header */}
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, mt: -1 }}>
                Gerenciar Categorias
            </Typography>

            {/* Toolbar */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Stack direction="row" spacing={2}>
                    <TextField
                        placeholder="Pesquisar..."
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ width: 300, backgroundColor: "#fff" }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon color="disabled" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* BOTÃO FILTRO */}
                    <Button
                        variant="outlined"
                        startIcon={<FilterListIcon />}
                        endIcon={<KeyboardArrowDownIcon />}
                        onClick={handleOpenFilter}
                        sx={{
                            height: 40,
                            px: 2.5,
                            textTransform: "none",
                            borderRadius: "999px",
                            borderColor: "#e0e0e0",
                            color: "#000",
                            backgroundColor: "#fff",
                        }}
                    >
                        Filtros
                    </Button>

                    {/* POPOVER - Preparado para futuros filtros */}
                    <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleCloseFilter}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        transformOrigin={{ vertical: "top", horizontal: "left" }}
                        PaperProps={{
                            sx: {
                                mt: 1,
                                width: 340,
                                borderRadius: 2,
                                p: 3,
                            },
                        }}
                    >
                        <Typography fontWeight={600} fontSize={16} mb={2}>
                            Filtros
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography color="text.secondary" fontSize={14}>
                            Filtros adicionais em breve...
                        </Typography>
                    </Popover>
                </Stack>

                <Button
                    variant="contained"
                    onClick={() => navigate("/cadastro-categoria")}
                    sx={{
                        backgroundColor: "#2F3A32",
                        "&:hover": { backgroundColor: "#1e2a22" },
                        textTransform: "uppercase",
                        borderRadius: 4,
                    }}
                >
                    Cadastrar Nova Categoria
                </Button>
            </Stack>

            {/* ACCORDIONS DE CATEGORIAS */}
            <Box>
                {filteredCategories.map((category) => (
                    <Accordion
                        key={category.id}
                        sx={{
                            mb: 1,
                            border: "1px solid #eee",
                            borderRadius: "8px !important",
                            "&:before": { display: "none" },
                            boxShadow: "none"
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                                backgroundColor: "#fff",
                                borderRadius: "8px",
                                "&:hover": { backgroundColor: "#fafafa" }
                            }}
                        >
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ width: "100%", pr: 2 }}
                            >
                                <Typography fontWeight={600}>
                                    {category.name}
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    <IconButton
                                        size="small"
                                        sx={{ backgroundColor: "#f5f5f5" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/adicionar-subcategoria/${category.id}`);
                                        }}
                                    >
                                        <AddIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                            </Stack>
                        </AccordionSummary>

                        <AccordionDetails sx={{ backgroundColor: "#fafafa", pt: 2 }}>
                            {subcategories[category.id]?.length > 0 ? (
                                <Stack spacing={1.5}>
                                    {subcategories[category.id].map((subcategory) => (
                                        <Stack
                                            key={subcategory.id}
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            sx={{
                                                p: 2,
                                                backgroundColor: "#fff",
                                                borderRadius: 1,
                                                border: "1px solid #eee",
                                                opacity: subcategory.ativo === 0 ? 0.5 : 1, // ⬅️ VISUAL PARA INATIVAS
                                            }}
                                        >
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Typography>{subcategory.name}</Typography>
                                                {/* ⬅️ BADGE DE STATUS */}
                                                <Chip
                                                    label={subcategory.ativo === 1 ? "Ativa" : "Inativa"}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: subcategory.ativo === 1 ? "#e8f5e9" : "#ffebee",
                                                        color: subcategory.ativo === 1 ? "#2e7d32" : "#c62828",
                                                        fontWeight: 600,
                                                        fontSize: 11,
                                                    }}
                                                />
                                            </Stack>

                                            <Stack direction="row" spacing={1} alignItems="center">
                                                {/* ⬅️ SWITCH PARA ATIVAR/INATIVAR */}
                                                <Switch
                                                    checked={subcategory.ativo === 1}
                                                    onChange={() => handleToggleSubcategory(
                                                        subcategory.id,
                                                        category.id,
                                                        subcategory.ativo
                                                    )}
                                                    sx={{
                                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                                            color: '#2e7d32',
                                                        },
                                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                            backgroundColor: '#4caf50',
                                                        },
                                                    }}
                                                />

                                                <IconButton
                                                    size="small"
                                                    sx={{ backgroundColor: "#f5f5f5" }}
                                                    onClick={() => {
                                                        //  NAVEGAR PARA ROTA DE EDIÇÃO
                                                        navigate(`/editar-subcategoria/${subcategory.id}`);
                                                    }}
                                                >
                                                    <EditOutlinedIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        </Stack>
                                    ))}
                                </Stack>
                            ) : (
                                <Typography color="text.secondary" fontSize={14}>
                                    Nenhuma subcategoria encontrada
                                </Typography>
                            )}
                        </AccordionDetails>
                    </Accordion>
                ))}

                {filteredCategories.length === 0 && (
                    <Box sx={{ textAlign: "center", py: 5 }}>
                        <Typography color="text.secondary">
                            Nenhuma categoria encontrada
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}