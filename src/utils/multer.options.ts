import { extname } from 'path';
import { randomUUID } from 'crypto';
import { HttpStatus } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { CustomException } from 'src/common/exceptions/custom.exception';

export function generateRandomFileName(file: Express.Multer.File) {
  const randomFileName = `${randomUUID()}${extname(file.originalname)}`;
  return randomFileName;
}

export const imageMulterOptions: MulterOptions = {
  fileFilter: (request, file, callback) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      callback(null, true);
    } else {
      callback(new CustomException(HttpStatus.BAD_REQUEST, 40001), false);
    }
  },
};
