import { Request, Response, NextFunction } from 'express';
import JWTokenProvider from '@modules/users/containers/providers/TokenProvider/implementations/JWTokenProvider';
import AppError from '@shared/errors/AppError';

export default async function (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');
  try {
    const tokenProvider = new JWTokenProvider();
    const tokenVerify = await tokenProvider.verify(token);
    request.user = {
      id: tokenVerify.subject,
    };
    return next();
  } catch (err) {
    throw new AppError('Invalid JWT token', 401);
  }
}
