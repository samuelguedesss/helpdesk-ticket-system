import { Router } from "express";
import MessageCalledController from "../controllers/MessageCalledController.js";

const router = Router();

router.post("/:id_called", MessageCalledController.sendMessage);
router.get("/:id_called", MessageCalledController.getMessages);
router.get("/:id_called/poll", MessageCalledController.pollNewMessages);

export default router;