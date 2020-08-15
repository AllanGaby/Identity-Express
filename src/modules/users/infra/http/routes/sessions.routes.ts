import { Router, Request, Response } from 'express';

const sessionsRoutes = Router();

sessionsRoutes.post('/', (request: Request, response: Response) => {
  response.json({
    message: 'Login',
  });
});
sessionsRoutes.delete('/', (request: Request, response: Response) => {
  response.json({
    message: 'Logout',
  });
});

export default sessionsRoutes;
