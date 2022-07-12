"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.updateTodo = exports.getTodo = exports.createTodo = void 0;
var db_1 = __importDefault(require("../db"));
var errorHandler_1 = __importDefault(require("../utils/errorHandler"));
var createTodo = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, description, userId, data, result, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, title = _a.title, description = _a.description;
                userId = res.locals.userId;
                data = {
                    text: 'INSERT INTO todo(title,description,user_id) VALUES($1,$2,$3) RETURNING todo_id,title,description,complete',
                    values: [title, description, userId],
                };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.default.query(data)];
            case 2:
                result = _b.sent();
                if (result.rowCount === 0)
                    throw (0, errorHandler_1.default)('Fail to create Todo', 400);
                return [2 /*return*/, res.json({ message: 'Todo added successfully', todo: result.rows[0] })];
            case 3:
                err_1 = _b.sent();
                return [2 /*return*/, next(err_1)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createTodo = createTodo;
var getTodo = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var todoId, userId, data, result, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                todoId = req.query.todoId;
                userId = res.locals.userId;
                data = {
                    text: todoId ? 'SELECT todo_id,title,description,complete FROM todo WHERE todo_id=$1 AND user_id=$2' : 'SELECT todo_id,title,description,complete FROM todo WHERE user_id=$1 ORDER BY created_at DESC',
                    values: todoId ? [todoId, userId] : [userId],
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.default.query(data)];
            case 2:
                result = _a.sent();
                return [2 /*return*/, res.json({ todos: result.rows })];
            case 3:
                err_2 = _a.sent();
                return [2 /*return*/, next(err_2)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getTodo = getTodo;
var updateTodo = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var todoId, _a, title, description, complete, userId, data, result, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                todoId = req.params.todoId;
                _a = req.body, title = _a.title, description = _a.description, complete = _a.complete;
                userId = res.locals.userId;
                data = {
                    text: 'UPDATE todo SET title=$1,description=$2,complete=$3 WHERE todo_id=$4 AND user_id=$5',
                    values: [title, description, complete, todoId, userId],
                };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.default.query(data)];
            case 2:
                result = _b.sent();
                if (result.rowCount === 0)
                    throw (0, errorHandler_1.default)('Fail to update todo', 400);
                return [2 /*return*/, res.json({ message: 'Todo Updated successfully' })];
            case 3:
                err_3 = _b.sent();
                return [2 /*return*/, next(err_3)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateTodo = updateTodo;
var deleteTodo = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var todoId, userId, data, result, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                todoId = req.params.todoId;
                userId = res.locals.userId;
                data = {
                    text: 'DELETE FROM todo WHERE todo_id=$1 AND user_id=$2',
                    values: [todoId, userId],
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.default.query(data)];
            case 2:
                result = _a.sent();
                if (result.rowCount === 0)
                    throw (0, errorHandler_1.default)('Fail to delete Todo', 400);
                return [2 /*return*/, res.json({ message: 'Todo deleted succesfully' })];
            case 3:
                err_4 = _a.sent();
                return [2 /*return*/, next(err_4)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteTodo = deleteTodo;
