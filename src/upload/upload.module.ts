import { Module } from '@nestjs/common';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadService } from './upload.service';
import { generateRandomFileName } from 'src/utils/multer.options';
import { UploadController } from './upload.controller';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: (request, file, callback) => {
            const uploadPath = configService.get<string>('UPLOAD_PATH');
            if (!existsSync(uploadPath)) {
              mkdirSync(uploadPath);
            }
            callback(null, uploadPath);
          },
          filename: (request, file, callback) => {
            callback(null, generateRandomFileName(file));
          },
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
