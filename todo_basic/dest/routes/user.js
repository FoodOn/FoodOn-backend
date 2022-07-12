"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
/* Import Middlewares */
var isAuthenticated_1 = __importDefault(require("../middlewares/index/isAuthenticated"));
var userValidation_1 = __importDefault(require("../middlewares/user/userValidation"));
var validationError_1 = __importDefault(require("../middlewares/index/validationError"));
var multer_1 = __importDefault(require("../serverConfig/multer"));
/* Import Controllers */
var user_1 = require("../controllers/user");
var router = (0, express_1.Router)();
router.get('/', isAuthenticated_1.default, user_1.getUser);
router.put('/', multer_1.default.single('profile'), userValidation_1.default, validationError_1.default, isAuthenticated_1.default, user_1.updateUser);
exports.default = router;
