"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var errorHandler_1 = __importDefault(require("./errorHandler"));
var getImage = function (fileName) {
    var filePath = path_1.default.resolve(__dirname, '..', '..', 'assets', fileName);
    return new Promise(function (resolve, reject) {
        fs_1.default.readFile(filePath, function (err, data) {
            if (err)
                return reject((0, errorHandler_1.default)('Not able to read the file', 500));
            return resolve(data);
        });
    });
};
exports.default = getImage;
