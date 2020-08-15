import { Router, Request, Response } from 'express';
import PasswordRoutes from './password.routes';
import UsersController from '../controllers/UsersController';

const usersController = new UsersController();

const usersRoutes = Router();

usersRoutes.use('/password', PasswordRoutes);
usersRoutes.get('/', usersController.list);
usersRoutes.get('/:id', usersController.show);
usersRoutes.post('/', usersController.create);
usersRoutes.patch('/:id', usersController.activate);
usersRoutes.put('/:id', usersController.update);

export default usersRoutes;
