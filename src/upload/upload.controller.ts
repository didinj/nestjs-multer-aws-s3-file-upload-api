import {
    Controller,
    Post,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    // Single file upload
    @Post('file')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.uploadService.uploadSingleFile(file);
    }

    // Multiple files upload (up to 5)
    @Post('files')
    @UseInterceptors(FilesInterceptor('files', 5))
    async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
        return this.uploadService.uploadMultipleFiles(files);
    }
}
