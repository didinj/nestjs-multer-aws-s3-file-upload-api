import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { extname } from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
    private readonly s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });

    private bucketName = process.env.AWS_BUCKET_NAME!;

    private async uploadToS3(file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        const fileExt = extname(file.originalname);
        const key = `${randomUUID()}${fileExt}`;

        await this.s3.send(
            new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            }),
        );

        return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }

    async uploadSingleFile(file: Express.Multer.File) {
        const url = await this.uploadToS3(file);
        return { message: 'File uploaded successfully!', url };
    }

    async uploadMultipleFiles(files: Express.Multer.File[]) {
        const urls = await Promise.all(files.map((file) => this.uploadToS3(file)));
        return { message: 'Files uploaded successfully!', urls };
    }
}
