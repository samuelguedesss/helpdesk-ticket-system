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

export default function ManagerUsers() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [costCenters, setCostCenters] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (users.length > 0) {
            applyFilters();
        }
    }, [searchTerm, users]);

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
        const fetchUsers = async () => {
            try {
                const response = await apiBackend.get("/user");
                setUsers(response.data);
                setFilteredUsers(response.data);
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
            }
        };
        fetchUsers();
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

    // ⬅️ NOVA FUNÇÃO - ATIVAR/INATIVAR USUÁRIO
    const handleToggleUser = async (userId, currentStatus) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;

            await apiBackend.patch(`/user/${userId}/status`, {
                ativo: newStatus
            });

            // Atualizar estado local (ambos: users e filteredUsers)
            setUsers(prev => prev.map(user =>
                user.id === userId ? { ...user, ativo: newStatus } : user
            ));

            setFilteredUsers(prev => prev.map(user =>
                user.id === userId ? { ...user, ativo: newStatus } : user
            ));

            console.log(`Usuário ${userId} ${newStatus === 1 ? 'ativado' : 'inativado'} com sucesso`);

        } catch (error) {
            console.error("Erro ao atualizar status do usuário:", error);
            alert("Erro ao atualizar status do usuário");
        }
    };

    /* ===== FILTER LOGIC ===== */
    const applyFilters = () => {
        const result = users.filter((user) => {
            // Filtros do popover
            const matchFilters = (
                user.name?.toLowerCase().includes(filters.name.toLowerCase()) &&
                user.email?.toLowerCase().includes(filters.email.toLowerCase()) &&
                (user.department?.name || "")
                    .toLowerCase()
                    .includes(filters.department.toLowerCase()) &&
                (user.costCenter?.name || "")
                    .toLowerCase()
                    .includes(filters.costCenter.toLowerCase())
            );

            // Pesquisa global
            const matchSearch = searchTerm === "" || (
                user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.department?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.costCenter?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
            );

            return matchFilters && matchSearch;
        });

        setFilteredUsers(result);
    };

    const clearFilters = () => {
        setFilters({
            name: "",
            email: "",
            department: "",
            costCenter: "",
        });
        setSearchTerm("");
        setFilteredUsers(users);
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
                Gerenciar Usuários
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
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Ação</TableCell>
                        </TableRow>
                    </TableHead>

                    {/* BODY */}
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar sx={{ width: 32, height: 30 }}>
                                            {user.name?.charAt(0)}
                                        </Avatar>
                                        <Typography>{user.name}</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>{user.department?.name || "-"}</TableCell>
                                <TableCell>{user.costCenter?.name?.slice(0, 4) || "-"}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell align="center">
                                    <Box
                                        sx={{
                                            display: "inline-block",
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: "12px",
                                            fontSize: 13,
                                            fontWeight: 500,
                                            backgroundColor: user.ativo === 1 ? "#e8f5e9" : "#ffebee",
                                            color: user.ativo === 1 ? "#2e7d32" : "#c62828",
                                        }}
                                    >
                                        {user.ativo === 1 ? "Ativo" : "Inativo"}
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    {/* ⬅️ STACK COM SWITCH + BOTÃO EDITAR */}
                                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                                        {/* SWITCH */}
                                        <Switch
                                            checked={user.ativo === 1}
                                            onChange={() => handleToggleUser(user.id, user.ativo)}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: '#2e7d32',
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                    backgroundColor: '#4caf50',
                                                },
                                            }}
                                        />

                                        {/* BOTÃO EDITAR */}
                                        <IconButton
                                            size="small"
                                            sx={{ backgroundColor: "#f5f5f5" }}
                                            onClick={() => {
                                                navigate(`/editar-usuario/${user.id}`); // ⬅️ DESCOMENTAR ESTA LINHA
                                            }}
                                        >
                                            <EditOutlinedIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* FOOTER */}
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                <Typography variant="caption">
                    Total <b>{filteredUsers.length}</b>
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