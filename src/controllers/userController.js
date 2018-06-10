"use strict";
exports.__esModule = true;
var mysql_pool_1 = require("../config/mysql.pool");
var regexEmail = require("regex-email");
var bcrypt = require("bcrypt");
var saltRounds = 10;
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.prototype.getLogin = function (req, res) {
        var requestEmail;
        requestEmail = req.query.email;
        requestEmail = requestEmail.replace(/(\s*)/g, "");
        if (!requestEmail)
            return res.json({ isSuccess: false, message: "이메일을 입력해주세요." });
        mysql_pool_1.pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                return res.json({ isSuccess: false, message: "서버와의 연결이 원활하지않습니다." });
            }
            connection.query({
                sql: "SELECT DELETE_YN \
                FROM USER_INFO \
                WHERE EMAIL = ?",
                timeout: 10000
            }, [requestEmail], function (error_1, results_1, columns_1) {
                connection.release();
                if (error_1) {
                    return res.json({ isSuccess: false, message: "로그인에 실패하였습니다.\n값을 확인해주세요." });
                }
                if (!results_1.length) {
                    return res.json({ isSuccess: false, message: "" });
                }
                if (results_1[0].DELETE_YN === 'Y') {
                    return res.json({ isSuccess: false, message: "계정을 탈퇴한 이메일입니다." });
                }
                res.json({ isSuccess: true, message: "" });
            });
        });
    };
    UserController.prototype.postLogin = function (req, res) {
        var requestEmail, requestPassword;
        requestEmail = req.body.email;
        requestPassword = req.body.password;
        if (!requestPassword)
            return res.json({ isSuccess: false, message: "비밀번호를 입력해주세요." });
        requestEmail = requestEmail.replace(/(\s*)/g, "");
        requestPassword = requestPassword.replace(/(\s*)/g, "");
        if (requestPassword.length < 6 || requestPassword.length > 20)
            return res.json({
                isSuccess: false,
                message: "비밀번호는 6~20자리를 입력해주세요."
            });
        mysql_pool_1.pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                return res.json({ isSuccess: false, message: "서버와의 연결이 원활하지않습니다." });
            }
            connection.query({
                sql: "SELECT PSWD, DELETE_YN \
                FROM USER_INFO \
                WHERE EMAIL = ?",
                timeout: 10000
            }, [requestEmail, requestPassword], function (error_1, results_1, columns_1) {
                connection.release();
                if (error_1) {
                    return res.json({ isSuccess: false, message: "로그인에 실패하였습니다.\n값을 확인해주세요." });
                }
                if (!results_1.length) {
                    return res.json({ isSuccess: false, message: "비밀번호가 올바르지 않습니다." });
                }
                if (results_1[0].DELETE_YN === 'Y') {
                    return res.json({ isSuccess: false, message: "계정을 탈퇴한 이메일입니다." });
                }
                bcrypt.compare(requestPassword, results_1[0].PSWD, function (error_2, isMatched) {
                    if (error_2) {
                        return res.json({ isSuccess: false, message: "로그인(비밀번호 매칭)에 실패하였습니다.\n값을 확인해주세요." });
                    }
                    if (isMatched === true) {
                        res.json({ isSuccess: true, message: "" });
                    }
                    else {
                        return res.json({ isSuccess: false, message: "비밀번호가 일치하지 않습니다." });
                    }
                });
            });
        });
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
        if (requestCategory.size < 3)
            return res.json({
                isSuccess: false,
                message: "관심분야를 3개 이상 선택해주세요."
            });
        if (requestAssociate.length === 0 || requestAssociate.length > 30)
            return res.json({
                isSuccess: false,
                message: "단체 / 기관을 입력해주세요."
            });
        if (!regexEmail.test(requestEmail))
            return res.json({ isSuccess: false, message: "이메일을 정확하게 입력해주세요." });
        console.log("post register");
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
                    connection.query({
                        sql: "INSERT INTO USER_INFO (EMAIL, PSWD, NICKNM, SEX, ASSOCIATE) \
                        VALUES (?, ?, ?, ?, ?)",
                        timeout: 10000
                    }, [requestEmail, hash, requestNickname, requestSex, requestAssociate], function (error_3, results_3, columns_3) {
                        connection.release();
                        if (error_3) {
                            return res.json({ isSuccess: false, message: "회원가입(사용자 등록)에 실패하였습니다.\n값을 확인해주세요." });
                        }
                        res.json({ isSuccess: true, message: "회원가입이 성공적으로 이루어졌습니다!" });
                    });
                });
            });
        });
    };
    return UserController;
}());
exports.UserController = UserController;
