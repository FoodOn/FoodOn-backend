"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_validator_1 = require("express-validator");
var errorHandler_1 = __importDefault(require("../utils/errorHandler"));
var validationError = function (req, _, next) {
    try {
        var error = (0, express_validator_1.validationResult)(req).array();
        if (error.length > 0)
            throw (0, errorHandler_1.default)(error[0].msg, 400);
        return next();
    }
    catch (err) {
        return next(err);
    }
};
exports.default = validationError;
