/* eslint-disable require-atomic-updates */
import { body } from 'express-validator';
import { QueryArrayResult } from 'pg';
import crypto from 'crypto';
import db from '../../db';
import errorHandler from '../../utils/errorHandler';

const signinValidation = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username should not be empty'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password should not be empty')
        .custom(async (value, { req }) => {
            const { username } = req.body;
            const data = {
                text: 'SELECT * FROM user_account INNER JOIN image USING(user_id) WHERE username=$1',
                values: [username],
            };
            try {
                const result: QueryArrayResult = await db.query(data);
                if (result.rowCount === 0) throw errorHandler('Username is incorrect', 400);
                const {
                    user_id: userId,
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    contact,
                    address,
                    password,
                    salt,
                    created_at: createdAt,
                    updated_at: updatedAt,
                    name,
                    url,
                    file_name: fileName,
                } = result.rows[0] as any;
                const hash = crypto.pbkdf2Sync(value, salt, 1000, 64, 'sha512').toString('hex');
                if (hash !== password) throw errorHandler('Password is incorrect', 400);
                const user = {
                    userId,
                    firstName,
                    lastName,
                    username,
                    email,
                    contact,
                    address,
                    createdAt,
                    updatedAt,
                };
                const profile = url ? {
                    name,
                    url,
                    fileName,
                } : undefined;

                req.body.user = user;
                req.body.profile = profile;
                return true;
            } catch (err: any) {
                throw errorHandler(err.message, err.status);
            }
        }),
];

export default signinValidation;
