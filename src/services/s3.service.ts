import {randomUUID} from 'node:crypto';
import {DeleteObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {UploadedFile} from 'express-fileupload';
import path from 'path';
import {FileItemTypeEnum} from '../enums/file-item-type.enum';
import {configs} from '../configs/config';

class S3Service {
    constructor(
        private readonly client = new S3Client({
            region: configs.AWS_S3_REGION,
            credentials: {
                accessKeyId: configs.AWS_ACCESS_KEY,
                secretAccessKey: configs.AWS_SECRET_KEY,
            },
        }),
    ) {}

    public async deleteFile(key: string): Promise<void> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: configs.AWS_S3_BUCKET_NAME,
                Key: key,
            });

            await this.client.send(command);
            console.log(`Deleted file from S3: ${key}`);
        } catch (error) {
            console.error('Failed to delete file from S3:', error);
            throw error;
        }
    }
    public async uploadFile(
        file: UploadedFile,
        itemType: FileItemTypeEnum,
        itemId: string,
    ): Promise<string> {
        try {
            const filePath = this.buildPath(itemType, itemId, file.name);
            await this.client.send(
                new PutObjectCommand({
                    Bucket: configs.AWS_S3_BUCKET_NAME,
                    Key: filePath,
                    Body: file.data,
                    ContentType: file.mimetype,
                    ACL: configs.AWS_S3_ACL,
                }),
            );
            return filePath;
        } catch (error) {
            console.error('Error upload:', error);
          throw error;
        }
    }

    private buildPath(
        itemType: FileItemTypeEnum,
        itemId: string,
        fileName: string,
    ): string {
        return `${itemType}/${itemId}/${randomUUID()}${path.extname(fileName)}`;
    }
}

export const s3Service = new S3Service();

