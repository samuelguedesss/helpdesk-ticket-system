import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, Typography, Paper, Chip, IconButton, Tooltip,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TextField, InputAdornment, Button, Dialog,
    DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseIcon from "@mui/icons-material/Close";
import apiBackend from "../services/apiBackend";
import AppAlert from "../components/AppAlert";
import BackButton from "../components/BackButton";

export default function FinancialApproval() {
    const navigate = useNavigate();
    const [chamados, setChamados] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
    const [modalRejeitar, setModalRejeitar] = useState({ open: false, id: null });
    const [reason, setReason] = useState("");

    const fetchPendentes = async () => {
        try {
            const { data } = await apiBackend.get("/calleds/financial-approval");
            setChamados(data);
            setFiltered(data);
        } catch (err) {
            console.error("Erro ao buscar aprovações pendentes:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPendentes(); }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(
            chamados.filter(c =>
                String(c.id).includes(q) ||
                c.categoria?.toLowerCase().includes(q) ||
                c.subcategoria?.toLowerCase().includes(q) ||
                c.solicitante?.toLowerCase().includes(q)
            )
        );
    }, [search, chamados]);

    const handleAprovar = async (id) => {
        try {
            await apiBackend.patch(`/calleds/${id}/financial-approval`, { status: "approved" });
            setAlert({ open: true, message: "Chamado aprovado com sucesso!", severity: "success" });
            fetchPendentes();
        } catch (err) {
            setAlert({ open: true, message: err.response?.data?.message ?? "Erro ao aprovar.", severity: "error" });
        }
    };

    const handleConfirmarRejeitar = async () => {
        try {
            await apiBackend.patch(`/calleds/${modalRejeitar.id}/financial-approval`, {
                status: "rejected",
                reason,
            });
            setAlert({ open: true, message: "Chamado recusado.", severity: "info" });
            setModalRejeitar({ open: false, id: null });
            setReason("");
            fetchPendentes();
        } catch (err) {
            setAlert({ open: true, message: err.response?.data?.message ?? "Erro ao recusar.", severity: "error" });
        }
    };

    if (loading) return <Box sx={{ p: 5 }}>Carregando...</Box>;

    return (
        <Box sx={{ pl: 5, py: 4, width: "94%" }}>
            <BackButton to="/" />

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                Fila de Aprovações
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
                <TextField
                    size="small"
                    placeholder="Pesquisar..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ width: 240, bgcolor: "#fff", borderRadius: 1 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon fontSize="small" sx={{ color: "#999" }} />
                            </InputAdornment>
                        )
                    }}
                />
                <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    sx={{
                        height: 40, px: 2.5, textTransform: "none", borderRadius: "999px",
                        borderColor: "#e0e0e0", color: "#000", fontWeight: 500, bgcolor: "#fff",
                        "&:hover": { bgcolor: "#fafafa", borderColor: "#e0e0e0" },
                    }}
                >
                    Filtros
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #E0E0E0", borderRadius: 2 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: "#FAFAFA" }}>
                            <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.82rem", py: 2 }}>ID</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.82rem" }}>Categoria</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.82rem" }}>Status</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.82rem" }}>Motivo</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.82rem" }}>Valor</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.82rem" }}>Ação</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 5, color: "#999", fontSize: "0.85rem" }}>
                                    Nenhum chamado aguardando aprovação.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map(c => (
                                <TableRow key={c.id} hover sx={{ "&:last-child td": { border: 0 } }}>
                                    <TableCell align="center" sx={{ fontSize: "0.82rem", color: "#555" }}>#{c.id}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: "0.82rem" }}>{c.categoria ?? "-"}</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label="Aguardando aprovação"
                                            size="small"
                                            sx={{
                                                bgcolor: "#EDE7F6", color: "#6A1B9A",
                                                border: "1px solid #9575CD", fontWeight: "bold",
                                                fontSize: "0.72rem", height: 22, borderRadius: "999px",
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontSize: "0.82rem", color: "#555", maxWidth: 200 }}>
                                        <Typography noWrap fontSize="0.82rem" color="#555">{c.subcategoria ?? "-"}</Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontSize: "0.82rem", fontWeight: "bold" }}>
                                        {c.valor ? Number(c.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—'}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                                            <Tooltip title="Aprovar">
                                                <IconButton size="small" onClick={() => handleAprovar(c.id)} sx={{ color: "#4CAF50" }}>
                                                    <CheckCircleOutlineIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Recusar">
                                                <IconButton size="small" onClick={() => setModalRejeitar({ open: true, id: c.id })} sx={{ color: "#E53935" }}>
                                                    <CancelOutlinedIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Ver detalhes">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => navigate(`/chamados/${c.id}`, { state: { from: "/fila-aprovacao" } })}
                                                    sx={{ color: "#1976d2" }}
                                                >
                                                    <VisibilityOutlinedIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={modalRejeitar.open}
                onClose={() => { setModalRejeitar({ open: false, id: null }); setReason(""); }}
                maxWidth="sm" fullWidth
            >
                <DialogTitle sx={{ fontWeight: "bold", fontSize: "1rem", pr: 5 }}>
                    Recusar Autorização
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: "normal", mt: 0.5 }}>
                        Tem certeza de que deseja recusar esta solicitação?<br />
                        Ao prosseguir, a ação será registrada no histórico e o solicitante será notificado.
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={() => { setModalRejeitar({ open: false, id: null }); setReason(""); }}
                        sx={{ position: "absolute", right: 12, top: 12, color: "#999" }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Por favor, informe o motivo da recusa.
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>Motivo da recusa:</Typography>
                    <TextField
                        placeholder="Descreva o motivo da recusa..."
                        multiline rows={4} fullWidth
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        size="small"
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        variant="contained" fullWidth
                        disabled={!reason.trim()}
                        onClick={handleConfirmarRejeitar}
                        sx={{ bgcolor: "#2F3A32", "&:hover": { bgcolor: "#1a2320" }, textTransform: "uppercase", fontWeight: "bold", letterSpacing: 1 }}
                    >
                        Confirmar Recusa
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