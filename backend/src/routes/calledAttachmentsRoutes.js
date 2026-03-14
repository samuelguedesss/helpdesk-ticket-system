import { Router } from "express";
import multer from "multer";
import CalledAttachmentsController from "../controllers/CalledAttachmentsController.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/:id_called", upload.single("file"), CalledAttachmentsController.uploadAttachment);
router.get("/:id_called", CalledAttachmentsController.getAttachments);
router.delete("/:id", CalledAttachmentsController.deleteAttachment);

export default router;