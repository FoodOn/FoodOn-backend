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
exports.updateUser = exports.getUser = void 0;
var config_1 = __importDefault(require("config"));
var db_1 = __importDefault(require("../db"));
var deleteImage_1 = __importDefault(require("../utils/deleteImage"));
var errorHandler_1 = __importDefault(require("../utils/errorHandler"));
var getUser = function (_, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, data, result, _a, firstName, lastName, username, email, contact, address, createdAt, updatedAt, name_1, url, fileName, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = res.locals.userId;
                data = {
                    text: 'SELECT * FROM user_account INNER JOIN image USING(user_id) WHERE user_id=$1',
                    values: [userId],
                };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.default.query(data)];
            case 2:
                result = _b.sent();
                if (result.rowCount === 0)
                    throw (0, errorHandler_1.default)('Fail to get user', 400);
                _a = result.rows[0], firstName = _a.first_name, lastName = _a.last_name, username = _a.username, email = _a.email, contact = _a.contact, address = _a.address, createdAt = _a.created_at, updatedAt = _a.updated_at, name_1 = _a.name, url = _a.url, fileName = _a.file_name;
                return [2 /*return*/, res.json({
                        user: {
                            userId: userId,
                            firstName: firstName,
                            lastName: lastName,
                            username: username,
                            email: email,
                            contact: contact,
                            address: address,
                            createdAt: createdAt,
                            updatedAt: updatedAt,
                        },
                        profile: url ? {
                            name: name_1,
                            url: url,
                            fileName: fileName,
                        } : undefined,
                    })];
            case 3:
                err_1 = _b.sent();
                return [2 /*return*/, next(err_1)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getUser = getUser;
var updateUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, firstName, lastName, contact, email, address, removeProfile, userId, SERVER_DOMAIN, requestImageName, requestFileName, imageUrl, dataBegin, dataCommit, dataRollback, data1, data2, data3, data4, imageTableUpdate, result1, _b, storedImageName, storedFileName, result2, result3, result4, _c, updatedFirstName, updatedLastName, updatedContact, updateAddress, updatedEmail, updatedName, updatedUrl, updatedFileName, err_2, innerErr_1;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = req.body, firstName = _a.firstName, lastName = _a.lastName, contact = _a.contact, email = _a.email, address = _a.address, removeProfile = _a.removeProfile;
                userId = res.locals.userId;
                SERVER_DOMAIN = config_1.default.get('SERVER').SERVER_DOMAIN;
                requestImageName = (_d = req.file) === null || _d === void 0 ? void 0 : _d.originalname;
                requestFileName = (_e = req.file) === null || _e === void 0 ? void 0 : _e.filename;
                imageUrl = requestFileName ? "".concat(SERVER_DOMAIN, "/image/").concat(requestFileName) : null;
                dataBegin = {
                    text: 'BEGIN',
                    values: [],
                };
                dataCommit = {
                    text: 'COMMIT',
                    values: [],
                };
                dataRollback = {
                    text: 'ROLLBACK',
                    values: [],
                };
                data1 = {
                    text: 'SELECT * FROM image WHERE user_id=$1',
                    values: [userId],
                };
                data2 = {
                    text: 'UPDATE user_account SET first_name=$1,last_name=$2,contact=$3,email=$4,address=$5 WHERE user_id=$6 RETURNING *',
                    values: [firstName, lastName, contact, email, address, userId],
                };
                data3 = {
                    text: 'UPDATE image SET name=$1,url=$2,file_name=$3 WHERE user_id=$4 RETURNING *',
                    values: [requestImageName, imageUrl, requestFileName, userId],
                };
                data4 = {
                    text: 'SELECT * FROM user_account INNER JOIN image USING(user_id) WHERE user_id=$1',
                    values: [userId],
                };
                imageTableUpdate = false;
                _f.label = 1;
            case 1:
                _f.trys.push([1, 15, , 22]);
                return [4 /*yield*/, db_1.default.query(data1)];
            case 2:
                result1 = _f.sent();
                if (result1.rowCount === 0)
                    throw (0, errorHandler_1.default)('Fail to fetch image', 400);
                _b = result1.rows[0], storedImageName = _b.name, storedFileName = _b.file_name;
                if (!requestImageName) return [3 /*break*/, 7];
                if (!(requestImageName === storedImageName && requestFileName)) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, deleteImage_1.default)(requestFileName)];
            case 3:
                _f.sent();
                return [3 /*break*/, 7];
            case 4:
                if (!storedFileName) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, deleteImage_1.default)(storedFileName)];
            case 5:
                _f.sent();
                _f.label = 6;
            case 6:
                imageTableUpdate = true;
                _f.label = 7;
            case 7: return [4 /*yield*/, db_1.default.query(dataBegin)];
            case 8:
                _f.sent();
                return [4 /*yield*/, db_1.default.query(data2)];
            case 9:
                result2 = _f.sent();
                if (result2.rowCount === 0)
                    throw (0, errorHandler_1.default)('Fail to update user', 400);
                if (!(imageTableUpdate || removeProfile === 'true')) return [3 /*break*/, 12];
                return [4 /*yield*/, db_1.default.query(data3)];
            case 10:
                result3 = _f.sent();
                if (result3.rowCount === 0)
                    throw (0, errorHandler_1.default)('Fail to update image', 400);
                if (!(removeProfile === 'true')) return [3 /*break*/, 12];
                return [4 /*yield*/, (0, deleteImage_1.default)(storedFileName)];
            case 11:
                _f.sent();
                _f.label = 12;
            case 12: return [4 /*yield*/, db_1.default.query(dataCommit)];
            case 13:
                _f.sent();
                return [4 /*yield*/, db_1.default.query(data4)];
            case 14:
                result4 = _f.sent();
                if (result2.rowCount === 0)
                    throw (0, errorHandler_1.default)('Fail to update user', 400);
                _c = result4.rows[0], updatedFirstName = _c.first_name, updatedLastName = _c.last_name, updatedContact = _c.contact, updateAddress = _c.address, updatedEmail = _c.email, updatedName = _c.name, updatedUrl = _c.url, updatedFileName = _c.file_name;
                return [2 /*return*/, res.json({
                        message: 'Update user profile successfully',
                        user: {
                            firstName: updatedFirstName,
                            lastName: updatedLastName,
                            contact: updatedContact,
                            address: updateAddress,
                            email: updatedEmail,
                        },
                        profile: updatedUrl ? {
                            name: updatedName,
                            url: updatedUrl,
                            fileName: updatedFileName,
                        } : undefined,
                    })];
            case 15:
                err_2 = _f.sent();
                _f.label = 16;
            case 16:
                _f.trys.push([16, 20, , 21]);
                return [4 /*yield*/, db_1.default.query(dataRollback)];
            case 17:
                _f.sent();
                if (!requestFileName) return [3 /*break*/, 19];
                return [4 /*yield*/, (0, deleteImage_1.default)(requestFileName)];
            case 18:
                _f.sent();
                _f.label = 19;
            case 19: return [2 /*return*/, next(err_2)];
            case 20:
                innerErr_1 = _f.sent();
                return [2 /*return*/, next(innerErr_1)];
            case 21: return [3 /*break*/, 22];
            case 22: return [2 /*return*/];
        }
    });
}); };
exports.updateUser = updateUser;
