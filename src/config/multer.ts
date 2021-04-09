import multer from 'multer';
import path from 'path';

export default multer({
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 ** 2
    },
    fileFilter: (_, file, cb): void => {
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
});
