import fs from 'fs';
import path from 'path';
import errorHandler from './errorHandler';

const deleteImage = (fileName: string): Promise<Boolean> => {
    const filePath = path.resolve(__dirname, '..', '..', 'assets', fileName);
    return new Promise<Boolean>((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) return reject(errorHandler('Not able to delete the file', 500));
            return resolve(true);
        });
    });
};

export default deleteImage;
