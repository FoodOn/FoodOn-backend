"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_validator_1 = require("express-validator");
var userValidation = [
    (0, express_validator_1.body)('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name should not be empty'),
    (0, express_validator_1.body)('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name should not be empty'),
    (0, express_validator_1.body)('contact')
        .trim()
        .notEmpty()
        .withMessage('Contact should not be empty')
        .isLength({ min: 10, max: 10 })
        .withMessage('Contact must have 10 digits'),
    (0, express_validator_1.body)('address')
        .trim()
        .notEmpty()
        .withMessage('Address should not be empty'),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('Email should not be empty')
        .isEmail()
        .withMessage('Enter valid email')
        .normalizeEmail(),
];
exports.default = userValidation;
