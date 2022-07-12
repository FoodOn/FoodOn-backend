"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var googleapis_1 = require("googleapis");
var config_1 = __importDefault(require("config"));
var _a = config_1.default.get('GOOGLE'), GOOGLE_CLIENT_ID = _a.GOOGLE_CLIENT_ID, GOOGLE_SECRET = _a.GOOGLE_SECRET, GOOGLE_REDIRECT = _a.GOOGLE_REDIRECT;
var googleClient = new googleapis_1.google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_SECRET, GOOGLE_REDIRECT);
exports.default = googleClient;
