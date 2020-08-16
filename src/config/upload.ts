import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const temporaryDir = path.resolve(__dirname, '..', '..', 'temp');

export default {
  temporaryDir,
  uploadDirectory: path.resolve(__dirname, '..', '..', 'uploads'),
  storage: multer.diskStorage({
    destination: temporaryDir,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
