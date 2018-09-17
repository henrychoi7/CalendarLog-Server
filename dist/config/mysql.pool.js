"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
exports.__esModule = true;
var mysql = require("mysql");
exports.pool = mysql.createPool({
    //밑에 설정 조건들, 다 Default 라서 주석
    //connectionLimit: 10,
    //queueLimit: 0,
    //waitForConnections: true,
    //acquireTimeout: 10000
    host: '13.209.31.64',
    user: 'penguinEx',
    password: 'vpdrnls!',
    database: 'PENGUIN_EX',
    charset: 'utf8mb4',
    multipleStatements: true
    //2017.08.20
    //mysql connection pool 공홈 참고해봤는데 뭔가 이상하다.
    //local 이 default 라는데, Z값이나 +00:10 이런거하면 제대로안먹히고
    //아래와 같이 +0000 = +HHMM 해야 타임존이 yyyy-mm-dd hh:mm:ss 이렇게 나오는데 또 값이 플러스가 안됨
    //일단은 원하는형식으로 나오길래 아래와 같이 해놓음
    //timezone:+0001
});
/**
 * 기존 import 하는 방식이 아닌 이유는 promise-mysql은
 * 정의 파일(typings)이 없기 때문에 아래와 같이 쓴다.
 */
var promiseMysql = require('promise-mysql');
var promisePool = promiseMysql.createPool({
    //밑에 설정 조건들, 다 Default 라서 주석
    //connectionLimit: 10,
    //queueLimit: 0,
    //waitForConnections: true,
    //acquireTimeout: 10000
    host: '13.209.31.64',
    user: 'penguinEx',
    password: 'vpdrnls!',
    database: 'PENGUIN_EX',
    charset: 'utf8mb4',
    multipleStatements: true
    //2017.08.20
    //mysql connection pool 공홈 참고해봤는데 뭔가 이상하다.
    //local 이 default 라는데, Z값이나 +00:10 이런거하면 제대로안먹히고
    //아래와 같이 +0000 = +HHMM 해야 타임존이 yyyy-mm-dd hh:mm:ss 이렇게 나오는데 또 값이 플러스가 안됨
    //일단은 원하는형식으로 나오길래 아래와 같이 해놓음
    //timezone:+0001
});
var promiseMysqlModule;
(function (promiseMysqlModule) {
    var _this = this;
    promiseMysqlModule.connect = function (fn) { return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(_this, void 0, void 0, function () {
            var promiseConnection, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, promisePool.getConnection()];
                    case 1:
                        promiseConnection = _a.sent();
                        return [4 /*yield*/, fn.apply(void 0, [promiseConnection].concat(args))["catch"](function (error) {
                                /* 에러시 connection 을 닫아준다. */
                                promiseConnection.connection.release();
                                throw error;
                            })];
                    case 2:
                        result = _a.sent();
                        /* connection 을 닫아준다. */
                        promiseConnection.connection.release();
                        return [2 /*return*/, result];
                }
            });
        });
    }; };
    promiseMysqlModule.transaction = function (fn) { return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var promiseConnection, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, promisePool.getConnection()];
                    case 1:
                        promiseConnection = _a.sent();
                        /* 트렌젝션 시작 */
                        return [4 /*yield*/, promiseConnection.connection.beginTransaction()];
                    case 2:
                        /* 트렌젝션 시작 */
                        _a.sent();
                        return [4 /*yield*/, fn.apply(void 0, [promiseConnection].concat(args))["catch"](function (error) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: 
                                        /* rollback 을 진행한다. */
                                        return [4 /*yield*/, promiseConnection.rollback()];
                                        case 1:
                                            /* rollback 을 진행한다. */
                                            _a.sent();
                                            /* 에러시 connection 을 닫아준다. */
                                            promiseConnection.connection.release();
                                            throw error;
                                    }
                                });
                            }); })];
                    case 3:
                        result = _a.sent();
                        /* commit 을 해준다. */
                        return [4 /*yield*/, promiseConnection.commit()];
                    case 4:
                        /* commit 을 해준다. */
                        _a.sent();
                        /* connection 을 닫아준다. */
                        promiseConnection.connection.release();
                        return [2 /*return*/, result];
                }
            });
        });
    }; };
})(promiseMysqlModule = exports.promiseMysqlModule || (exports.promiseMysqlModule = {}));
