import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Stack,
    Popover,
    Divider,
    MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useEffect, useState } from "react";
import apiBackend from "../services/apiBackend";
import { useNavigate } from 'react-router-dom';
import BackButton from "../components/BackButton";

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

const getPrioridadeColor = (prioridade) => {
    switch (prioridade?.toLowerCase()) {
        case "baixa": return "#388E3C";
        case "média": return "#F9A825";
        case "alta": return "#E65100";
        case "urgente": return "#6A1B9A";
        default: return "#999";
    }
};

export default function CallList() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [calls, setCalls] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        dateStart: "",
        dateEnd: "",
        category: "",
        status: "",
        id: "",
    });

    const clearFilters = async () => {
        setFilters({ dateStart: "", dateEnd: "", category: "", status: "", id: "" });
        const { data } = await apiBackend.get("/calleds");
        setCalls(data);
    };

    const open = Boolean(anchorEl);
    const handleOpenFilter = (e) => setAnchorEl(e.currentTarget);
    const handleCloseFilter = () => setAnchorEl(null);

    useEffect(() => {
        const loadCalls = async () => {
            try {
                const { data } = await apiBackend.get("/calleds");
                setCalls(data);
            } catch (error) {
                console.error("Erro ao buscar chamados:", error);
            }
        };
        loadCalls();
    }, []);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const { data } = await apiBackend.get("/categories");
                setCategories(data);
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
            }
        };
        loadCategories();
    }, []);

    const applyFilters = async () => {
        try {
            const params = {};
            if (filters.category) params.id_category = filters.category;
            if (filters.status) params.id_status = filters.status;
            if (filters.id) params.id = filters.id;
            if (filters.dateStart && filters.dateEnd) {
                params.date_start = filters.dateStart;
                params.date_end = filters.dateEnd;
            }
            const { data } = await apiBackend.get("/calleds", { params });
            setCalls(data);
            handleCloseFilter();
        } catch (error) {
            console.error("Erro ao aplicar filtros:", error);
        }
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            const fetchSearch = async () => {
                const params = {};
                if (search) params.search = search;
                const { data } = await apiBackend.get("/calleds", { params });
                setCalls(data);
            };
            fetchSearch();
        }, 400);
        return () => clearTimeout(delay);
    }, [search]);

    return (
        <Box sx={{ width: "90%", mt: 4, marginLeft: 8, right: "100%" }}>
            <BackButton to="/" />

            <Typography variant="h5" fontWeight={600} mb={3}>
                Lista de Chamados
            </Typography>

            {/* BUSCA + FILTROS */}
            <Stack direction="row" spacing={2} mb={2} alignItems="center">
                <TextField
                    placeholder="Pesquisar..."
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{ endAdornment: <SearchIcon sx={{ color: "#9e9e9e" }} /> }}
                    sx={{ width: 300, borderRadius: "15px" }}
                />

                <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    endIcon={<KeyboardArrowDownIcon />}
                    onClick={handleOpenFilter}
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
                    onClose={handleCloseFilter}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    PaperProps={{ sx: { mt: 1, width: 340, borderRadius: 2, p: 3 } }}
                >
                    <Typography fontWeight={600} fontSize={16} mb={2}>Filtros</Typography>
                    <Divider sx={{ mb: 2 }} />

                    {/* DATAS */}
                    <Box mb={3}>
                        <Stack direction="row" justifyContent="space-between" mb={1}>
                            <Typography fontWeight={500}>Intervalo de datas</Typography>
                            <Typography fontSize={13} color="text.secondary">Limpar</Typography>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <TextField label="De:" type="date" size="small" InputLabelProps={{ shrink: true }} fullWidth
                                value={filters.dateStart} onChange={(e) => setFilters({ ...filters, dateStart: e.target.value })} />
                            <TextField label="Até:" type="date" size="small" InputLabelProps={{ shrink: true }} fullWidth
                                value={filters.dateEnd} onChange={(e) => setFilters({ ...filters, dateEnd: e.target.value })} />
                        </Stack>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* CATEGORIA */}
                    <Box mb={3}>
                        <Stack direction="row" justifyContent="space-between" mb={1}>
                            <Typography fontWeight={500}>Categoria</Typography>
                            <Typography fontSize={13} color="text.secondary">Limpar</Typography>
                        </Stack>
                        <TextField select size="small" fullWidth value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
                            <MenuItem value="">Todas as categorias</MenuItem>
                            {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* STATUS */}
                    <Box mb={3}>
                        <Stack direction="row" justifyContent="space-between" mb={1}>
                            <Typography fontWeight={500}>Status</Typography>
                            <Typography fontSize={13} color="text.secondary">Limpar</Typography>
                        </Stack>
                        <TextField select size="small" fullWidth value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="1">Aberto</MenuItem>
                            <MenuItem value="2">Em andamento</MenuItem>
                            <MenuItem value="3">Aguardando usuário</MenuItem>
                            <MenuItem value="4">Finalizado</MenuItem>
                        </TextField>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* ID */}
                    <Box mb={3}>
                        <Stack direction="row" justifyContent="space-between" mb={1}>
                            <Typography fontWeight={500}>ID</Typography>
                            <Typography fontSize={13} color="text.secondary">Limpar</Typography>
                        </Stack>
                        <TextField size="small" placeholder="Pesquisar" fullWidth value={filters.id}
                            onChange={(e) => setFilters({ ...filters, id: e.target.value })} />
                    </Box>

                    <Stack direction="row" spacing={2}>
                        <Button sx={{ color: "#000", borderColor: "#b0b0b0" }} variant="outlined" fullWidth onClick={clearFilters}>
                            Limpar tudo
                        </Button>
                        <Button variant="contained" fullWidth sx={{ backgroundColor: "#2F3A32" }} onClick={applyFilters}>
                            Aplicar filtros
                        </Button>
                    </Stack>
                </Popover>
            </Stack>

            {/* TABELA */}
            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600, width: 110 }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 600, width: 100 }} align="center">Categoria</TableCell>
                            <TableCell sx={{ fontWeight: 600, width: 250 }} align="center">Status</TableCell>
                            <TableCell sx={{ fontWeight: 600, width: 220 }} align="center">Responsável</TableCell>
                            <TableCell sx={{ fontWeight: 600, width: 100 }} align="center">Prioridade</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {calls.map((call) => {
                            const displayStatus = call.reopen_reason ? "Reaberto" : call.status;

                            return (
                                <TableRow key={call.id} hover onClick={() => navigate(`/chamados/${call.id}`, { state: { from: "/lista-chamados" } })}>
                                    <TableCell>#{call.id}</TableCell>

                                    <TableCell align="center">{call.categoria}</TableCell>

                                    <TableCell align="center">
                                        {call.financial_approval_required && call.financial_approval_status !== 'approved'
                                            ? (
                                                <Chip
                                                    label="Ag. Aceite Financeiro"
                                                    size="small"
                                                    variant="outlined"
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
                                                    variant="outlined"
                                                    sx={{
                                                        height: 22, px: 1.5, fontSize: 12, fontWeight: 500,
                                                        borderRadius: "50px",
                                                        bgcolor: getStatusColor(displayStatus).bg + "40",
                                                        borderColor: getStatusColor(displayStatus).bg,
                                                        color: getStatusColor(displayStatus).text,
                                                    }}
                                                />
                                            )
                                        }
                                    </TableCell>

                                    <TableCell align="center">{call.responsavel}</TableCell>

                                    <TableCell align="center">
                                        <Typography fontWeight={600} fontSize={14} color={getPrioridadeColor(call.prioridade)}>
                                            {call.prioridade ?? "-"}
                                        </Typography>
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