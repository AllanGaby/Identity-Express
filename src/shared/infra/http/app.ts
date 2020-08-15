import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';
import AppError from '@shared/errors/AppError';
import UsersModuleRoutes from '@modules/users/infra/http/routes';
import '@shared/containers';
import '@modules/users/containers';

const app = express();
app.use(cors());
app.use(express.json());
app.use(UsersModuleRoutes);
app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    console.log(err);
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

export default app;
