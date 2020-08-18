import ISaveFileDTO from '../dtos/ISaveFileDTO';
import IStorageProvider from '../models/IStorageProvider';

export default class FakeStorageProvider implements IStorageProvider {
  private files: string[] = [];

  public async temporaryFilePath(file: string): Promise<string> {
    return file;
  }

  public async filePath(file: string): Promise<string> {
    return file;
  }

  public async fileExists(file: string): Promise<boolean> {
    return this.files.findIndex(item => item === file) >= 0;
  }

  public async saveFile({ destinationFile }: ISaveFileDTO): Promise<string> {
    this.files.push(destinationFile);
    return destinationFile;
  }

  public async deleteFile(file: string): Promise<void> {
    this.files = this.files.filter(item => item !== file);
  }
}
