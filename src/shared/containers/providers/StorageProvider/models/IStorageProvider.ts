import ISaveFileDTO from '../dtos/ISaveFileDTO';

export default interface IStorageProvider {
  fileExists(file: string): Promise<boolean>;
  saveFile(data: ISaveFileDTO): Promise<string>;
  deleteFile(file: string): Promise<void>;
}
