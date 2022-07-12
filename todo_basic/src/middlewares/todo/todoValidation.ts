import { body } from 'express-validator';

const todoValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title should not be empty')
        .isLength({ max: 100 })
        .withMessage('Title should contain less than 100 character'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description should not be empty'),
];

export default todoValidation;
