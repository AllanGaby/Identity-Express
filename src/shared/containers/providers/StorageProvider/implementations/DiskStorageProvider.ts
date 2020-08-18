import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';
import ISaveFileDTO from '../dtos/ISaveFileDTO';

export default class DiskStorageProvider implements IStorageProvider {
  public async temporaryFilePath(file: string): Promise<string> {
    return path.resolve(uploadConfig.temporaryDir, file);
  }

  public async filePath(file: string): Promise<string> {
    return path.resolve(uploadConfig.uploadDirectory, file);
  }

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
    sourceFile,
  }: ISaveFileDTO): Promise<string> {
    const sourceFilePath = path.resolve(uploadConfig.temporaryDir, sourceFile);
    const destinationFilePath = path.resolve(
      uploadConfig.uploadDirectory,
      destinationFile,
    );
    await fs.promises.rename(sourceFilePath, destinationFilePath);
    return destinationFilePath;
  }

  public async deleteFile(filePath: string): Promise<void> {
    if (await this.fileExists(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
}
