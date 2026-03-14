import MessageCalledService from "../services/MessageCalledService.js";

const sendMessage = async (req, res) => {
    try {
        const { id_called } = req.params;
        const { message } = req.body;
        const id_user = req.user.id;

        if (!message || message.trim() === "") {
            return res.status(400).json({ mensagem: "Mensagem não pode ser vazia" });
        }

        const newMessage = await MessageCalledService.sendMessageService(
            Number(id_called),
            id_user,
            message.trim()
        );

        return res.status(201).json({
            mensagem: "Mensagem enviada com sucesso",
            data: newMessage,
        });
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        return res.status(400).json({ mensagem: error.message });
    }
};

const getMessages = async (req, res) => {
    try {
        const { id_called } = req.params;
        const id_user = req.user.id;
        const role = req.user.role;

        const messages = await MessageCalledService.getMessagesService(
            Number(id_called),
            id_user,
            role
        );

        return res.status(200).json({ data: messages });
    } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
        return res.status(400).json({ mensagem: error.message });
    }
};

const pollNewMessages = async (req, res) => {
    try {
        const { id_called } = req.params;
        const { lastId } = req.query;
        const id_user = req.user.id;

        if (!lastId) {
            return res.status(400).json({ mensagem: "lastId é obrigatório" });
        }

        const messages = await MessageCalledService.pollNewMessagesService(
            Number(id_called),
            id_user,
            Number(lastId)
        );

        return res.status(200).json({ data: messages });
    } catch (error) {
        console.error("Erro ao buscar novas mensagens:", error);
        return res.status(400).json({ mensagem: error.message });
    }
};

export default {
    sendMessage,
    getMessages,
    pollNewMessages,
};