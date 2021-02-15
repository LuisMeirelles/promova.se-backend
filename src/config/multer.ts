import multer, {
    FileFilterCallback
} from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request } from 'express';

export default {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: multer.diskStorage({
        destination: (
            req,
            file,
            cb
        ): void => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
        },
        filename: (
            req,
            file,
            cb
        ) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) {
                    cb(err, file.filename);
                } else {
                    const filename = `${hash.toString('hex')}-${file.originalname}`;

                    cb(null, filename);
                }
            });
        }
    }),
    limits: {
        fileSize: 2 * 1024 ** 2
    },
    fileFilter: (
        req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
    ): void => {
        const allowedMimes = [
            'image/png',
            'image/jpeg',
            'image/pjpeg',
            'image/gif'
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type.'));
        }
    }
};
