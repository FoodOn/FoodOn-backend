"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = exports.getGoogleLoginUrl = exports.signin = exports.signup = void 0;
var crypto_1 = __importDefault(require("crypto"));
var config_1 = __importDefault(require("config"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var db_1 = __importDefault(require("../db"));
var errorHandler_1 = __importDefault(require("../utils/errorHandler"));
var deleteImage_1 = __importDefault(require("../utils/deleteImage"));
var googleClient_1 = __importDefault(require("../serverConfig/googleClient"));
var signup = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, firstName, lastName, contact, address, email, username, password, SERVER_DOMAIN, fileName, imageUrl, imageName, dataBegin, data1, data2, dataCommit, dataRollback, salt, hash, result1, userId, result2, err_1, innerErr_1;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.body, firstName = _a.firstName, lastName = _a.lastName, contact = _a.contact, address = _a.address, email = _a.email, username = _a.username, password = _a.password;
                SERVER_DOMAIN = config_1.default.get('SERVER').SERVER_DOMAIN;
                fileName = (_b = req.file) === null || _b === void 0 ? void 0 : _b.filename;
                imageUrl = fileName ? "".concat(SERVER_DOMAIN, "/image/").concat(fileName) : null;
                imageName = (_c = req.file) === null || _c === void 0 ? void 0 : _c.originalname;
                dataBegin = {
                    text: 'BEGIN',
                    values: [],
                };
                data1 = {
                    text: 'INSERT INTO user_account (first_name,last_name,username,email,contact,address,password,salt) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING user_id',
                    values: [firstName, lastName, username, email, contact, address],
                };
                data2 = {
                    text: 'INSERT INTO image (name,url,file_name,user_id) VALUES ($1,$2,$3,$4) RETURNING *',
                    values: [imageName, imageUrl, fileName],
                };
                dataCommit = {
                    text: 'COMMIT',
                    values: [],
                };
                dataRollback = {
                    text: 'ROLLBACK',
                    values: [],
                };
                salt = crypto_1.default.randomBytes(16).toString('hex');
                hash = crypto_1.default.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
                _d.label = 1;
            case 1:
                _d.trys.push([1, 6, , 13]);
                return [4 /*yield*/, db_1.default.query(dataBegin)];
            case 2:
                _d.sent();
                return [4 /*yield*/, db_1.default.query(__assign(__assign({}, data1), { values: __spreadArray(__spreadArray([], data1.values, true), [hash, salt], false) }))];
            case 3:
                result1 = _d.sent();
                if (result1.rowCount === 0)
                    throw (0, errorHandler_1.default)('Not able to register,Try again later', 400);
                userId = result1.rows[0].user_id;
                return [4 /*yield*/, db_1.default.query(__assign(__assign({}, data2), { values: __spreadArray(__spreadArray([], data2.values, true), [userId], false) }))];
            case 4:
                result2 = _d.sent();
                if (result2.rowCount === 0)
                    throw (0, errorHandler_1.default)('Image not uploaded', 400);
                return [4 /*yield*/, db_1.default.query(dataCommit)];
            case 5:
                _d.sent();
                return [2 /*return*/, res.json({
                        message: 'Register successfully',
                    })];
            case 6:
                err_1 = _d.sent();
                _d.label = 7;
            case 7:
                _d.trys.push([7, 11, , 12]);
                return [4 /*yield*/, db_1.default.query(dataRollback)];
            case 8:
                _d.sent();
                if (!fileName) return [3 /*break*/, 10];
                return [4 /*yield*/, (0, deleteImage_1.default)(fileName)];
            case 9:
                _d.sent();
                _d.label = 10;
            case 10: return [2 /*return*/, next(err_1)];
            case 11:
                innerErr_1 = _d.sent();
                return [2 /*return*/, next(innerErr_1)];
            case 12: return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.signup = signup;
var signin = function (req, res, next) {
    var _a = req.body, user = _a.user, profile = _a.profile;
    var userId = user.userId;
    var SERVER_JWT_SECRET_KEY = config_1.default.get('SERVER').SERVER_JWT_SECRET_KEY;
    try {
        var token = jsonwebtoken_1.default.sign({ userId: userId }, SERVER_JWT_SECRET_KEY);
        return res.json({
            message: 'Signin successfully',
            token: token,
            user: user,
            profile: profile,
        });
    }
    catch (err) {
        return next(err);
    }
};
exports.signin = signin;
var getGoogleLoginUrl = function (req, res) {
    var url = googleClient_1.default.generateAuthUrl({
        // eslint-disable-next-line camelcase
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ],
        prompt: 'consent',
    });
    return res.send(url);
};
exports.getGoogleLoginUrl = getGoogleLoginUrl;
var verifyUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var code, resToken, idToken, resProfile, email, data, result, _a, userId, firstName, lastName, username, contact, address, createdAt, updatedAt, name_1, url, fileName, user, profile, SERVER_JWT_SECRET_KEY, token, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                code = req.body.code;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, googleClient_1.default.getToken(code)];
            case 2:
                resToken = _b.sent();
                idToken = resToken.tokens.id_token;
                if (!idToken)
                    throw (0, errorHandler_1.default)('Google login failed', 500);
                return [4 /*yield*/, googleClient_1.default.verifyIdToken({ idToken: idToken })];
            case 3:
                resProfile = _b.sent();
                email = (resProfile.getPayload() || {}).email;
                data = {
                    text: 'SELECT * FROM user_account INNER JOIN image USING(user_id) WHERE email=$1',
                    values: [email],
                };
                return [4 /*yield*/, db_1.default.query(data)];
            case 4:
                result = _b.sent();
                if (result.rowCount === 0)
                    throw (0, errorHandler_1.default)('You have not register,Please register', 400);
                _a = result.rows[0], userId = _a.user_id, firstName = _a.first_name, lastName = _a.last_name, username = _a.username, contact = _a.contact, address = _a.address, createdAt = _a.created_at, updatedAt = _a.updated_at, name_1 = _a.name, url = _a.url, fileName = _a.file_name;
                user = {
                    userId: userId,
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    email: email,
                    contact: contact,
                    address: address,
                    createdAt: createdAt,
                    updatedAt: updatedAt,
                };
                profile = url ? {
                    name: name_1,
                    url: url,
                    fileName: fileName,
                } : undefined;
                SERVER_JWT_SECRET_KEY = config_1.default.get('SERVER').SERVER_JWT_SECRET_KEY;
                token = jsonwebtoken_1.default.sign({ userId: userId }, SERVER_JWT_SECRET_KEY);
                return [2 /*return*/, res.json({
                        message: 'Signin successfully',
                        token: token,
                        user: user,
                        profile: profile,
                    })];
            case 5:
                err_2 = _b.sent();
                return [2 /*return*/, next(err_2)];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.verifyUser = verifyUser;
