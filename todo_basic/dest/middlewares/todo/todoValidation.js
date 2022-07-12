"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_validator_1 = require("express-validator");
var todoValidation = [
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty()
        .withMessage('Title should not be empty')
        .isLength({ max: 100 })
        .withMessage('Title should contain less than 100 character'),
    (0, express_validator_1.body)('description')
        .trim()
        .notEmpty()
        .withMessage('Description should not be empty'),
];
exports.default = todoValidation;
