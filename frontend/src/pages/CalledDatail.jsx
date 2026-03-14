import React, { useEffect, useState } from "react";
import {
    Box, Typography, Paper, Chip, Button, Divider,
    MenuItem, Select, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField as MuiTextField,
    Tooltip
} from "@mui/material";
import { useParams, useLocation } from "react-router-dom";
import apiBackend from "../services/apiBackend";
import { TechnicianOnly, RoleAccess, FinancialOnly } from "../components/RoleBasedAccess";
import { useAuth } from "../context/AuthContext";
import AppAlert from "../components/AppAlert";
import BackButton from "../components/BackButton";
import ReplyIcon from "@mui/icons-material/Reply";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import ChatBox from "../components/ChatBox";

const STATUS_OPTIONS = [
    { id: 2, name: "Em andamento" },
    { id: 3, name: "Aguardando usuário" },
    { id: 4, name: "Finalizado" },
];

const PRIORIDADE_OPTIONS = [
    { id: 1, name: "Baixa" },
    { id: 2, name: "Média" },
    { id: 3, name: "Alta" },
    { id: 4, name: "Urgente" },
];

export default function CalledDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const location = useLocation();
    const [called, setCalled] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalFinalizar, setModalFinalizar] = useState(false);
    const [descFinalizar, setDescFinalizar] = useState("");
    const [statusSelecionado, setStatusSelecionado] = useState("");
    const [modalNegar, setModalNegar] = useState(false);
    const [motivoNegar, setMotivoNegar] = useState("");
    const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
    const [attachments, setAttachments] = useState([]);
    const [attachmentPreview, setAttachmentPreview] = useState(null);

    const fetchCalled = async () => {
        try {
            const { data } = await apiBackend.get(`/calleds/${id}`);
            setCalled(data);
            // busca anexos do chamado
            const { data: att } = await apiBackend.get(`/calledsAttachments/${id}`);
            setAttachments(att);
        } catch (error) {
            console.error("Erro ao buscar chamado:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCalled(); }, [id]);

    const handleAssumir = async () => {
        try {
            await apiBackend.patch(`/calleds/${id}/assumir`);
            await fetchCalled();
            setAlert({ open: true, message: "Chamado assumido com sucesso!", severity: "success" });
        } catch (err) {
            setAlert({ open: true, message: "Erro ao assumir chamado.", severity: "error" });
        }
    };

    const handleStatusChange = async (novoStatus) => {
        if (Number(novoStatus) === 4) {
            setStatusSelecionado(novoStatus);
            setModalFinalizar(true);
            return;
        }
        try {
            await apiBackend.patch(`/calleds/${id}/status`, { id_status: novoStatus });
            await fetchCalled();
            setAlert({ open: true, message: "Status atualizado com sucesso!", severity: "success" });
        } catch (err) {
            setAlert({ open: true, message: "Erro ao atualizar status.", severity: "error" });
        }
    };

    const handleConfirmarFinalizar = async () => {
        try {
            await apiBackend.patch(`/calleds/${id}/status`, {
                id_status: statusSelecionado,
                finalizacao_descricao: descFinalizar,
            });
            setModalFinalizar(false);
            setDescFinalizar("");
            await fetchCalled();
            setAlert({ open: true, message: "Chamado finalizado com sucesso!", severity: "success" });
        } catch (err) {
            setAlert({ open: true, message: "Erro ao finalizar chamado.", severity: "error" });
        }
    };

    const handlePrioridadeChange = async (novaPrioridade) => {
        try {
            await apiBackend.patch(`/calleds/${id}/prioridade`, { id_priority: novaPrioridade });
            await fetchCalled();
            setAlert({ open: true, message: "Prioridade atualizada com sucesso!", severity: "success" });
        } catch (err) {
            setAlert({ open: true, message: "Erro ao atualizar prioridade.", severity: "error" });
        }
    };

    const handleAprovar = async () => {
        try {
            await apiBackend.patch(`/calleds/${id}/financial-approval`, { status: "approved" });
            await fetchCalled();
            setAlert({ open: true, message: "Aceite aprovado com sucesso!", severity: "success" });
        } catch (err) {
            setAlert({ open: true, message: "Erro ao aprovar aceite.", severity: "error" });
        }
    };

    const handleConfirmarNegar = async () => {
        if (!motivoNegar.trim()) {
            setAlert({ open: true, message: "Informe o motivo da rejeição.", severity: "warning" });
            return;
        }
        try {
            await apiBackend.patch(`/calleds/${id}/financial-approval`, {
                status: "rejected",
                reason: motivoNegar,
            });
            setModalNegar(false);
            setMotivoNegar("");
            await fetchCalled();
            setAlert({ open: true, message: "Aceite rejeitado. Chamado finalizado automaticamente.", severity: "info" });
        } catch (err) {
            setAlert({ open: true, message: "Erro ao rejeitar aceite.", severity: "error" });
        }
    };

    if (loading) return <Box sx={{ p: 5 }}>Carregando...</Box>;
    if (!called) return <Box sx={{ p: 5 }}>Chamado não encontrado</Box>;

    const normalFields = called.fields?.filter(f => f.type !== "textarea") ?? [];
    const textareas = called.fields?.filter(f => f.type === "textarea") ?? [];
    const formatDate = (date) => date ? new Date(date).toLocaleString("pt-BR") : "-";

    const jaAssumido = !!called.responsavel && called.responsavel !== "Aguardando Tecnico responsavel";
    const finalizado = called.status?.toLowerCase() === "finalizado";
    const bloqueadoPorAceite = !!called.financial_approval_required && called.financial_approval_status !== 'approved';
    const pendenteAceite = !!called.financial_approval_required && called.financial_approval_status === 'pending';

    const backRoute =
        location.state?.from === "/fila-aprovacao" ? "/fila-aprovacao" :
            location.state?.from === "/lista-chamados" ? "/lista-chamados" :
                user?.role === 2 ? "/Gerenciar-chamados" :
                    "/lista-chamados";

    const getPrioridadeColor = (p) => {
        switch (p?.toLowerCase()) {
            case "baixa": return { bg: "#81C784", text: "#388E3C" };
            case "média": return { bg: "#FFD54F", text: "#F9A825" };
            case "alta": return { bg: "#FFB74D", text: "#E65100" };
            case "urgente": return { bg: "#9575CD", text: "#6A1B9A" };
            default: return { bg: "#E0E0E0", text: "#333" };
        }
    };

    const getStatusColor = (s) => {
        switch (s?.toLowerCase()) {
            case "aberto": return { bg: "#81C784", text: "#388E3C" };
            case "em andamento": return { bg: "#FFD54F", text: "#F9A825" };
            case "aguardando usuário": return { bg: "#FFB74D", text: "#E65100" };
            case "finalizado": return { bg: "#9575CD", text: "#6A1B9A" };
            case "fechado": return { bg: "#BDBDBD", text: "#424242" };
            default: return { bg: "#E0E0E0", text: "#333" };
        }
    };

    return (
        <Box sx={{ pl: 5, py: 2, width: "94%", display: "flex", flexDirection: "column", gap: 2 }}>

            <Box sx={{ ml: 0.5, marginTop: 2 }}>
                <BackButton to={backRoute} />
            </Box>

            {/* CABEÇALHO */}
            <Paper elevation={0} sx={{ p: 1.5, border: "1px solid #E0E0E0", borderRadius: 2, display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography fontWeight="bold" color="#333" sx={{ fontSize: '1rem' }}>
                    Detalhes do Chamado: #{called.id}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                    <Chip label={`#${called.id}`} size="small" sx={{ borderRadius: 1, bgcolor: "#E0E0E0", height: 19, fontSize: '0.71rem' }} />
                    <Typography variant="caption" color="text.secondary">Aberto em: {formatDate(called.created_at)}</Typography>

                    {/* PRIORIDADE */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, borderLeft: "1px solid #ddd", pl: 1.9 }}>
                        <Typography variant="caption" color="text.secondary">Prioridade:</Typography>
                        <TechnicianOnly>
                            {jaAssumido && !finalizado ? (
                                <Select
                                    value={PRIORIDADE_OPTIONS.find(p => p.name === called.prioridade)?.id ?? ""}
                                    onChange={(e) => handlePrioridadeChange(e.target.value)}
                                    size="small" variant="outlined"
                                    sx={{
                                        fontSize: '0.72rem', fontWeight: "bold",
                                        color: getPrioridadeColor(called.prioridade).text,
                                        height: 22, minWidth: 90, borderRadius: "999px",
                                        bgcolor: getPrioridadeColor(called.prioridade).bg + "40",
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: getPrioridadeColor(called.prioridade).bg },
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: getPrioridadeColor(called.prioridade).bg },
                                        "& .MuiSelect-icon": { color: getPrioridadeColor(called.prioridade).text, fontSize: "1rem" },
                                    }}
                                >
                                    {PRIORIDADE_OPTIONS.map(p => <MenuItem key={p.id} value={p.id} sx={{ fontSize: '0.8rem' }}>{p.name}</MenuItem>)}
                                </Select>
                            ) : (
                                <Typography variant="caption" sx={{ color: getPrioridadeColor(called.prioridade).text, fontWeight: "bold" }}>
                                    {called.prioridade ?? "-"}
                                </Typography>
                            )}
                        </TechnicianOnly>
                        <RoleAccess roles={[1, 3]}>
                            <Typography variant="caption" sx={{ color: getPrioridadeColor(called.prioridade).text, fontWeight: "bold" }}>
                                {called.prioridade ?? "-"}
                            </Typography>
                        </RoleAccess>
                    </Box>

                    {/* STATUS */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, borderLeft: "1px solid #ddd", pl: 1.9 }}>
                        <Typography variant="caption" color="text.secondary">Status:</Typography>
                        <TechnicianOnly>
                            {jaAssumido && !finalizado ? (
                                <Select
                                    value={STATUS_OPTIONS.find(s => s.name === called.status)?.id ?? ""}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    size="small" variant="outlined"
                                    sx={{
                                        fontSize: '0.72rem', fontWeight: "bold",
                                        color: getStatusColor(called.status).text,
                                        height: 22, minWidth: 120, borderRadius: "999px",
                                        bgcolor: getStatusColor(called.status).bg + "40",
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: getStatusColor(called.status).bg },
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: getStatusColor(called.status).bg },
                                        "& .MuiSelect-icon": { color: getStatusColor(called.status).text, fontSize: "1rem" },
                                    }}
                                >
                                    {STATUS_OPTIONS.map(s => <MenuItem key={s.id} value={s.id} sx={{ fontSize: '0.8rem' }}>{s.name}</MenuItem>)}
                                </Select>
                            ) : (
                                <Chip label={called.status} size="small" variant="outlined"
                                    sx={{ bgcolor: getStatusColor(called.status).bg + "40", borderColor: getStatusColor(called.status).bg, color: getStatusColor(called.status).text, fontWeight: "bold", height: 20, fontSize: '0.7rem', marginTop: "-2px" }}
                                />
                            )}
                        </TechnicianOnly>
                        <RoleAccess roles={[1, 3]}>
                            <Chip label={called.status} size="small" variant="outlined"
                                sx={{ bgcolor: getStatusColor(called.status).bg + "40", borderColor: getStatusColor(called.status).bg, color: getStatusColor(called.status).text, fontWeight: "bold", height: 20, fontSize: '0.7rem', marginTop: "-2px" }}
                            />
                        </RoleAccess>
                    </Box>

                    {/* CHIP PENDENTE */}
                    {!!called.financial_approval_required && called.financial_approval_status === 'pending' && (
                        <Box sx={{ borderLeft: "1px solid #ddd", pl: 1.9 }}>
                            <Chip label="Aguardando Aceite Financeiro" size="small"
                                sx={{ bgcolor: "#FFF8E1", borderColor: "#FFD54F", color: "#F9A825", fontWeight: "bold", height: 20, fontSize: '0.7rem', border: "1px solid #FFD54F" }} />
                        </Box>
                    )}

                    {/* CHIP REJEITADO */}
                    {!!called.financial_approval_required && called.financial_approval_status === 'rejected' && (
                        <Box sx={{ borderLeft: "1px solid #ddd", pl: 1.9 }}>
                            <Tooltip title={called.financial_approval_reason ?? "Sem justificativa informada"}>
                                <Chip label="Aceite Rejeitado" size="small"
                                    sx={{ bgcolor: "#FFEBEE", borderColor: "#EF9A9A", color: "#C62828", fontWeight: "bold", height: 20, fontSize: '0.7rem', border: "1px solid #EF9A9A", cursor: "pointer" }} />
                            </Tooltip>
                        </Box>
                    )}

                    {/* CHIP REABERTO */}
                    {called.reopen_reason && (
                        <Box sx={{ borderLeft: "1px solid #ddd", pl: 1.9 }}>
                            <Chip
                                label="Reaberto"
                                size="small"
                                sx={{
                                    bgcolor: "#E8F5E9",
                                    borderColor: "#81C784",
                                    color: "#388E3C",
                                    fontWeight: "bold",
                                    height: 20, fontSize: '0.7rem',
                                    border: "1px solid #81C784",
                                }}
                            />
                        </Box>
                    )}
                </Box>
            </Paper>

            {/* CONTEÚDO */}
            <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ flex: 1, minWidth: "600px" }}>

                    {/* DETALHES */}
                    <Paper elevation={0} sx={{ p: 1.5, mb: 1.5, border: "1px solid #E0E0E0", borderRadius: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Detalhes do Solicitante</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                    <InfoRow label="Nome do solicitante:" value={called.solicitante?.nome} />
                                    <InfoRow label="Departamento:" value={called.solicitante?.departamento} />
                                </Box>
                            </Box>
                            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Detalhes do Chamado</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                    <InfoRow label="Categoria:" value={called.categoria} />
                                    <InfoRow label="Subcategoria:" value={called.subcategoria} />
                                    <InfoRow label="Responsável:" value={called.responsavel ?? "Não assumido"} />
                                    {normalFields.map((field, i) => <InfoRow key={i} label={`${field.label}:`} value={field.value} />)}
                                </Box>
                            </Box>
                        </Box>
                    </Paper>

                    {/* DESCRIÇÃO */}
                    <Paper elevation={0} sx={{ p: 1.5, border: "1px solid #E0E0E0", borderRadius: 2, display: "flex", flexDirection: "column", minHeight: "165px" }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Descrição</Typography>
                        <Divider sx={{ mb: 1 }} />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" paragraph color="text.secondary" sx={{ mb: 1, fontSize: '0.85rem', wordBreak: "break-word" }}>
                                {called.descricao}
                            </Typography>
                            {textareas.map((field, i) => (
                                <Typography key={i} variant="body2" paragraph color="text.secondary" sx={{ fontSize: '0.85rem', wordBreak: "break-word" }}>
                                    {field.value}
                                </Typography>
                            ))}
                        </Box>

                        {/* BOTÕES TÉCNICO */}
                        <TechnicianOnly>
                            <Box sx={{ mt: "auto", display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                <Button variant="contained" size="small" startIcon={<ReplyIcon fontSize="small" />}
                                    sx={{ bgcolor: "#7986CB", textTransform: "none", fontWeight: "bold", fontSize: '0.75rem' }}>
                                    Retribuir
                                </Button>
                                {jaAssumido && !finalizado && (
                                    <Button variant="contained" size="small" startIcon={<CheckCircleIcon fontSize="small" />}
                                        onClick={() => { setStatusSelecionado(4); setModalFinalizar(true); }}
                                        sx={{ bgcolor: "#E53935", "&:hover": { bgcolor: "#B71C1C" }, textTransform: "none", fontWeight: "bold", fontSize: '0.75rem' }}>
                                        Finalizar Chamado
                                    </Button>
                                )}
                                <Tooltip title={bloqueadoPorAceite ? "Aguardando aceite financeiro" : jaAssumido ? "Já assumido" : "Assumir chamado"}>
                                    <span>
                                        <Button variant="contained" size="small" startIcon={<CheckCircleIcon fontSize="small" />}
                                            disabled={jaAssumido || bloqueadoPorAceite}
                                            onClick={handleAssumir}
                                            sx={{
                                                bgcolor: (jaAssumido || bloqueadoPorAceite) ? "#ccc" : "#333",
                                                "&:hover": { bgcolor: (jaAssumido || bloqueadoPorAceite) ? "#ccc" : "#000" },
                                                textTransform: "none", fontWeight: "bold", fontSize: '0.75rem'
                                            }}>
                                            {jaAssumido ? "Assumido" : bloqueadoPorAceite ? "Bloqueado" : "Assumir"}
                                        </Button>
                                    </span>
                                </Tooltip>
                            </Box>
                        </TechnicianOnly>

                        {/* BOTÕES ACEITE FINANCEIRO */}
                        <FinancialOnly>
                            {pendenteAceite && (
                                <Box sx={{ mt: "auto", display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                    <Button variant="outlined" size="small" startIcon={<CancelOutlinedIcon fontSize="small" />}
                                        onClick={() => setModalNegar(true)}
                                        sx={{ borderColor: "#EF9A9A", color: "#C62828", "&:hover": { bgcolor: "#FFEBEE", borderColor: "#C62828" }, textTransform: "none", fontWeight: "bold", fontSize: '0.75rem' }}>
                                        Negar
                                    </Button>
                                    <Button variant="outlined" size="small" startIcon={<ThumbUpAltOutlinedIcon fontSize="small" />}
                                        onClick={handleAprovar}
                                        sx={{ borderColor: "#81C784", color: "#388E3C", "&:hover": { bgcolor: "#F1F8E9", borderColor: "#388E3C" }, textTransform: "none", fontWeight: "bold", fontSize: '0.75rem' }}>
                                        Aprovar
                                    </Button>
                                </Box>
                            )}
                        </FinancialOnly>
                    </Paper>
                    {/* MOTIVO DA REABERTURA */}
                    {called.reopen_reason && (
                        <Paper elevation={0} sx={{ p: 1.5, mt: 1.5, border: "1px solid #FFD54F", borderLeft: "4px solid #F9A825", borderRadius: 2, bgcolor: "#FFFDE7" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, mb: 0.8 }}>
                                <ReplayIcon sx={{ fontSize: "1rem", color: "#F9A825" }} />
                                <Typography variant="caption" sx={{ fontWeight: "bold", color: "#F57F17", fontSize: "0.75rem" }}>
                                    Motivo da Reabertura
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem", wordBreak: "break-word", lineHeight: 1.5 }}>
                                {called.reopen_reason}
                            </Typography>
                        </Paper>
                    )}
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                        {attachments.map((att) => (
                            <Box
                                key={att.id}
                                onClick={() => setAttachmentPreview(att.url)}
                                sx={{
                                    width: 160,
                                    border: "1px solid #E0E0E0",
                                    borderRadius: 2,
                                    p: 1.2,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.2,
                                    marginTop: 1.6,
                                    cursor: "pointer",
                                    bgcolor: "#fff",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                                    "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.15)", borderColor: "#BDBDBD" },
                                    transition: "all 0.2s",
                                }}
                            >
                                <Box sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 1.5,
                                    bgcolor: "#E3F2FD",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}>
                                    <ImageOutlinedIcon sx={{ fontSize: 22, color: "#1976d2" }} />
                                </Box>
                                <Box sx={{ overflow: "hidden" }}>
                                    <Typography sx={{ fontSize: "0.72rem", color: "#333", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {att.filename}
                                    </Typography>
                                    <Typography sx={{ fontSize: "0.65rem", color: "#9E9E9E" }}>
                                        {att.size ? `${(att.size / (1024 * 1024)).toFixed(1)} MB` : att.data_upload ? new Date(att.data_upload).toLocaleDateString("pt-BR") : ""}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                    {/* MODAL PREVIEW DO ANEXO */}
                    <Dialog open={!!attachmentPreview} onClose={() => setAttachmentPreview(null)} maxWidth="md">
                        <DialogContent sx={{ p: 1 }}>
                            <Box
                                component="img"
                                src={attachmentPreview}
                                alt="preview"
                                sx={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: 2 }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setAttachmentPreview(null)} sx={{ textTransform: "none", color: "#666" }}>
                                Fechar
                            </Button>
                            <Button variant="contained" href={attachmentPreview} target="_blank" sx={{ textTransform: "none", bgcolor: "#333" }}>
                                Abrir em nova aba
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>

                {/* COLUNA DIREITA - CHAT */}
                <Box sx={{ width: "320px", flexShrink: 0 }}>
                    <ChatBox idCalled={called.id} currentUser={user} />
                </Box>
            </Box>

            {/* MODAL FINALIZAÇÃO */}
            <Dialog open={modalFinalizar} onClose={() => setModalFinalizar(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: "bold", fontSize: "1rem" }}>Finalizar Chamado #{called.id}</DialogTitle>
                <Divider />
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" mb={2}>Descreva a solução aplicada para finalizar este chamado.</Typography>
                    <MuiTextField label="Descrição da finalização" multiline rows={4} fullWidth value={descFinalizar} onChange={(e) => setDescFinalizar(e.target.value)} size="small" />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => { setModalFinalizar(false); setDescFinalizar(""); }} sx={{ textTransform: "none", color: "#666" }}>Cancelar</Button>
                    <Button variant="contained" onClick={handleConfirmarFinalizar} sx={{ textTransform: "none", bgcolor: "#333", "&:hover": { bgcolor: "#000" } }}>Confirmar Finalização</Button>
                </DialogActions>
            </Dialog>

            {/* MODAL NEGAR */}
            <Dialog open={modalNegar} onClose={() => { setModalNegar(false); setMotivoNegar(""); }} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: "bold", fontSize: "1rem" }}>Negar Aceite — Chamado #{called.id}</DialogTitle>
                <Divider />
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" mb={2}>Informe o motivo da rejeição. O chamado será finalizado automaticamente.</Typography>
                    <MuiTextField label="Motivo da rejeição" multiline rows={4} fullWidth value={motivoNegar} onChange={(e) => setMotivoNegar(e.target.value)} size="small" />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => { setModalNegar(false); setMotivoNegar(""); }} sx={{ textTransform: "none", color: "#666" }}>Cancelar</Button>
                    <Button variant="contained" onClick={handleConfirmarNegar} sx={{ textTransform: "none", bgcolor: "#C62828", "&:hover": { bgcolor: "#B71C1C" } }}>Confirmar Rejeição</Button>
                </DialogActions>
            </Dialog>

            <AppAlert open={alert.open} onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity} message={alert.message} />
        </Box>
    );
}

function InfoRow({ label, value }) {
    return (
        <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: "bold", color: "#333" }}>{label}</Typography>
            <Typography variant="caption" color="text.secondary">{value ?? "-"}</Typography>
        </Box>
    );
}