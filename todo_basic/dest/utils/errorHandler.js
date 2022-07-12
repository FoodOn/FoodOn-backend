"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var statusError_1 = __importDefault(require("../class/statusError"));
var errorHandler = function (message, status) {
    var err = new statusError_1.default(message);
    err.status = status;
    return err;
};
exports.default = errorHandler;
