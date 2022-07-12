import multer, { Multer, StorageEngine } from 'multer';
import { Request, Express } from 'express';
import path from 'path';

type FileNameCallback = (error: Error | null, filename: string) => void

const imageStorage: StorageEngine = multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'assets'),
    filename: (_: Request, file: Express.Multer.File, cb: FileNameCallback) => {
        cb(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    },

});

const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
    if (file.mimetype === 'image/jpg'
        || file.mimetype === 'image/jpeg'
        || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Image uploaded is not of type jpg/jpeg or png'), false);
    }
};

const upload: Multer = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1000000,
    },
    fileFilter,
});

export default upload;
