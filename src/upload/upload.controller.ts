import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { imageMulterOptions } from 'src/utils/multer.options';
import { UploadService } from './upload.service';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'base64',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image', imageMulterOptions))
  uploadImage(@UploadedFile() image: Express.Multer.File) {
    const uploadedPath = this.uploadService.generateUploadedPath(image);
    return {
      path: uploadedPath,
    };
  }
}
