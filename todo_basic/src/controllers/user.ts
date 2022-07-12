import config from 'config';
import { RequestHandler } from 'express';
import { QueryArrayResult } from 'pg';
import db from '../db';
import deleteImage from '../utils/deleteImage';
import errorHandler from '../utils/errorHandler';
import { SERVER } from '../types/config';

export const getUser: RequestHandler = async (_, res, next) => {
    const { userId } = res.locals;
    const data = {
        text: 'SELECT * FROM user_account INNER JOIN image USING(user_id) WHERE user_id=$1',
        values: [userId],
    };

    try {
        const result: QueryArrayResult = await db.query(data);
        if (result.rowCount === 0) throw errorHandler('Fail to get user', 400);
        const {
            first_name: firstName,
            last_name: lastName,
            username,
            email,
            contact,
            address,
            created_at: createdAt,
            updated_at: updatedAt,
            name,
            url,
            file_name: fileName,
        } = result.rows[0] as any;
        return res.json({
            user: {
                userId,
                firstName,
                lastName,
                username,
                email,
                contact,
                address,
                createdAt,
                updatedAt,
            },
            profile: url ? {
                name,
                url,
                fileName,
            } : undefined,
        });
    } catch (err) {
        return next(err);
    }
};

export const updateUser: RequestHandler = async (req, res, next) => {
    const {
        firstName, lastName, contact, email, address, removeProfile,
    } = req.body;
    const { userId } = res.locals;
    const { SERVER_DOMAIN } = config.get('SERVER') as SERVER;
    const requestImageName = req.file?.originalname;
    const requestFileName = req.file?.filename;
    const imageUrl = requestFileName ? `${SERVER_DOMAIN}/image/${requestFileName}` : null;
    const dataBegin = {
        text: 'BEGIN',
        values: [],
    };
    const dataCommit = {
        text: 'COMMIT',
        values: [],
    };
    const dataRollback = {
        text: 'ROLLBACK',
        values: [],
    };
    const data1 = {
        text: 'SELECT * FROM image WHERE user_id=$1',
        values: [userId],
    };
    const data2 = {
        text: 'UPDATE user_account SET first_name=$1,last_name=$2,contact=$3,email=$4,address=$5 WHERE user_id=$6 RETURNING *',
        values: [firstName, lastName, contact, email, address, userId],
    };
    const data3 = {
        text: 'UPDATE image SET name=$1,url=$2,file_name=$3 WHERE user_id=$4 RETURNING *',
        values: [requestImageName, imageUrl, requestFileName, userId],
    };
    const data4 = {
        text: 'SELECT * FROM user_account INNER JOIN image USING(user_id) WHERE user_id=$1',
        values: [userId],
    };

    let imageTableUpdate = false;
    try {
        const result1: QueryArrayResult = await db.query(data1);
        if (result1.rowCount === 0) throw errorHandler('Fail to fetch image', 400);
        const { name: storedImageName, file_name: storedFileName } = result1.rows[0] as any;
        if (requestImageName) {
            if (requestImageName === storedImageName && requestFileName) {
                await deleteImage(requestFileName);
            } else {
                if (storedFileName) await deleteImage(storedFileName);
                imageTableUpdate = true;
            }
        }
        await db.query(dataBegin);
        const result2: QueryArrayResult = await db.query(data2);
        if (result2.rowCount === 0) throw errorHandler('Fail to update user', 400);
        if (imageTableUpdate || removeProfile === 'true') {
            const result3: QueryArrayResult = await db.query(data3);
            if (result3.rowCount === 0) throw errorHandler('Fail to update image', 400);
            if (removeProfile === 'true') await deleteImage(storedFileName);
        }
        await db.query(dataCommit);
        const result4: QueryArrayResult = await db.query(data4);
        if (result2.rowCount === 0) throw errorHandler('Fail to update user', 400);
        const {
            first_name: updatedFirstName,
            last_name: updatedLastName,
            contact: updatedContact,
            address: updateAddress,
            email: updatedEmail,
            name: updatedName,
            url: updatedUrl,
            file_name: updatedFileName,

        } = result4.rows[0] as any;
        return res.json({
            message: 'Update user profile successfully',
            user: {
                firstName: updatedFirstName,
                lastName: updatedLastName,
                contact: updatedContact,
                address: updateAddress,
                email: updatedEmail,
            },
            profile: updatedUrl ? {
                name: updatedName,
                url: updatedUrl,
                fileName: updatedFileName,
            } : undefined,
        });
    } catch (err) {
        try {
            await db.query(dataRollback);
            if (requestFileName) await deleteImage(requestFileName);
            return next(err);
        } catch (innerErr) {
            return next(innerErr);
        }
    }
};
