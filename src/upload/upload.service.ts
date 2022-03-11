import { join } from 'path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  generateUploadedPath(file: Express.Multer.File) {
    const appUrl = this.configService.get<string>('APP_URL');
    const uploadPath = this.configService.get<string>('UPLOAD_PATH');
    const uploadedPath = new URL(
      join(uploadPath, file.filename),
      appUrl,
    ).toString();
    return uploadedPath;
  }
}
