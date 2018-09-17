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
var mysql_pool_1 = require("../config/mysql.pool");
var regexEmail = require("regex-email");
var bcrypt = require("bcrypt");
var util_1 = require("util");
var saltRounds = 10;
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.prototype.getLogin = function (req, res) {
        var _this = this;
        var requestEmail = req.query.email;
        if (!requestEmail)
            return res.json({ isSuccess: false, message: "이메일을 입력해주세요." });
        requestEmail = requestEmail.replace(/(\s*)/g, '');
        mysql_pool_1.promiseMysqlModule.connect(function (connection) { return __awaiter(_this, void 0, void 0, function () {
            var getLogin, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, connection.query("\nSELECT DELETE_YN \nFROM USER_INFO \nWHERE EMAIL = ?", [requestEmail])];
                    case 1:
                        getLogin = _a.sent();
                        if (!getLogin.length) {
                            return [2 /*return*/, res.json({ isSuccess: false, message: "" })];
                        }
                        if (getLogin[0].DELETE_YN === 'Y') {
                            return [2 /*return*/, res.json({ isSuccess: false, message: "계정을 탈퇴한 이메일입니다." })];
                        }
                        res.json({ isSuccess: true, message: "" });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        return [2 /*return*/, res.json({ isSuccess: false, message: "서버와의 연결이 불안정합니다." })];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
    };
    UserController.prototype.postLogin = function (req, res) {
        var _this = this;
        var requestEmail = req.body.email, requestPassword = req.body.password;
        if (!requestEmail)
            return res.json({ isSuccess: false, message: "이메일을 입력해주세요." });
        if (!requestPassword)
            return res.json({ isSuccess: false, message: "비밀번호를 입력해주세요." });
        requestEmail = requestEmail.replace(/(\s*)/g, "");
        requestPassword = requestPassword.replace(/(\s*)/g, "");
        mysql_pool_1.promiseMysqlModule.connect(function (connection) { return __awaiter(_this, void 0, void 0, function () {
            var postLogin, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, connection.query("\nSELECT PSWD, DELETE_YN\nFROM USER_INFO\nWHERE EMAIL = ?", [requestEmail])];
                    case 1:
                        postLogin = _a.sent();
                        if (!postLogin.length) {
                            return [2 /*return*/, res.json({ isSuccess: false, message: "이메일이 올바르지 않습니다." })];
                        }
                        if (postLogin[0].DELETE_YN === 'Y') {
                            return [2 /*return*/, res.json({ isSuccess: false, message: "계정을 탈퇴한 이메일입니다." })];
                        }
                        bcrypt.compare(requestPassword, postLogin[0].PSWD, function (error_2, isMatched) {
                            if (error_2) {
                                return res.json({ isSuccess: false, message: "로그인(비밀번호 매칭)에 실패하였습니다.\n값을 확인해주세요." });
                            }
                            if (isMatched === true) {
                                res.json({ isSuccess: true, message: "" });
                            }
                            else {
                                res.json({ isSuccess: false, message: "비밀번호가 일치하지 않습니다." });
                            }
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        return [2 /*return*/, res.json({ isSuccess: false, message: "로그인에 실패하였습니다.\n값을 확인해주세요." })];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
    };
    UserController.prototype.postRegister = function (req, res) {
        var requestEmail = req.body.email, requestPassword = req.body.password, requestPasswordConfirmation = req.body.password_confirmation, requestNickname = req.body.nickname, requestSex = req.body.sex, requestCategory = req.body.category, requestAssociate = req.body.associate;
        if (!requestEmail)
            return res.json({ isSuccess: false, message: "이메일을 입력해주세요." });
        if (!requestPassword)
            return res.json({ isSuccess: false, message: "비밀번호를 입력해주세요." });
        if (!requestPasswordConfirmation)
            return res.json({ isSuccess: false, message: "비밀번호 확인 값을 입력해주세요." });
        if (!requestNickname)
            return res.json({ isSuccess: false, message: "닉네임을 입력해주세요." });
        if (!requestSex)
            return res.json({ isSuccess: false, message: "성별을 선택해주세요." });
        if (!requestCategory)
            return res.json({ isSuccess: false, message: "관심분야를 선택해주세요." });
        if (!requestAssociate)
            return res.json({ isSuccess: false, message: "단체 / 기관을 입력해주세요." });
        requestEmail = requestEmail.replace(/(\s*)/g, "");
        requestPassword = requestPassword.replace(/(\s*)/g, "");
        requestPasswordConfirmation = requestPasswordConfirmation.replace(/(\s*)/g, "");
        requestNickname = requestNickname.replace(/(\s*)/g, "");
        requestAssociate = requestAssociate.replace(/(\s*)/g, "");
        if (requestEmail.length > 30)
            return res.json({
                isSuccess: false,
                message: "이메일은 30자리 미만으로 입력해주세요."
            });
        if (requestPassword.length < 6 || requestPassword.length > 20)
            return res.json({
                isSuccess: false,
                message: "비밀번호는 6~20자리를 입력해주세요."
            });
        if (requestPasswordConfirmation.length < 6 || requestPasswordConfirmation.length > 20)
            return res.json({
                isSuccess: false,
                message: "비밀번호 확인 값은 6~20자리를 입력해주세요."
            });
        if (requestPassword !== requestPasswordConfirmation)
            return res.json({
                isSuccess: false,
                message: "비밀번호가 일치하지 않습니다."
            });
        if (requestNickname.length < 2 || requestNickname.length > 25)
            return res.json({
                isSuccess: false,
                message: "닉네임은 2~25자리를 입력해주세요."
            });
        if (requestSex !== 'M' && requestSex !== 'F')
            return res.json({
                isSuccess: false,
                message: "성별을 선택해주세요."
            });
        if (requestCategory.length < 3 || requestCategory.arr)
            return res.json({
                isSuccess: false,
                message: "관심분야를 3개 이상 선택해주세요."
            });
        var executeSQL = "";
        if (requestCategory instanceof Array) {
            for (var i = 0; i < requestCategory.length; i++) {
                var categoryCode = "";
                switch (requestCategory[i]) {
                    case 0:
                        categoryCode = "001";
                        break;
                    case 1:
                        categoryCode = "002";
                        break;
                    case 2:
                        categoryCode = "003";
                        break;
                    case 3:
                        categoryCode = "004";
                        break;
                    case 4:
                        categoryCode = "005";
                        break;
                    case 5:
                        categoryCode = "006";
                        break;
                    default:
                        return res.json({
                            isSuccess: false,
                            message: "선택한 관심분야 값이 올바르지 않습니다."
                        });
                }
                executeSQL += "INSERT INTO USER_CATEGORY (EMAIL, CTGR) \
                            VALUES ('" + requestEmail + "', '" + categoryCode + "');";
            }
        }
        else {
            return res.json({
                isSuccess: false,
                message: "선택한 관심분야 값이 올바르지 않습니다."
            });
        }
        if (requestAssociate.length === 0 || requestAssociate.length > 30)
            return res.json({
                isSuccess: false,
                message: "단체 / 기관을 입력해주세요."
            });
        if (!regexEmail.test(requestEmail))
            return res.json({ isSuccess: false, message: "이메일을 정확하게 입력해주세요." });
        // 트랜잭션에서 다중쿼리 async/await 하는 부분을 잘 모르겠음
        mysql_pool_1.pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                return res.json({ isSuccess: false, message: "서버와의 연결이 원활하지않습니다." });
            }
            connection.query({
                sql: 'SELECT COUNT(1) AS CNT \
                  FROM USER_INFO \
                  WHERE EMAIL = ?',
                timeout: 10000
            }, [requestEmail], function (error_1, results_1, columns_1) {
                if (error_1) {
                    connection.release();
                    return res.json({ isSuccess: false, message: "회원가입(이메일 중복 검사)에 실패하였습니다.\n값을 확인해주세요." });
                }
                if (results_1[0].CNT !== 0) {
                    connection.release();
                    return res.json({ isSuccess: false, message: "중복되는 아이디입니다." });
                }
                bcrypt.hash(requestPassword, saltRounds, function (error_2, hash) {
                    if (error_2) {
                        connection.release();
                        return res.json({ isSuccess: false, message: "회원가입(비밀번호 암호화)에 실패하였습니다.\n값을 확인해주세요." });
                    }
                    executeSQL += "INSERT INTO USER_INFO (EMAIL, PSWD, NICKNM, SEX, ASSOCIATE) \
                                        VALUES ('" + requestEmail + "', '" + hash + "', '" + requestNickname + "', '" + requestSex + "', '" + requestAssociate + "');";
                    connection.beginTransaction(function (err) {
                        if (err) {
                            connection.release();
                            return res.json({ isSuccess: false, message: "회원가입(사용자 등록)에 실패하였습니다.\n값을 확인해주세요." });
                        }
                        connection.query(executeSQL, function (error_2, results_2, fields) {
                            if (error_2) {
                                return connection.rollback(function () {
                                    connection.release();
                                    res.json({ isSuccess: false, message: "회원가입(사용자 등록)에 실패하였습니다.\n값을 확인해주세요." });
                                });
                            }
                            connection.commit(function (error_3) {
                                if (error_3) {
                                    return connection.rollback(function () {
                                        connection.release();
                                        res.json({ isSuccess: false, message: "회원가입(사용자 등록)에 실패하였습니다.\n값을 확인해주세요." });
                                    });
                                }
                                connection.release();
                                res.json({ isSuccess: true, message: "회원가입이 성공적으로 이루어졌습니다!" });
                            });
                        });
                    });
                });
            });
        });
    };
    UserController.prototype.updateNoteStatus = function (req, res) {
        var _this = this;
        var requestEmail = req.body.email;
        var requestIsReceiveNote = req.body.isReceiveNote;
        if (!requestEmail)
            return res.json({ isSuccess: false, message: "이메일을 입력해주세요." });
        if (util_1.isBoolean(requestIsReceiveNote) == false)
            return res.json({ isSuccess: false, message: "쪽지 수신 여부 값을 올바르게 입력해주세요." });
        requestEmail = requestEmail.replace(/(\s*)/g, "");
        mysql_pool_1.promiseMysqlModule.connect(function (connection) { return __awaiter(_this, void 0, void 0, function () {
            var userInfo, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, connection.query("\nUPDATE USER_INFO\nSET NOTE_YN = ?\nWHERE EMAIL = ?", [requestIsReceiveNote == true ? "Y" : "N", requestEmail])];
                    case 1:
                        userInfo = _a.sent();
                        if (userInfo.affectedRows === 0) {
                            res.json({ isSuccess: false, message: "이메일이 올바르지 않습니다." });
                        }
                        else {
                            res.json({ isSuccess: true, message: "" });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        return [2 /*return*/, res.json({ isSuccess: false, message: "쪽지 수신 여부를 변경하는데 실패하였습니다.\n다시 시도해주세요." })];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
    };
    UserController.prototype.deleteUserInfo = function (req, res) {
        var _this = this;
        var requestEmail = req.body.email;
        if (!requestEmail)
            return res.json({ isSuccess: false, message: "이메일을 입력해주세요." });
        requestEmail = requestEmail.replace(/(\s*)/g, "");
        mysql_pool_1.promiseMysqlModule.connect(function (connection) { return __awaiter(_this, void 0, void 0, function () {
            var userInfo, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, connection.query("\nUPDATE USER_INFO\nSET DELETE_YN = 'Y'\nWHERE EMAIL = ?", [requestEmail])];
                    case 1:
                        userInfo = _a.sent();
                        if (userInfo.affectedRows === 0) {
                            res.json({ isSuccess: false, message: "이메일이 올바르지 않습니다." });
                        }
                        else {
                            res.json({ isSuccess: true, message: "" });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        return [2 /*return*/, res.json({ isSuccess: false, message: "회원탈퇴에 실패하였습니다.\n다시 시도해주세요." })];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
    };
    UserController.prototype.getUserInfoForEdit = function (req, res) {
        var _this = this;
        var requestEmail = req.query.email;
        if (!requestEmail)
            return res.json({ isSuccess: false, message: "이메일을 입력해주세요." });
        requestEmail = requestEmail.replace(/(\s*)/g, "");
        mysql_pool_1.promiseMysqlModule.connect(function (connection) { return __awaiter(_this, void 0, void 0, function () {
            var userInfo, userCategoryIndexes, categories, _i, userCategoryIndexes_1, index, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, connection.query("\nSELECT SEX, ASSOCIATE\nFROM USER_INFO\nWHERE EMAIL = ?", [requestEmail])];
                    case 1:
                        userInfo = _a.sent();
                        return [4 /*yield*/, connection.query("\nSELECT CAST(CTGR AS UNSIGNED) - 1 AS IDX\nFROM USER_CATEGORY\nWHERE EMAIL = ?", [requestEmail])];
                    case 2:
                        userCategoryIndexes = _a.sent();
                        categories = [];
                        for (_i = 0, userCategoryIndexes_1 = userCategoryIndexes; _i < userCategoryIndexes_1.length; _i++) {
                            index = userCategoryIndexes_1[_i];
                            categories.push(index.IDX);
                        }
                        res.json({
                            isSuccess: true,
                            message: "이메일이 올바르지 않습니다.",
                            sex: userInfo[0].SEX,
                            categories: categories,
                            associate: userInfo[0].ASSOCIATE
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_8 = _a.sent();
                        return [2 /*return*/, res.json({ isSuccess: false, message: "계정정보를 불러오는데 실패하였습니다.\n다시 시도해주세요." })];
                    case 4: return [2 /*return*/];
                }
            });
        }); })();
    };
    return UserController;
}());
exports.UserController = UserController;
