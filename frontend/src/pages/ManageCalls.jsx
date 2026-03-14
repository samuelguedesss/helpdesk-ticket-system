import {
    Box, Paper, Typography, TextField, Button, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Chip, Stack,
    Popover, Divider, MenuItem, IconButton, Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import apiBackend from "../services/apiBackend";

const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case "aberto": return { bg: "#81C784", text: "#388E3C" };
        case "em andamento": return { bg: "#FFD54F", text: "#F9A825" };
        case "aguardando usuário": return { bg: "#FFB74D", text: "#E65100" };
        case "finalizado": return { bg: "#9575CD", text: "#6A1B9A" };
        case "fechado": return { bg: "#BDBDBD", text: "#424242" };
        case "reaberto": return { bg: "#81C784", text: "#388E3C" };
        default: return { bg: "#E0E0E0", text: "#333" };
    }
};

export default function ManageCalls() {
    const [calls, setCalls] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [filters, setFilters] = useState({
        dateStart: "", dateEnd: "", category: "", status: "", id: "",
    });
    const navigate = useNavigate();
    const open = Boolean(anchorEl);

    const loadCalls = async (params = {}) => {
        try {
            const { data } = await apiBackend.get("/calleds/tecnico", { params });
            setCalls(data);
        } catch (err) {
            console.error("Erro ao buscar chamados:", err);
        }
    };

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const { data } = await apiBackend.get("/categories");
                setCategories(data);
            } catch (err) {
                console.error("Erro ao buscar categorias:", err);
            }
        };
        loadCategories();
        loadCalls();
    }, []);

    useEffect(() => {
        const delay = setTimeout(() => {
            loadCalls(search ? { search } : {});
        }, 400);
        return () => clearTimeout(delay);
    }, [search]);

    const handleAssumir = async (callId) => {
        try {
            await apiBackend.patch(`/calleds/${callId}/assumir`);
            setCalls(prev =>
                prev.map(c =>
                    c.id === callId ? { ...c, status: "Em andamento", assumido: true } : c
                )
            );
        } catch (err) {
            console.error("Erro ao assumir chamado:", err);
        }
    };

    const applyFilters = async () => {
        const params = {};
        if (filters.category) params.id_category = filters.category;
        if (filters.status) params.status = filters.status;
        if (filters.id) params.id = filters.id;
        if (filters.dateStart && filters.dateEnd) {
            params.date_start = filters.dateStart;
            params.date_end = filters.dateEnd;
        }
        await loadCalls(params);
        setAnchorEl(null);
    };

    const clearFilters = async () => {
        setFilters({ dateStart: "", dateEnd: "", category: "", status: "", id: "" });
        await loadCalls();
    };

    return (
        <Box sx={{ width: "90%", mt: 4, ml: 8 }}>
            <BackButton to="/" />

            <Typography variant="h5" fontWeight={600} mb={3}>
                Gerenciar Chamados
            </Typography>

            <Stack direction="row" spacing={2} mb={2} alignItems="center">
                <TextField
                    placeholder="Pesquisar..."
                    size="small"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    InputProps={{ endAdornment: <SearchIcon sx={{ color: "#9e9e9e" }} /> }}
                    sx={{ width: 300 }}
                />
                <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    endIcon={<KeyboardArrowDownIcon />}
                    onClick={e => setAnchorEl(e.currentTarget)}
                    sx={{
                        height: 40, px: 2.5, textTransform: "none", borderRadius: "999px",
                        borderColor: "#e0e0e0", color: "#000", fontWeight: 500, backgroundColor: "#fff",
                        "&:hover": { backgroundColor: "#fafafa", borderColor: "#e0e0e0" },
                    }}
                >
                    Filtros
                </Button>

                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    PaperProps={{ sx: { mt: 1, width: 340, borderRadius: 2, p: 3 } }}
                >
                    <Typography fontWeight={600} fontSize={16} mb={2}>Filtros</Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Box mb={3}>
                        <Stack direction="row" justifyContent="space-between" mb={1}>
                            <Typography fontWeight={500}>Intervalo de datas</Typography>
                            <Typography fontSize={13} color="text.secondary" sx={{ cursor: "pointer" }}
                                onClick={() => setFilters(f => ({ ...f, dateStart: "", dateEnd: "" }))}>
                                Limpar
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <TextField label="De:" type="date" size="small" InputLabelProps={{ shrink: true }} fullWidth
                                value={filters.dateStart}
                                onChange={e => setFilters(f => ({ ...f, dateStart: e.target.value }))} />
                            <TextField label="Até:" type="date" size="small" InputLabelProps={{ shrink: true }} fullWidth
                                value={filters.dateEnd}
                                onChange={e => setFilters(f => ({ ...f, dateEnd: e.target.value }))} />
                        </Stack>
                    </Box>
                    <Divider sx={{ mb: 2 }} />

                    <Box mb={3}>
                        <Stack direction="row" justifyContent="space-between" mb={1}>
                            <Typography fontWeight={500}>Categoria</Typography>
                            <Typography fontSize={13} color="text.secondary" sx={{ cursor: "pointer" }}
                                onClick={() => setFilters(f => ({ ...f, category: "" }))}>Limpar</Typography>
                        </Stack>
                        <TextField select size="small" fullWidth value={filters.category}
                            onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}>
                            <MenuItem value="">Todas as categorias</MenuItem>
                            {categories.map(cat => (
                                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <Divider sx={{ mb: 2 }} />

                    <Box mb={3}>
                        <Stack direction="row" justifyContent="space-between" mb={1}>
                            <Typography fontWeight={500}>Status</Typography>
                            <Typography fontSize={13} color="text.secondary" sx={{ cursor: "pointer" }}
                                onClick={() => setFilters(f => ({ ...f, status: "" }))}>Limpar</Typography>
                        </Stack>
                        <TextField select size="small" fullWidth value={filters.status}
                            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="1">
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <CircleIcon sx={{ fontSize: 10, color: "#4CAF50" }} />
                                    <Typography>Aberto</Typography>
                                </Stack>
                            </MenuItem>
                            <MenuItem value="2">Em andamento</MenuItem>
                            <MenuItem value="3">Aguardando usuário</MenuItem>
                        </TextField>
                    </Box>
                    <Divider sx={{ mb: 2 }} />

                    <Box mb={3}>
                        <Stack direction="row" justifyContent="space-between" mb={1}>
                            <Typography fontWeight={500}>ID</Typography>
                            <Typography fontSize={13} color="text.secondary" sx={{ cursor: "pointer" }}
                                onClick={() => setFilters(f => ({ ...f, id: "" }))}>Limpar</Typography>
                        </Stack>
                        <TextField size="small" placeholder="Pesquisar" fullWidth value={filters.id}
                            onChange={e => setFilters(f => ({ ...f, id: e.target.value }))} />
                    </Box>

                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" fullWidth sx={{ color: "#000", borderColor: "#b0b0b0" }}
                            onClick={clearFilters}>Limpar tudo</Button>
                        <Button variant="contained" fullWidth sx={{ backgroundColor: "#2F3A32" }}
                            onClick={applyFilters}>Aplicar filtros</Button>
                    </Stack>
                </Popover>
            </Stack>

            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600, width: 80 }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="center">Categoria</TableCell>
                            <TableCell sx={{ fontWeight: 600, width: 180 }} align="center">Status</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="center">Solicitante</TableCell>
                            <TableCell sx={{ fontWeight: 600, width: 130 }} align="center">Criado há</TableCell>
                            <TableCell sx={{ fontWeight: 600, width: 160 }} align="center">Ação</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {calls.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4, color: "#aaa" }}>
                                    Nenhum chamado encontrado
                                </TableCell>
                            </TableRow>
                        )}
                        {calls.map(call => {
                            const bloqueadoPorAceite = call.financial_approval_required && call.financial_approval_status !== 'approved';
                            const displayStatus = call.reopen_reason ? "Reaberto" : call.status;

                            return (
                                <TableRow key={call.id} hover>
                                    <TableCell>#{call.id}</TableCell>
                                    <TableCell align="center">{call.categoria}</TableCell>
                                    <TableCell align="center">
                                        {call.financial_approval_required && call.financial_approval_status !== 'approved'
                                            ? (
                                                <Chip
                                                    label="Ag. Aceite Financeiro"
                                                    size="small"
                                                    sx={{
                                                        height: 22, px: 1.5, fontSize: 12, fontWeight: 500,
                                                        borderRadius: "50px",
                                                        bgcolor: "#FFF8E1",
                                                        borderColor: "#FFD54F",
                                                        color: "#F9A825",
                                                        border: "1px solid #FFD54F",
                                                    }}
                                                />
                                            ) : (
                                                <Chip
                                                    label={displayStatus}
                                                    size="small"
                                                    sx={{
                                                        height: 22, px: 1.5, fontSize: 12, fontWeight: 500,
                                                        borderRadius: "50px",
                                                        bgcolor: getStatusColor(displayStatus).bg + "40",
                                                        border: `1px solid ${getStatusColor(displayStatus).bg}`,
                                                        color: getStatusColor(displayStatus).text,
                                                    }}
                                                />
                                            )
                                        }
                                    </TableCell>
                                    <TableCell align="center">{call.solicitante}</TableCell>
                                    <TableCell align="center">
                                        <Typography fontSize={13} color="text.secondary">
                                            {call.criadoHa}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                                            <Tooltip title={
                                                call.assumido ? "Já assumido" :
                                                    bloqueadoPorAceite ? "Aguardando aceite financeiro" :
                                                        "Assumir chamado"
                                            }>
                                                <span>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={<CheckCircleOutlineIcon sx={{ fontSize: 16 }} />}
                                                        disabled={call.assumido || bloqueadoPorAceite}
                                                        onClick={() => handleAssumir(call.id)}
                                                        sx={{
                                                            textTransform: "none", fontSize: 12,
                                                            borderRadius: "999px", height: 30, px: 1.5,
                                                            borderColor: (call.assumido || bloqueadoPorAceite) ? "#ccc" : "#2F3A32",
                                                            color: (call.assumido || bloqueadoPorAceite) ? "#aaa" : "#2F3A32",
                                                            "&:hover": { backgroundColor: "rgba(47,58,50,0.06)", borderColor: "#2F3A32" },
                                                            "&.Mui-disabled": { borderColor: "#ddd", color: "#bbb" },
                                                        }}
                                                    >
                                                        {call.assumido ? "Assumido" : bloqueadoPorAceite ? "Bloqueado" : "Assumir"}
                                                    </Button>
                                                </span>
                                            </Tooltip>
                                            <Tooltip title="Ver detalhes">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => navigate(`/chamados/${call.id}`)}
                                                    sx={{
                                                        color: "#1976d2",
                                                        "&:hover": { backgroundColor: "rgba(25,118,210,0.08)" },
                                                    }}
                                                >
                                                    <VisibilityOutlinedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}