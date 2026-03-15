import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, IconButton, Typography, Badge, Divider, ClickAwayListener, Paper, Tooltip } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../constants/roles";
import useNotifications from "../hooks/useNotifications";

// Ícones
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FolderIcon from "@mui/icons-material/Folder";
import GroupIcon from "@mui/icons-material/Group";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const formatTimeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return 'agora';
    if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
    return `${Math.floor(diff / 86400)}d atrás`;
};

const isToday = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
};

export default function Layout() {
    const [open, setOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { notifications, unreadCount, markAllAsRead, markAsRead, deleteOne, deleteAll } = useNotifications();

    const todayNotifs = notifications.filter(n => isToday(n.created_at));
    const olderNotifs = notifications.filter(n => !isToday(n.created_at));

    const menuItems = [
        { icon: <HomeIcon />, onClick: () => navigate("/"), label: "Home", roles: [ROLES.ADMIN, ROLES.TECNICO, ROLES.USUARIO] },
        { icon: <AddIcon />, onClick: () => navigate("/solicitacao-chamado"), label: "Abrir chamado", roles: [ROLES.ADMIN, ROLES.TECNICO, ROLES.USUARIO] },
        { icon: <ListIcon />, onClick: () => navigate("/lista-chamados"), label: "Lista de chamados", roles: [ROLES.ADMIN, ROLES.USUARIO] },
        { icon: <ListIcon />, onClick: () => navigate("/Gerenciar-chamados"), label: "Gerenciar Chamados", roles: [ROLES.TECNICO] },
        { icon: <HistoryIcon />, label: "Histórico de chamados", roles: [ROLES.ADMIN, ROLES.TECNICO, ROLES.USUARIO] },
        { icon: <FolderIcon />, onClick: () => navigate("/Gerenciar-categoria"), label: "Gerenciar Categorias", roles: [ROLES.ADMIN, ROLES.TECNICO] },
        { icon: <GroupIcon />, onClick: () => navigate("/Gerenciar-usarios"), label: "Gerenciar Usuários", roles: [ROLES.ADMIN, ROLES.TECNICO] },
    ];

    const NotifItem = ({ n }) => (
        <Box
            sx={{ px: 2.5, py: 1.8, borderBottom: "1px solid #F0F0F0", bgcolor: n.read ? "#fff" : "#FAFFF8", "&:hover": { bgcolor: "#F5F5F5" }, "&:hover .delete-btn": { opacity: 1 } }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box sx={{ flex: 1, cursor: "pointer" }} onClick={() => markAsRead(n.id)}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Typography fontWeight={n.read ? 400 : 700} fontSize={14} sx={{ flex: 1, pr: 1 }}>{n.title}</Typography>
                        <Typography fontSize={12} color="text.secondary" sx={{ whiteSpace: "nowrap" }}>{formatTimeAgo(n.created_at)}</Typography>
                    </Box>
                    <Typography fontSize={13} color="text.secondary" sx={{ mt: 0.3 }}>{n.message}</Typography>
                </Box>
                <Tooltip title="Remover">
                    <IconButton
                        className="delete-btn"
                        size="small"
                        onClick={(e) => { e.stopPropagation(); deleteOne(n.id); }}
                        sx={{ ml: 1, opacity: 0, transition: "opacity 0.2s", color: "#bbb", "&:hover": { color: "#E53935" } }}
                    >
                        <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            {/* SIDEBAR */}
            <Box sx={{ width: open ? 220 : 80, background: "#2F3A32", display: "flex", flexDirection: "column", justifyContent: "space-between", py: 3, px: open ? 2 : 0, transition: "width 0.25s ease-in-out" }}>
                <Box sx={{ display: "flex", justifyContent: open ? "flex-start" : "center", px: open ? 1 : 0, mb: 6, position: "relative", top: "-15px", margin: "0px 0px 0px 80px" }}>
                    <SupportAgentIcon sx={{ fontSize: 38, color: "#fff" }} />
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, position: "fixed", top: "5rem", left: open ? "16px" : "19px" }}>
                    {menuItems
                        .filter(item => item.roles.includes(user?.role))
                        .map((item, index) => (
                            <Box onClick={item.onClick} key={index} sx={{ display: "flex", alignItems: "center", justifyContent: open ? "flex-start" : "center", px: open ? 1 : 0, gap: open ? 1.5 : 0, color: "#fff", cursor: item.onClick ? "pointer" : "default" }}>
                                <IconButton sx={{ color: "#fff" }} size="small">{item.icon}</IconButton>
                                {open && <Typography fontSize={14}>{item.label}</Typography>}
                            </Box>
                        ))}
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: open ? "flex-start" : "center", px: open ? 1 : 0, gap: open ? 1.5 : 0, color: "#fff" }}>
                        <IconButton sx={{ color: "#fff" }} size="small" onClick={() => navigate("/Page-configuracao")}><SettingsIcon /></IconButton>
                        {open && <Typography fontSize={14}>Configurações</Typography>}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: open ? "flex-start" : "center", px: open ? 1 : 0, gap: open ? 1.5 : 0, color: "#fff" }}>
                        <IconButton sx={{ color: "#fff" }} size="small" onClick={() => setOpen(!open)}><MenuIcon /></IconButton>
                        {open && <Typography fontSize={14}>Menu</Typography>}
                    </Box>
                </Box>
            </Box>

            {/* ÁREA PRINCIPAL */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {/* HEADER */}
                <Box sx={{ height: 58, background: "#2F3A32", color: "#fff", display: "flex", alignItems: "center", justifyContent: "flex-end", px: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, position: "relative" }}>

                        {/* SINO */}
                        <ClickAwayListener onClickAway={() => setNotifOpen(false)}>
                            <Box sx={{ position: "relative" }}>
                                <IconButton sx={{ color: "#fff" }} size="small" onClick={() => setNotifOpen(prev => !prev)}>
                                    <Badge badgeContent={unreadCount} color="error" max={99}>
                                        <NotificationsNoneIcon />
                                    </Badge>
                                </IconButton>

                                {notifOpen && (
                                    <Paper elevation={4} sx={{ position: "absolute", top: "40px", right: 0, width: 400, borderRadius: 3, zIndex: 9999, overflow: "hidden" }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2.5, py: 2 }}>
                                            <Typography fontWeight={700} fontSize={18}>Notificações</Typography>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                {unreadCount > 0 && (
                                                    <Tooltip title="Marcar todas como lidas">
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer", color: "#666" }} onClick={markAllAsRead}>
                                                            <DoneAllIcon sx={{ fontSize: 16 }} />
                                                            <Typography fontSize={12}>Marcar lidas</Typography>
                                                        </Box>
                                                    </Tooltip>
                                                )}
                                                {notifications.length > 0 && (
                                                    <Tooltip title="Limpar todas">
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer", color: "#E53935", ml: 1 }} onClick={deleteAll}>
                                                            <DeleteSweepIcon sx={{ fontSize: 16 }} />
                                                            <Typography fontSize={12}>Limpar tudo</Typography>
                                                        </Box>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        </Box>

                                        <Box sx={{ maxHeight: 420, overflowY: "auto" }}>
                                            {todayNotifs.length > 0 && (
                                                <>
                                                    <Box sx={{ px: 2.5, py: 1, bgcolor: "#F5F5F5" }}>
                                                        <Typography fontSize={13} color="text.secondary">Hoje</Typography>
                                                    </Box>
                                                    {todayNotifs.map(n => <NotifItem key={n.id} n={n} />)}
                                                </>
                                            )}
                                            {olderNotifs.length > 0 && (
                                                <>
                                                    <Box sx={{ px: 2.5, py: 1, bgcolor: "#F5F5F5" }}>
                                                        <Typography fontSize={13} color="text.secondary">Anteriores</Typography>
                                                    </Box>
                                                    {olderNotifs.map(n => <NotifItem key={n.id} n={n} />)}
                                                </>
                                            )}
                                            {notifications.length === 0 && (
                                                <Box sx={{ py: 5, textAlign: "center" }}>
                                                    <Typography fontSize={13} color="text.secondary">Nenhuma notificação</Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        <Divider />
                                        <Box sx={{ px: 2.5, py: 1.5, textAlign: "center", cursor: "pointer", "&:hover": { bgcolor: "#F5F5F5" } }}>
                                            <Typography fontSize={13} color="text.secondary">Ver todas as notificações</Typography>
                                        </Box>
                                    </Paper>
                                )}
                            </Box>
                        </ClickAwayListener>

                        {/* PERFIL */}
                        <ClickAwayListener onClickAway={() => setProfileOpen(false)}>
                            <Box sx={{ position: "relative" }}>
                                <IconButton sx={{ color: "#fff" }} size="small" onClick={() => setProfileOpen(prev => !prev)}>
                                    <AccountCircleIcon />
                                </IconButton>

                                {profileOpen && (
                                    <Paper elevation={4} sx={{ position: "absolute", top: "40px", right: 0, width: 200, borderRadius: 2, zIndex: 9999, overflow: "hidden" }}>
                                        <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #F0F0F0" }}>
                                            <Typography fontWeight={700} fontSize={14}>{user?.nome}</Typography>
                                            <Typography fontSize={12} color="text.secondary">{user?.email}</Typography>
                                        </Box>
                                        <Box
                                            onClick={() => { navigate("/page-configuracao", { state: { tab: "perfil" } }); setProfileOpen(false); }}
                                            sx={{ px: 2, py: 1.5, cursor: "pointer", "&:hover": { bgcolor: "#F5F5F5" } }}
                                        >
                                            <Typography fontSize={14}>Perfil</Typography>
                                        </Box>
                                        <Box
                                            onClick={() => { navigate("/page-configuracao", { state: { tab: "seguranca" } }); setProfileOpen(false); }}
                                            sx={{ px: 2, py: 1.5, cursor: "pointer", "&:hover": { bgcolor: "#F5F5F5" } }}
                                        >
                                            <Typography fontSize={14}>Segurança</Typography>
                                        </Box>
                                        <Divider />
                                        <Box
                                            onClick={logout}
                                            sx={{ px: 2, py: 1.5, cursor: "pointer", "&:hover": { bgcolor: "#FFF5F5" } }}
                                        >
                                            <Typography fontSize={14} color="error">Sair</Typography>
                                        </Box>
                                    </Paper>
                                )}
                            </Box>
                        </ClickAwayListener>

                    </Box>
                </Box>

                {/* CONTEÚDO */}
                <Box sx={{ flex: 1, background: "#F9F9F9", overflowY: "auto", overflowX: "hidden" }}>
                    <Box sx={{ width: "100%" }}>
                        <Outlet />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}