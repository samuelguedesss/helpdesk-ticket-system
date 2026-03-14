import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    IconButton,
    Paper,
    Stack,
    Popover,
    MenuItem,
    Divider,
    Switch,
} from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useNavigate } from "react-router-dom";
import apiBackend from "../services/apiBackend";
import BackButton from "../components/BackButton";

export default function ManageTechnicians() {
    const navigate = useNavigate();

    const [tecnicos, setTecnicos] = useState([]);
    const [filteredTecnicos, setFilteredTecnicos] = useState([]);
    const [costCenters, setCostCenters] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (tecnicos.length > 0) {
            applyFilters();
        }
    }, [searchTerm, tecnicos]);

    // Popover
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [filters, setFilters] = useState({
        name: "",
        email: "",
        department: "",
        costCenter: "",
    });

    useEffect(() => {
        const fetchTecnicos = async () => {
            try {
                const response = await apiBackend.get("/user/tecnicos"); // ⬅️ ROTA DE TÉCNICOS
                setTecnicos(response.data);
                setFilteredTecnicos(response.data);
            } catch (error) {
                console.error("Erro ao buscar técnicos:", error);
            }
        };
        fetchTecnicos();
    }, []);

    useEffect(() => {
        const loadCostCenters = async () => {
            try {
                const response = await apiBackend.get("/costCenters");
                setCostCenters(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Erro ao carregar centros de custo:", error);
            }
        };

        const loadDepartments = async () => {
            try {
                const response = await apiBackend.get("/departments");
                setDepartments(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Erro ao carregar departamentos:", error);
            }
        };

        loadCostCenters();
        loadDepartments();
    }, []);

    // ⬅️ FUNÇÃO ATIVAR/INATIVAR TÉCNICO
    const handleToggleTecnico = async (tecnicoId, currentStatus) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;

            await apiBackend.patch(`/user/${tecnicoId}/status`, {
                ativo: newStatus
            });

            // Atualizar estado local
            setTecnicos(prev => prev.map(tec =>
                tec.id === tecnicoId ? { ...tec, ativo: newStatus } : tec
            ));

            setFilteredTecnicos(prev => prev.map(tec =>
                tec.id === tecnicoId ? { ...tec, ativo: newStatus } : tec
            ));

            console.log(`Técnico ${tecnicoId} ${newStatus === 1 ? 'ativado' : 'inativado'} com sucesso`);

        } catch (error) {
            console.error("Erro ao atualizar status do técnico:", error);
            alert("Erro ao atualizar status do técnico");
        }
    };

    /* ===== FILTER LOGIC ===== */
    const applyFilters = () => {
        const result = tecnicos.filter((tec) => {
            // Filtros do popover
            const matchFilters = (
                tec.name?.toLowerCase().includes(filters.name.toLowerCase()) &&
                tec.email?.toLowerCase().includes(filters.email.toLowerCase()) &&
                (tec.department?.name || "")
                    .toLowerCase()
                    .includes(filters.department.toLowerCase()) &&
                (tec.costCenter?.name || "")
                    .toLowerCase()
                    .includes(filters.costCenter.toLowerCase())
            );

            // Pesquisa global
            const matchSearch = searchTerm === "" || (
                tec.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tec.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (tec.department?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (tec.costCenter?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
            );

            return matchFilters && matchSearch;
        });

        setFilteredTecnicos(result);
    };

    const clearFilters = () => {
        setFilters({
            name: "",
            email: "",
            department: "",
            costCenter: "",
        });
        setSearchTerm("");
        setFilteredTecnicos(tecnicos);
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
                Gerenciar Técnicos
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

                    {/* POPOVER */}
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

                        {/* NOME */}
                        <Box mb={3}>
                            <Stack direction="row" justifyContent="space-between" mb={1}>
                                <Typography fontWeight={500}>Nome</Typography>
                                <Typography
                                    fontSize={13}
                                    color="text.secondary"
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => setFilters({ ...filters, name: "" })}
                                >
                                    Limpar
                                </Typography>
                            </Stack>

                            <TextField
                                size="small"
                                fullWidth
                                placeholder="Nome"
                                value={filters.name}
                                onChange={(e) =>
                                    setFilters({ ...filters, name: e.target.value })
                                }
                            />
                        </Box>

                        {/* EMAIL */}
                        <Box mb={3}>
                            <Stack direction="row" justifyContent="space-between" mb={1}>
                                <Typography fontWeight={500}>E-mail</Typography>
                                <Typography
                                    fontSize={13}
                                    color="text.secondary"
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => setFilters({ ...filters, email: "" })}
                                >
                                    Limpar
                                </Typography>
                            </Stack>

                            <TextField
                                size="small"
                                fullWidth
                                placeholder="E-mail"
                                value={filters.email}
                                onChange={(e) =>
                                    setFilters({ ...filters, email: e.target.value })
                                }
                            />
                        </Box>

                        {/* CENTRO DE CUSTO */}
                        <Box mb={3}>
                            <Stack direction="row" justifyContent="space-between" mb={1}>
                                <Typography fontWeight={500}>Centro de Custo</Typography>
                                <Typography
                                    fontSize={13}
                                    color="text.secondary"
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => setFilters({ ...filters, costCenter: "" })}
                                >
                                    Limpar
                                </Typography>
                            </Stack>

                            <TextField
                                select
                                size="small"
                                fullWidth
                                value={filters.costCenter}
                                onChange={(e) =>
                                    setFilters({ ...filters, costCenter: e.target.value })
                                }
                            >
                                <MenuItem value="">Todos</MenuItem>

                                {costCenters.map((cc) => (
                                    <MenuItem key={cc.id} value={cc.name}>
                                        {cc.name?.slice(0, 4)}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        {/* DEPARTAMENTO */}
                        <Box mb={3}>
                            <Stack direction="row" justifyContent="space-between" mb={1}>
                                <Typography fontWeight={500}>Departamento</Typography>
                                <Typography
                                    fontSize={13}
                                    color="text.secondary"
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => setFilters({ ...filters, department: "" })}
                                >
                                    Limpar
                                </Typography>
                            </Stack>

                            <TextField
                                select
                                size="small"
                                fullWidth
                                value={filters.department}
                                onChange={(e) =>
                                    setFilters({ ...filters, department: e.target.value })
                                }
                                SelectProps={{
                                    MenuProps: {
                                        PaperProps: {
                                            sx: {
                                                maxHeight: 195,
                                                mt: 1,
                                            },
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="">Todos</MenuItem>

                                {departments.map((dept) => (
                                    <MenuItem
                                        key={dept.id}
                                        value={dept.name}
                                        sx={{
                                            py: 1.2,
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        {dept.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {/* BOTÕES */}
                        <Stack direction="row" spacing={2}>
                            <Button
                                sx={{ color: "#000", borderColor: "#b0b0b0" }}
                                variant="outlined"
                                fullWidth
                                onClick={clearFilters}
                            >
                                Limpar tudo
                            </Button>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ backgroundColor: "#2F3A32" }}
                                onClick={() => {
                                    applyFilters();
                                    handleCloseFilter();
                                }}
                            >
                                Aplicar filtros
                            </Button>
                        </Stack>
                    </Popover>
                </Stack>

                {/* ⬅️ BOTÃO CADASTRAR REDIRECIONA PARA /cadastro-usuario */}
                <Button
                    variant="contained"
                    onClick={() => navigate("/cadastro-usuario")}
                    sx={{
                        backgroundColor: "#2F3A32",
                        "&:hover": { backgroundColor: "#1e2a22" },
                        textTransform: "uppercase",
                        borderRadius: 4,
                    }}
                >
                    Cadastrar Novo Usuário
                </Button>
            </Stack>

            {/* TABELA */}
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #eee", borderRadius: 2 }}>
                <Table>
                    {/* HEADER */}
                    <TableHead>
                        <TableRow>
                            <TableCell>Usuário</TableCell>
                            <TableCell>Departamento</TableCell>
                            <TableCell>Centro de Custo</TableCell>
                            <TableCell>E-mail</TableCell>
                            <TableCell align="center">Ação</TableCell>
                        </TableRow>
                    </TableHead>

                    {/* BODY */}
                    <TableBody>
                        {filteredTecnicos.map((tecnico) => (
                            <TableRow key={tecnico.id}>
                                <TableCell>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar sx={{ width: 32, height: 30 }}>
                                            {tecnico.name?.charAt(0)}
                                        </Avatar>
                                        <Typography>{tecnico.name}</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>{tecnico.department?.name || "-"}</TableCell>
                                <TableCell>{tecnico.costCenter?.name?.slice(0, 4) || "-"}</TableCell>
                                <TableCell>{tecnico.email}</TableCell>
                                <TableCell align="center">
                                    {/* ⬅️ BOTÃO EDITAR REDIRECIONA PARA /editar-usuario/:id */}
                                    <IconButton
                                        size="small"
                                        sx={{ backgroundColor: "#f5f5f5" }}
                                        onClick={() => navigate(`/editar-usuario/${tecnico.id}`)}
                                    >
                                        <EditOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* FOOTER */}
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                <Typography variant="caption">
                    Total <b>{filteredTecnicos.length}</b>
                </Typography>
                <Stack direction="row" spacing={0.5}>
                    <IconButton size="small" disabled>
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    <IconButton size="small">
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </Stack>
            </Stack>
        </Box>
    );
}