import { useEffect, useRef, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Paper,
    Avatar,
    CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import apiBackend from "../services/apiBackend";

const POLLING_INTERVAL = 4000;

const ChatBox = ({ idCalled, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const lastIdRef = useRef(0);
    const pollingRef = useRef(null);
    const bottomRef = useRef(null);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const loadMessages = async () => {
        try {
            const res = await apiBackend.get(`/messages-called/${idCalled}`);
            const data = res.data.data;
            setMessages(data);
            if (data.length > 0) {
                lastIdRef.current = data[data.length - 1].id;
            }
        } catch (error) {
            console.error("Erro ao carregar mensagens:", error);
        } finally {
            setLoading(false);
        }
    };

    const pollMessages = async () => {
        try {
            const res = await apiBackend.get(
                `/messages-called/${idCalled}/poll?lastId=${lastIdRef.current}`
            );
            const newMessages = res.data.data;
            if (newMessages.length > 0) {
                setMessages((prev) => [...prev, ...newMessages]);
                lastIdRef.current = newMessages[newMessages.length - 1].id;
            }
        } catch (error) {
            console.error("Erro no polling:", error);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim() || sending) return;
        setSending(true);
        try {
            const res = await apiBackend.post(`/messages-called/${idCalled}`, {
                message: newMessage.trim(),
            });
            setMessages((prev) => [...prev, res.data.data]);
            lastIdRef.current = res.data.data.id;
            setNewMessage("");
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        loadMessages();
    }, [idCalled]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!loading) {
            pollingRef.current = setInterval(pollMessages, POLLING_INTERVAL);
        }
        return () => clearInterval(pollingRef.current);
    }, [loading, idCalled]);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: 480, border: "1px solid #e0e0e0", borderRadius: 2, overflow: "hidden" }}>
            {/* Header */}
            <Box sx={{ px: 2, py: 1.5, backgroundColor: "#1976d2" }}>
                <Typography variant="subtitle1" fontWeight={600} color="white">
                    Chat do Chamado
                </Typography>
            </Box>

            {/* Mensagens */}
            <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 1.5, backgroundColor: "#f5f5f5", display: "flex", flexDirection: "column", gap: 1 }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                        <CircularProgress size={28} />
                    </Box>
                ) : messages.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center" mt={4}>
                        Nenhuma mensagem ainda. Inicie a conversa!
                    </Typography>
                ) : (
                    messages.map((msg) => {
                        const isMine = msg.id_user === currentUser.id;
                        return (
                            <Box
                                key={msg.id}
                                sx={{
                                    display: "flex",
                                    flexDirection: isMine ? "row-reverse" : "row",
                                    alignItems: "flex-end",
                                    gap: 1,
                                }}
                            >
                                <Avatar
                                    src={msg.user?.avatar || ""}
                                    alt={msg.user?.name}
                                    sx={{ width: 32, height: 32, fontSize: 14 }}
                                >
                                    {msg.user?.name?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box sx={{ maxWidth: "70%" }}>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: "block", mb: 0.3, textAlign: isMine ? "right" : "left" }}
                                    >
                                        {msg.user?.name}
                                    </Typography>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            px: 1.5,
                                            py: 1,
                                            backgroundColor: isMine ? "#1976d2" : "#ffffff",
                                            color: isMine ? "white" : "text.primary",
                                            borderRadius: isMine
                                                ? "12px 12px 2px 12px"
                                                : "12px 12px 12px 2px",
                                        }}
                                    >
                                        <Typography variant="body2">{msg.message}</Typography>
                                    </Paper>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: "block", mt: 0.3, textAlign: isMine ? "right" : "left" }}
                                    >
                                        {new Date(msg.shipping_date).toLocaleTimeString("pt-BR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </Box>

            {/* Input */}
            <Box sx={{ px: 2, py: 1.5, backgroundColor: "#fff", borderTop: "1px solid #e0e0e0", display: "flex", gap: 1, alignItems: "center" }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    multiline
                    maxRows={3}
                    disabled={sending}
                />
                <IconButton
                    color="primary"
                    onClick={handleSend}
                    disabled={!newMessage.trim() || sending}
                >
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default ChatBox;