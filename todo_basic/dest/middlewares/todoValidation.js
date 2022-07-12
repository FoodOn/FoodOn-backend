"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_validator_1 = require("express-validator");
var signupValidation = [
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty()
        .withMessage('Title should not be empty')
        .isLength({ max: 25 })
        .withMessage('Title should contain less than 20 character'),
    (0, express_validator_1.body)('description')
        .trim()
        .notEmpty()
        .withMessage('Description should not be empty'),
];
exports.default = signupValidation;
