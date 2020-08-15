import IParseTemplateDTO from '../MailTemplateProvider/dtos/IParseMailTemplateDTO';

interface IContact {
  name: string;
  email: string;
}

export default interface ISendMailDTO {
  sender?: IContact;
  to: IContact;
  subject: string;
  templateDate: IParseTemplateDTO;
}
