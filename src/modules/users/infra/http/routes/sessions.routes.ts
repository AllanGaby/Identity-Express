import { Router } from 'express';
import LoginController from '../controllers/LoginController';

const sessionsRoutes = Router();
const loginController = new LoginController();

sessionsRoutes.post('/', loginController.create);

export default sessionsRoutes;
