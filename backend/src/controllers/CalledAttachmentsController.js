import CalledAttachmentsService from "../services/CalledAttachmentsService.js";

const uploadAttachment = async (req, res) => {
    try {
        const { id_called } = req.params;

        if (!req.file) {
            return res.status(400).json({ mensagem: "Nenhum arquivo enviado" });
        }

        const attachment = await CalledAttachmentsService.uploadCalledAttachmentService(
            Number(id_called),
            req.file
        );

        return res.status(201).json({
            mensagem: "Anexo enviado com sucesso",
            attachment,
        });
    } catch (error) {
        console.error("Erro ao fazer upload do anexo:", error);
        return res.status(400).json({ mensagem: error.message });
    }
};

const getAttachments = async (req, res) => {
    try {
        const { id_called } = req.params;

        const attachments = await CalledAttachmentsService.getCalledAttachmentsService(
            Number(id_called)
        );

        return res.status(200).json(attachments);
    } catch (error) {
        console.error("Erro ao buscar anexos:", error);
        return res.status(500).json({ mensagem: error.message });
    }
};

const deleteAttachment = async (req, res) => {
    try {
        const { id } = req.params;

        await CalledAttachmentsService.deleteCalledAttachmentService(Number(id));

        return res.status(200).json({ mensagem: "Anexo deletado com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar anexo:", error);
        return res.status(400).json({ mensagem: error.message });
    }
};

export default {
    uploadAttachment,
    getAttachments,
    deleteAttachment,
};