"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
/* Import Middlewares */
var isAuthenticated_1 = __importDefault(require("../middlewares/index/isAuthenticated"));
var todoValidation_1 = __importDefault(require("../middlewares/todo/todoValidation"));
var validationError_1 = __importDefault(require("../middlewares/index/validationError"));
/* Import Controllers */
var todo_1 = require("../controllers/todo");
var router = (0, express_1.Router)();
router.post('/', todoValidation_1.default, validationError_1.default, isAuthenticated_1.default, todo_1.createTodo);
router.get('/', isAuthenticated_1.default, todo_1.getTodo);
router.put('/:todoId', todoValidation_1.default, validationError_1.default, isAuthenticated_1.default, todo_1.updateTodo);
router.delete('/:todoId', isAuthenticated_1.default, todo_1.deleteTodo);
exports.default = router;
