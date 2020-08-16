import { Router } from 'express';
import PasswordRoutes from './password.routes';
import UsersController from '../controllers/UsersController';
import ActivateController from '../controllers/ActivateController';

const usersRoutes = Router();
const usersController = new UsersController();
const activateController = new ActivateController();

usersRoutes.use('/password', PasswordRoutes);
usersRoutes.get('/', usersController.list);
usersRoutes.get('/:id', usersController.show);
usersRoutes.post('/', usersController.create);
usersRoutes.patch('/:id/activate', activateController.activate);
usersRoutes.put('/:id', usersController.update);

export default usersRoutes;
