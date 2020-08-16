import { Router } from 'express';
import usersModuleRoutes from '@modules/users/infra/http/routes';

const appRoutes = Router();
appRoutes.use(usersModuleRoutes);

export default appRoutes;
