import { Router } from 'express';
import PasswordRoutes from './password.routes';
import UsersController from '../controllers/UsersController';
import ActivateController from '../controllers/ActivateController';
import EnsureAutenticated from '../middleware/EnsureAutenticated';

const usersRoutes = Router();
const usersController = new UsersController();
const activateController = new ActivateController();

usersRoutes.use('/password', PasswordRoutes);
usersRoutes.get('/', EnsureAutenticated, usersController.list);
usersRoutes.get('/:id', EnsureAutenticated, usersController.show);
usersRoutes.post('/', usersController.create);
usersRoutes.patch('/:id/activate', activateController.update);
usersRoutes.put('/:id', EnsureAutenticated, usersController.update);

export default usersRoutes;
