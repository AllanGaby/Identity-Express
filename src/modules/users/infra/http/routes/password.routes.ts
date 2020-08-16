import { Router } from 'express';
import PasswordController from '../controllers/PasswordController';
import ForgotPasswordController from '../controllers/ForgotPasswordController';

const passwordRoutes = Router();
const passwordController = new PasswordController();
const forgotPasswordController = new ForgotPasswordController();

passwordRoutes.post('/forgot', forgotPasswordController.create);
passwordRoutes.patch('/:token', passwordController.update);

export default passwordRoutes;
