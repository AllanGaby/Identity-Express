import { container } from 'tsyringe';
import ITokenProvider from './models/ITokenProvider';
import JWTokenProvider from './implementations/JWTokenProvider';

const providers = {
  jwt: JWTokenProvider,
};

container.registerSingleton<ITokenProvider>('TokenProvider', providers.jwt);
