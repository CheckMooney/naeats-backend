import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiFile } from 'src/docs/decorators';
import { imageMulterOptions } from 'src/utils/multer.options';
import { UploadImageResponse } from './responses';
import { UploadService } from './upload.service';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseInterceptors(FileInterceptor('image', imageMulterOptions))
  @Post('image')
  @ApiFile('image')
  @ApiOperation({ description: '단일 이미지 업로드' })
  @ApiResponse({ status: 201, type: UploadImageResponse })
  uploadImage(@UploadedFile() image: Express.Multer.File) {
    const uploadedPath = this.uploadService.generateUploadedPath(image);
    return {
      statusCode: 201,
      path: uploadedPath,
    };
  }
}
