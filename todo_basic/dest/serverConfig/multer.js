"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer_1 = __importDefault(require("multer"));
var path_1 = __importDefault(require("path"));
var imageStorage = multer_1.default.diskStorage({
    destination: path_1.default.resolve(__dirname, '..', '..', 'assets'),
    filename: function (_, file, cb) {
        cb(null, "".concat(file.fieldname, "_").concat(Date.now(), "_").concat(file.originalname));
    },
});
var fileFilter = function (req, file, cb) {
    if (file.mimetype === 'image/jpg'
        || file.mimetype === 'image/jpeg'
        || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(new Error('Image uploaded is not of type jpg/jpeg or png'), false);
    }
};
var upload = (0, multer_1.default)({
    storage: imageStorage,
    limits: {
        fileSize: 1000000,
    },
    fileFilter: fileFilter,
});
exports.default = upload;
