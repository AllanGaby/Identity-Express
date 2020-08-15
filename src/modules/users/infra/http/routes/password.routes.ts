import { Router, Request, Response } from 'express';

const passwordRoutes = Router();

passwordRoutes.post('/forgot', (request: Request, response: Response) => {
  response.json({
    message: 'Send Mail to Forgot Password',
  });
});
passwordRoutes.patch('/:token', (request: Request, response: Response) => {
  response.json({
    message: 'Change Password',
  });
});

export default passwordRoutes;
