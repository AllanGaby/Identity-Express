import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';
import ISaveFileDTO from '../dtos/ISaveFileDTO';

export default class DiskStorageProvider implements IStorageProvider {
  public async fileExists(file: string): Promise<boolean> {
    try {
      await fs.promises.stat(file);
      return true;
    } catch {
      return false;
    }
  }

  public async saveFile({
    destinationFile,
    sourceFilePath,
  }: ISaveFileDTO): Promise<string> {
    if (await this.fileExists(sourceFilePath)) {
      await fs.promises.rename(
        sourceFilePath,
        path.resolve(uploadConfig.uploadDirectory, destinationFile),
      );
      return destinationFile;
    }
    return '';
  }

  public async deleteFile(filePath: string): Promise<void> {
    if (await this.fileExists(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
}
