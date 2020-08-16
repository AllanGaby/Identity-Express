import { Router } from 'express';
import multer from 'multer';
import UploadConfig from '@config/upload';
import PasswordRoutes from './password.routes';
import UsersController from '../controllers/UsersController';
import ActivateController from '../controllers/ActivateController';
import EnsureAutenticated from '../middleware/EnsureAutenticated';

const usersRoutes = Router();
const uploadFile = multer(UploadConfig);
const usersController = new UsersController();
const activateController = new ActivateController();

usersRoutes.use('/password', PasswordRoutes);
usersRoutes.get('/', EnsureAutenticated, usersController.list);
usersRoutes.get('/:id', EnsureAutenticated, usersController.show);
usersRoutes.post('/', uploadFile.single('avatar'), usersController.create);
usersRoutes.patch('/:id/activate', activateController.update);
usersRoutes.put(
  '/:id',
  EnsureAutenticated,
  uploadFile.single('avatar'),
  usersController.update,
);

export default usersRoutes;
