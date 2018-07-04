"use strict";
exports.__esModule = true;
var mysql_pool_1 = require("../config/mysql.pool");
var MainController = /** @class */ (function () {
    function MainController() {
    }
    MainController.prototype.getScheduleList = function (req, res) {
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
    MainController.prototype.getFeedList = function (req, res) {
        res.json({ isSuccess: true, message: "FeedList" });
    };
    return MainController;
}());
exports.MainController = MainController;
