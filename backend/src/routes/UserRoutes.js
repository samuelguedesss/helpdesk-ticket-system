import { Router } from "express";
import UserController from '../controllers/UserController.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post('/', upload.none(), UserController.creatUser);
router.get('/', UserController.getUsers);
router.get('/tecnicos', UserController.getUsertecnicos);
router.get('/:id', UserController.getUserById);
router.put('/:id', upload.none(), UserController.updateUser);
router.patch('/:id/status', UserController.updateUserStatus);
router.patch('/:id/password', UserController.changePassword);
router.post('/:id/avatar', upload.single("file"), UserController.uploadAvatar);  // 👈 novo
router.get('/:id/avatar', UserController.getAvatarUrl);     
router.delete("/:id/avatar", UserController.deleteAvatar);                     // 👈 novo

export default router;