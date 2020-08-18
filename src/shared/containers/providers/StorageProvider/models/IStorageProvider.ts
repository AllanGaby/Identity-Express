import ISaveFileDTO from '../dtos/ISaveFileDTO';

export default interface IStorageProvider {
  temporaryFilePath(file: string): Promise<string>;
  filePath(file: string): Promise<string>;
  fileExists(file: string): Promise<boolean>;
  saveFile(data: ISaveFileDTO): Promise<string>;
  deleteFile(file: string): Promise<void>;
}
