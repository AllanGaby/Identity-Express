import { container } from 'tsyringe';
import IMailProvider from './models/IMailProvider';
import EtherealMailProvider from './implementations/EtherealMailProvider';

import './MailTemplateProvider';

const providers = {
  ethreal: EtherealMailProvider,
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  container.resolve(providers.ethreal),
);
