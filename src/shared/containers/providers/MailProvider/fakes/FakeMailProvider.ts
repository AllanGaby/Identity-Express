import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

export default class FakeMailProvider implements IMailProvider {
  public async sendMail({
    to,
    subject,
    templateDate,
  }: ISendMailDTO): Promise<boolean> {
    return Boolean(to) && Boolean(subject) && Boolean(templateDate);
  }
}
