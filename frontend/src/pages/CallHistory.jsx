import { useEffect, useState } from "react";
import {
    Box, Typography, Paper, Chip, Button, Divider,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Tooltip, TextField,
    InputAdornment, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import apiBackend from "../services/apiBackend";
import AppAlert from "../components/AppAlert";
import BackButton from "../components/BackButton";
import { RoleAccess } from "../components/RoleBasedAccess";

const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case "finalizado": return { bg: "#9575CD", text: "#6A1B9A" };
        default: return { bg: "#E0E0E0", text: "#424242" };
    }
};

const formatHoras = (closing_date) => {
    if (!closing_date) return "-";
    const horas = Math.floor((new Date() - new Date(closing_date)) / (1000 * 60 * 60));
    return `${horas}h`;
};

export default function CallHistory() {
    const [chamados, setChamados] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
    const [modalDescricao, setModalDescricao] = useState({ open: false, texto: "", id: null });
    const [modalReabrir, setModalReabrir] = useState({ open: false, id: null });
    const [motivoReabrir, setMotivoReabrir] = useState("");

    const fetchHistorico = async () => {
        try {
            const { data } = await apiBackend.get('/calleds/historico');
            setChamados(data);
            setFiltered(data);
        } catch (error) {
            console.error("Erro ao buscar histórico:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchHistorico(); }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(
            chamados.filter(c =>
                String(c.id).includes(q) ||
                c.categoria?.toLowerCase().includes(q) ||
                c.responsavel?.toLowerCase().includes(q) ||
                c.status?.toLowerCase().includes(q)
            )
        );
    }, [search, chamados]);

    const handleReabrir = async () => {
        if (!motivoReabrir.trim()) {
            setAlert({ open: true, message: "Informe o motivo da reabertura.", severity: "warning" });
            return;
        }
        try {
            await apiBackend.patch(`/calleds/${modalReabrir.id}/reabrir`, { reopen_reason: motivoReabrir });
            setAlert({ open: true, message: "Chamado reaberto com sucesso!", severity: "success" });
            setModalReabrir({ open: false, id: null });
            setMotivoReabrir("");
            fetchHistorico();
        } catch (err) {
            setAlert({ open: true, message: err.response?.data?.message || "Erro ao reabrir chamado.", severity: "error" });
        }
    };

    if (loading) return <Box sx={{ p: 5 }}>Carregando...</Box>;

    return (
        <Box sx={{ pl: 5, py: 4, width: "94%" }}>
            <BackButton to="/" />

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                Histórico de Chamados
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField
                    size="small"
                    placeholder="Pesquisar..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ width: 260, bgcolor: "#fff", borderRadius: 1 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon fontSize="small" sx={{ color: "#999" }} />
                            </InputAdornment>
                        )
                    }}
                />
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #E0E0E0", borderRadius: 2 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: "#FAFAFA" }}>
                            <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.82rem", py: 2 }}>ID</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.82rem" }}>Categoria</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.82rem" }}>Status</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.82rem" }}>Responsável</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.82rem" }}>Fechado há</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.82rem" }}>Finalização</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.82rem" }}>Reabrir</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 5, color: "#999", fontSize: "0.85rem" }}>
                                    Nenhum chamado finalizado encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map(called => (
                                <TableRow key={called.id} hover sx={{ "&:last-child td": { border: 0 } }}>
                                    <TableCell align="center" sx={{ fontSize: "0.82rem", color: "#555" }}>
                                        #{called.id}
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontSize: "0.82rem" }}>
                                        {called.categoria ?? "-"}
                                    </TableCell>
                                    <TableCell align="center">
                                        {called.financial_approval_required && called.financial_approval_status === 'rejected'
                                            ? (
                                                <Chip label="Aceite Rejeitado" size="small" variant="outlined"
                                                    sx={{ bgcolor: "#FFEBEE", borderColor: "#EF9A9A", color: "#C62828", fontWeight: "bold", height: 22, fontSize: "0.72rem", borderRadius: "999px", border: "1px solid #EF9A9A" }}
                                                />
                                            ) : (
                                                <Chip label={called.status} size="small" variant="outlined"
                                                    sx={{ bgcolor: getStatusColor(called.status).bg + "40", borderColor: getStatusColor(called.status).bg, color: getStatusColor(called.status).text, fontWeight: "bold", height: 22, fontSize: "0.72rem", borderRadius: "999px" }}
                                                />
                                            )
                                        }
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontSize: "0.82rem" }}>
                                        {called.responsavel ?? "-"}
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontSize: "0.82rem", color: "#555" }}>
                                        {formatHoras(called.closing_date)}
                                    </TableCell>

                                    <TableCell align="center">
                                        {called.finalizacao_descricao ? (
                                            <Tooltip title="Ver descrição de finalização">
                                                <IconButton size="small"
                                                    onClick={() => setModalDescricao({ open: true, texto: called.finalizacao_descricao, id: called.id })}
                                                    sx={{ color: "#7E57C2" }}
                                                >
                                                    <DescriptionOutlinedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Typography sx={{ fontSize: "0.78rem", color: "#bbb" }}>—</Typography>
                                        )}
                                    </TableCell>

                                    <TableCell align="center">
                                        <RoleAccess roles={[1, 3]}>
                                            {called.pode_reabrir ? (
                                                <Button size="small" variant="contained"
                                                    onClick={() => setModalReabrir({ open: true, id: called.id })}
                                                    sx={{ textTransform: "none", fontSize: "0.78rem", fontWeight: "bold", bgcolor: "#4CAF50", "&:hover": { bgcolor: "#388E3C" }, borderRadius: "6px", px: 2.5 }}
                                                >
                                                    Reabrir
                                                </Button>
                                            ) : (
                                                <Tooltip title="Prazo de reabertura expirado (48h)">
                                                    <span>
                                                        <Button size="small" variant="contained" disabled
                                                            sx={{ textTransform: "none", fontSize: "0.78rem", fontWeight: "bold", borderRadius: "6px", px: 2.5 }}
                                                        >
                                                            Indisponível
                                                        </Button>
                                                    </span>
                                                </Tooltip>
                                            )}
                                        </RoleAccess>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* MODAL DESCRIÇÃO FINALIZAÇÃO */}
            <Dialog open={modalDescricao.open} onClose={() => setModalDescricao({ open: false, texto: "", id: null })} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: "bold", pb: 1 }}>
                    Descrição de Finalização — #{modalDescricao.id}
                </DialogTitle>
                <DialogContent dividers>
                    <Typography sx={{ fontSize: "0.92rem", color: "#444", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {modalDescricao.texto}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalDescricao({ open: false, texto: "", id: null })}>Fechar</Button>
                </DialogActions>
            </Dialog>

            {/* MODAL REABRIR */}
            <Dialog open={modalReabrir.open} onClose={() => { setModalReabrir({ open: false, id: null }); setMotivoReabrir(""); }} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                    Reabrir Chamado #{modalReabrir.id}
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Informe o motivo da reabertura deste chamado.
                    </Typography>
                    <TextField
                        label="Motivo da reabertura"
                        multiline rows={4} fullWidth
                        value={motivoReabrir}
                        onChange={(e) => setMotivoReabrir(e.target.value)}
                        size="small"
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => { setModalReabrir({ open: false, id: null }); setMotivoReabrir(""); }} sx={{ textTransform: "none", color: "#666" }}>
                        Cancelar
                    </Button>
                    <Button variant="contained" onClick={handleReabrir}
                        sx={{ textTransform: "none", bgcolor: "#4CAF50", "&:hover": { bgcolor: "#388E3C" } }}>
                        Confirmar Reabertura
                    </Button>
                </DialogActions>
            </Dialog>

            <AppAlert
                open={alert.open}
                onClose={() => setAlert({ ...alert, open: false })}
                severity={alert.severity}
                message={alert.message}
            />
        </Box>
    );
}