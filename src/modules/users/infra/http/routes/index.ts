import { Router } from 'express';
import UsersRoutes from './users.routes';
import SessionsRoutes from './sessions.routes';

const moduleRouter = Router();
moduleRouter.use('/users', UsersRoutes);
moduleRouter.use('/sessions', SessionsRoutes);

export default moduleRouter;
