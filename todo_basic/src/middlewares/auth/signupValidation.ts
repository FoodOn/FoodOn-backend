import { body } from 'express-validator';
import { QueryArrayResult } from 'pg';
import db from '../../db';
import errorHandler from '../../utils/errorHandler';

const signupValidation = [
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name should not be empty'),
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name should not be empty'),
    body('contact')
        .trim()
        .notEmpty()
        .withMessage('Contact should not be empty')
        .isLength({ min: 10, max: 10 })
        .withMessage('Contact must have 10 digits'),
    body('address')
        .trim()
        .notEmpty()
        .withMessage('Address should not be empty'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email should not be empty')
        .isEmail()
        .withMessage('Enter valid email')
        .normalizeEmail(),
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username should not be empty')
        .isLength({ min: 6 })
        .withMessage('Username length should contain more than 6 character')
        .custom(async (value: string) => {
            const data = {
                text: 'SELECT username FROM user_account WHERE username=$1',
                values: [value],
            };
            try {
                const result: QueryArrayResult = await db.query(data);
                if (result.rowCount !== 0) throw errorHandler('Username is already in used', 400);
                return true;
            } catch (err: any) {
                throw errorHandler(err.message, err.status);
            }
        }),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password should not be empty')
        .isLength({ min: 6 })
        .withMessage('Password length should contain more than 6 character'),
];

export default signupValidation;
