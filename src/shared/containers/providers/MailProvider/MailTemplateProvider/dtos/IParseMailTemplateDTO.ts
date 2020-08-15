export interface ITemplateVariables {
  [key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
  templateFilePath: string;
  variables: ITemplateVariables;
}
