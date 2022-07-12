"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
/* Import Middlewares */
var signupValidation_1 = __importDefault(require("../middlewares/auth/signupValidation"));
var signinValidation_1 = __importDefault(require("../middlewares/auth/signinValidation"));
var validationError_1 = __importDefault(require("../middlewares/index/validationError"));
var multer_1 = __importDefault(require("../serverConfig/multer"));
/* Import Controllers */
var auth_1 = require("../controllers/auth");
var route = (0, express_1.Router)();
route.post('/signup', multer_1.default.single('profile'), signupValidation_1.default, validationError_1.default, auth_1.signup);
route.post('/signin', signinValidation_1.default, validationError_1.default, auth_1.signin);
route.get('/getGoogleLoginUrl', auth_1.getGoogleLoginUrl);
route.post('/verifyUser', auth_1.verifyUser);
exports.default = route;
