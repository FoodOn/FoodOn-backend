import { body } from 'express-validator';


const userValidation = [
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
];

export default userValidation;
