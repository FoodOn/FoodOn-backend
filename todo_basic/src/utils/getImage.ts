import fs from 'fs';
import path from 'path';
import errorHandler from './errorHandler';

const getImage = (fileName: string): Promise<Buffer> => {
    const filePath = path.resolve(__dirname, '..', '..', 'assets', fileName);
    return new Promise<Buffer>((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) return reject(errorHandler('Not able to read the file', 500));
            return resolve(data);
        });
    });
};

export default getImage;
