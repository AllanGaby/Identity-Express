import { Router } from 'express';
import AvatarUserController from '../controllers/AvatarUserController';

const avatarUserRoutes = Router();
const avatarUserController = new AvatarUserController();

avatarUserRoutes.get('/:id/avatar', avatarUserController.show);

export default avatarUserRoutes;
