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
var MainController = /** @class */ (function () {
    function MainController() {
    }
    MainController.prototype.getScheduleAndFeedList = function (req, res) {
        var _this = this;
        var requestEmail = req.query.email;
        if (!requestEmail)
            return res.json({ isSuccess: false, message: "이메일을 입력해주세요." });
        requestEmail = requestEmail.replace(/(\s*)/g, '');
        //const get = promiseMysqlModule.connect((con: any, id: string) => con.query('select * from user', [id]));
        mysql_pool_1.promiseMysqlModule.connect(function (connection) { return __awaiter(_this, void 0, void 0, function () {
            var scheduleList, feedList, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, connection.query("\nSELECT TOT.SCH_DATE, COUNT(0) AS SCH_CNT\nFROM (\n    SELECT SCH_DATE\n    FROM CALENDAR\n    WHERE SCH_EMAIL = ?\n\n    UNION ALL\n\n    SELECT A.SCH_DATE\n    FROM CALENDAR AS A\n    INNER JOIN LIKE_HISTORY AS B\n        ON B.MY_EMAIL = ?\n        AND A.SCH_EMAIL = B.SCH_EMAIL\n        AND A.SCH_SEQ = B.SCH_SEQ\n    INNER JOIN USER_INFO AS C\n        ON B.SCH_EMAIL = C.EMAIL\n        AND C.DELETE_YN = 'N'\n) TOT\nGROUP BY TOT.SCH_DATE\nORDER BY TOT.SCH_DATE ASC\n", [requestEmail, requestEmail])];
                    case 1:
                        scheduleList = _a.sent();
                        return [4 /*yield*/, connection.query("\nSELECT A.SCH_EMAIL, A.SCH_SEQ, A.IMG_URL,\n    CASE WHEN A.SCH_EMAIL = ? THEN CONCAT(B.NICKNM, ' (\uB098)')\n        ELSE B.NICKNM END NICKNM, A.TITLE, A.CONTENT,\n    CONCAT(\n        CONCAT(DATE_FORMAT(A.REGISTER_DATETIME, '%Y-%m-%d '), CASE DATE_FORMAT(A.REGISTER_DATETIME, '%p') WHEN 'PM' THEN '\uC624\uD6C4' ELSE '\uC624\uC804' END),\n        DATE_FORMAT(A.REGISTER_DATETIME, ' %l:%i')\n    ) AS REGISTER_DATETIME, A.IS_PUBLIC,\n    (SELECT COUNT(0) AS LIKE_CNT\n    FROM LIKE_HISTORY AS LH\n    WHERE LH.SCH_EMAIL = A.SCH_EMAIL\n    AND LH.SCH_SEQ = A.SCH_SEQ) AS LIKE_CNT,\n    (SELECT CASE COUNT(0) WHEN 0 THEN 'N' ELSE 'Y' END AS IS_LIKE\n    FROM LIKE_HISTORY AS LH\n    WHERE LH.SCH_EMAIL = A.SCH_EMAIL\n    AND LH.SCH_SEQ = A.SCH_SEQ\n    AND LH.MY_EMAIL = ?) AS IS_LIKE,\n    (SELECT COUNT(0) AS COM_CNT\n    FROM COMMENT_HISTORY AS CH\n    WHERE CH.SCH_EMAIL = A.SCH_EMAIL\n    AND CH.SCH_SEQ = A.SCH_SEQ) AS COM_CNT\nFROM SCHEDULE AS A\nINNER JOIN USER_INFO AS B\n    ON A.SCH_EMAIL = B.EMAIL\n    AND B.DELETE_YN = 'N'\nWHERE EXISTS (\n    SELECT UC.CTGR\n    FROM USER_CATEGORY AS UC\n    WHERE UC.EMAIL = ?\n    AND A.CTGR = UC.CTGR\n)\nAND A.IS_PUBLIC = 'Y'\n\nUNION\n\nSELECT A.SCH_EMAIL, A.SCH_SEQ, A.IMG_URL,\n    CONCAT(B.NICKNM, ' (\uB098)') AS NICKNM, A.TITLE, A.CONTENT,\n    CONCAT(\n        CONCAT(DATE_FORMAT(A.REGISTER_DATETIME, '%Y-%m-%d '), CASE DATE_FORMAT(A.REGISTER_DATETIME, '%p') WHEN 'PM' THEN '\uC624\uD6C4' ELSE '\uC624\uC804' END),\n        DATE_FORMAT(A.REGISTER_DATETIME, ' %l:%i')\n    ) AS REGISTER_DATETIME, A.IS_PUBLIC,\n    0 AS LIKE_CNT, 'N' AS IS_LIKE, 0 AS COM_CNT\nFROM SCHEDULE AS A\nINNER JOIN USER_INFO AS B\n    ON A.SCH_EMAIL = B.EMAIL\nWHERE SCH_EMAIL = ?\nORDER BY REGISTER_DATETIME DESC\nLIMIT 10\n", [requestEmail, requestEmail, requestEmail, requestEmail])];
                    case 2:
                        feedList = _a.sent();
                        return [2 /*return*/, res.json({ isSuccess: true, message: "", scheduleList: scheduleList, feedList: feedList })];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, res.json({ isSuccess: false, message: "서버와의 연결이 불안정합니다." })];
                    case 4: return [2 /*return*/];
                }
            });
        }); })();
    };
    MainController.prototype.getFeedList = function (req, res) {
        var _this = this;
        var requestEmail = req.query.email;
        if (!requestEmail)
            return res.json({ isSuccess: false, message: "이메일을 입력해주세요." });
        requestEmail = requestEmail.replace(/(\s*)/g, '');
        var requestRow = req.query.row;
        if (!requestRow || isNaN(requestRow) || requestRow < 0)
            return res.json({
                isSuccess: false,
                message: "조회 번호가 잘못되었습니다."
            });
        mysql_pool_1.promiseMysqlModule.connect(function (connection) { return __awaiter(_this, void 0, void 0, function () {
            var feedList, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, connection.query("\nSELECT A.SCH_EMAIL, A.SCH_SEQ, A.IMG_URL,\n    CASE WHEN A.SCH_EMAIL = ? THEN CONCAT(B.NICKNM, ' (\uB098)')\n      ELSE B.NICKNM END NICKNM, A.TITLE, A.CONTENT,\n    CONCAT(\n        CONCAT(DATE_FORMAT(A.REGISTER_DATETIME, '%Y-%m-%d '), CASE DATE_FORMAT(A.REGISTER_DATETIME, '%p') WHEN 'PM' THEN '\uC624\uD6C4' ELSE '\uC624\uC804' END),\n        DATE_FORMAT(A.REGISTER_DATETIME, ' %l:%i')\n    ) AS REGISTER_DATETIME, A.IS_PUBLIC,\n    (SELECT COUNT(0) AS LIKE_CNT\n    FROM LIKE_HISTORY AS LH\n    WHERE LH.SCH_EMAIL = A.SCH_EMAIL\n    AND LH.SCH_SEQ = A.SCH_SEQ) AS LIKE_CNT,\n    (SELECT CASE COUNT(0) WHEN 0 THEN 'N' ELSE 'Y' END AS IS_LIKE\n    FROM LIKE_HISTORY AS LH\n    WHERE LH.SCH_EMAIL = A.SCH_EMAIL\n    AND LH.SCH_SEQ = A.SCH_SEQ\n    AND LH.MY_EMAIL = ?) AS IS_LIKE,\n    (SELECT COUNT(0) AS COM_CNT\n    FROM COMMENT_HISTORY AS CH\n    WHERE CH.SCH_EMAIL = A.SCH_EMAIL\n    AND CH.SCH_SEQ = A.SCH_SEQ) AS COM_CNT\nFROM SCHEDULE AS A\nINNER JOIN USER_INFO AS B\n    ON A.SCH_EMAIL = B.EMAIL\n    AND B.DELETE_YN = 'N'\nWHERE EXISTS (\n    SELECT UC.CTGR\n    FROM USER_CATEGORY AS UC\n    WHERE UC.EMAIL = ?\n    AND A.CTGR = UC.CTGR\n)\nAND A.IS_PUBLIC = 'Y'\n\nUNION\n\nSELECT A.SCH_EMAIL, A.SCH_SEQ, A.IMG_URL,\n    CONCAT(B.NICKNM, ' (\uB098)') AS NICKNM, A.TITLE, A.CONTENT,\n    CONCAT(\n        CONCAT(DATE_FORMAT(A.REGISTER_DATETIME, '%Y-%m-%d '), CASE DATE_FORMAT(A.REGISTER_DATETIME, '%p') WHEN 'PM' THEN '\uC624\uD6C4' ELSE '\uC624\uC804' END),\n        DATE_FORMAT(A.REGISTER_DATETIME, ' %l:%i')\n    ) AS REGISTER_DATETIME, A.IS_PUBLIC,\n    0 AS LIKE_CNT, 'N' AS IS_LIKE, 0 AS COM_CNT\nFROM SCHEDULE AS A\nINNER JOIN USER_INFO AS B\n    ON A.SCH_EMAIL = B.EMAIL\nWHERE SCH_EMAIL = ?\nORDER BY REGISTER_DATETIME DESC\nLIMIT ?, 10\n", [requestEmail, requestEmail, requestEmail, requestEmail, Number(requestRow)])];
                    case 1:
                        feedList = _a.sent();
                        return [2 /*return*/, res.json({ isSuccess: true, message: "", feedList: feedList })];
                    case 2:
                        error_2 = _a.sent();
                        return [2 /*return*/, res.json({ isSuccess: false, message: "서버와의 연결이 불안정합니다." })];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
    };
    MainController.prototype.getFeedListForDay = function (req, res) {
        var _this = this;
        var requestEmail = req.query.email;
        if (!requestEmail)
            return res.json({ isSuccess: false, message: "이메일을 입력해주세요." });
        requestEmail = requestEmail.replace(/(\s*)/g, '');
        var requestRow = req.query.row;
        if (!requestRow || isNaN(requestRow) || requestRow < 0)
            return res.json({
                isSuccess: false,
                message: "조회 번호가 잘못되었습니다."
            });
        var requestScheduleDate = req.query.scheduleDate;
        if (!requestScheduleDate)
            return res.json({ isSuccess: false, message: "조회 일자를 입력해주세요." });
        requestScheduleDate = requestScheduleDate.replace(/(\s*)/g, '');
        if (requestScheduleDate.length != 8)
            return res.json({ isSuccess: false, message: "조회 일자를 올바르게 입력해주세요." });
        mysql_pool_1.promiseMysqlModule.connect(function (connection) { return __awaiter(_this, void 0, void 0, function () {
            var feedList, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, connection.query("\nSELECT A.SCH_EMAIL, A.SCH_SEQ, A.IMG_URL,\n    CASE WHEN A.SCH_EMAIL = ? THEN CONCAT(B.NICKNM, ' (\uB098)')\n        ELSE B.NICKNM END NICKNM, A.TITLE, A.CONTENT,\n    CONCAT(\n        CONCAT(DATE_FORMAT(A.REGISTER_DATETIME, '%Y-%m-%d '), CASE DATE_FORMAT(A.REGISTER_DATETIME, '%p') WHEN 'PM' THEN '\uC624\uD6C4' ELSE '\uC624\uC804' END),\n        DATE_FORMAT(A.REGISTER_DATETIME, ' %l:%i')\n    ) AS REGISTER_DATETIME, A.IS_PUBLIC,\n    (SELECT COUNT(0) AS LIKE_CNT\n    FROM LIKE_HISTORY AS LH\n    WHERE LH.SCH_EMAIL = A.SCH_EMAIL\n    AND LH.SCH_SEQ = A.SCH_SEQ) AS LIKE_CNT,\n    (SELECT CASE COUNT(0) WHEN 0 THEN 'N' ELSE 'Y' END AS IS_LIKE\n    FROM LIKE_HISTORY AS LH\n    WHERE LH.SCH_EMAIL = A.SCH_EMAIL\n    AND LH.SCH_SEQ = A.SCH_SEQ\n    AND LH.MY_EMAIL = ?) AS IS_LIKE,\n    (SELECT COUNT(0) AS COM_CNT\n    FROM COMMENT_HISTORY AS CH\n    WHERE CH.SCH_EMAIL = A.SCH_EMAIL\n    AND CH.SCH_SEQ = A.SCH_SEQ) AS COM_CNT\nFROM SCHEDULE AS A\nINNER JOIN USER_INFO AS B\n    ON A.SCH_EMAIL = B.EMAIL\n    AND B.DELETE_YN = 'N'\nINNER JOIN LIKE_HISTORY AS C\n    ON C.MY_EMAIL = ?\n    AND A.SCH_EMAIL = C.SCH_EMAIL\n    AND A.SCH_SEQ = C.SCH_SEQ\nWHERE EXISTS (\n    SELECT UC.CTGR\n    FROM USER_CATEGORY AS UC\n    WHERE UC.EMAIL = ?\n    AND A.CTGR = UC.CTGR\n)\nAND A.START_DATE <= ?\nAND A.END_DATE >= ?\nAND A.IS_PUBLIC = 'Y'\n\nUNION ALL\n\nSELECT A.SCH_EMAIL, A.SCH_SEQ, A.IMG_URL,\n    CONCAT(B.NICKNM, ' (\uB098)') AS NICKNM, A.TITLE, A.CONTENT,\n    CONCAT(\n        CONCAT(DATE_FORMAT(A.REGISTER_DATETIME, '%Y-%m-%d '), CASE DATE_FORMAT(A.REGISTER_DATETIME, '%p') WHEN 'PM' THEN '\uC624\uD6C4' ELSE '\uC624\uC804' END),\n        DATE_FORMAT(A.REGISTER_DATETIME, ' %l:%i')\n    ) AS REGISTER_DATETIME, A.IS_PUBLIC,\n    0 AS LIKE_CNT, 'N' AS IS_LIKE, 0 AS COM_CNT\nFROM SCHEDULE AS A\nINNER JOIN USER_INFO AS B\n    ON A.SCH_EMAIL = B.EMAIL\nWHERE A.SCH_EMAIL = ?\nAND A.START_DATE <= ?\nAND A.END_DATE >= ?\nORDER BY REGISTER_DATETIME DESC\nLIMIT ?, 10\n", [requestEmail, requestEmail, requestEmail, requestEmail, requestScheduleDate, requestScheduleDate,
                                requestEmail, requestScheduleDate, requestScheduleDate,
                                Number(requestRow)])];
                    case 1:
                        feedList = _a.sent();
                        return [2 /*return*/, res.json({ isSuccess: true, message: "", feedList: feedList })];
                    case 2:
                        error_3 = _a.sent();
                        return [2 /*return*/, res.json({ isSuccess: false, message: "서버와의 연결이 불안정합니다." })];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
    };
    MainController.prototype.getFeedListForUserInfo = function (req, res) {
        var _this = this;
        var requestEmail = req.query.email;
        if (!requestEmail)
            return res.json({ isSuccess: false, message: "이메일을 입력해주세요." });
        requestEmail = requestEmail.replace(/(\s*)/g, '');
        var requestRow = req.query.row;
        if (!requestRow || isNaN(requestRow) || requestRow < 0)
            return res.json({
                isSuccess: false,
                message: "조회 번호가 잘못되었습니다."
            });
        mysql_pool_1.promiseMysqlModule.connect(function (connection) { return __awaiter(_this, void 0, void 0, function () {
            var feedList, count, userInfo, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, connection.query("\nSELECT C.SCH_EMAIL, C.SCH_SEQ, C.IMG_URL,\n    CASE WHEN C.SCH_EMAIL = ? THEN CONCAT(B.NICKNM, ' (\uB098)')\n        ELSE B.NICKNM END NICKNM, C.TITLE, C.CONTENT,\n    CONCAT(\n        CONCAT(DATE_FORMAT(C.REGISTER_DATETIME, '%Y-%m-%d '), CASE DATE_FORMAT(C.REGISTER_DATETIME, '%p') WHEN 'PM' THEN '\uC624\uD6C4' ELSE '\uC624\uC804' END),\n        DATE_FORMAT(C.REGISTER_DATETIME, ' %l:%i')\n    ) AS REGISTER_DATETIME, C.IS_PUBLIC,\n    (SELECT COUNT(0) AS LIKE_CNT\n    FROM LIKE_HISTORY AS LH\n    WHERE LH.SCH_EMAIL = A.SCH_EMAIL\n    AND LH.SCH_SEQ = A.SCH_SEQ) AS LIKE_CNT,\n    'Y' AS IS_LIKE,\n    (SELECT COUNT(0) AS COM_CNT\n    FROM COMMENT_HISTORY AS CH\n    WHERE CH.SCH_EMAIL = A.SCH_EMAIL\n    AND CH.SCH_SEQ = A.SCH_SEQ) AS COM_CNT\nFROM LIKE_HISTORY AS A\nINNER JOIN USER_INFO AS B\n    ON A.SCH_EMAIL = B.EMAIL\n    AND B.DELETE_YN = 'N'\nINNER JOIN SCHEDULE AS C\n    ON A.SCH_EMAIL = C.SCH_EMAIL\n    AND A.SCH_SEQ = C.SCH_SEQ\nWHERE A.MY_EMAIL = ?\n\nUNION\n\nSELECT A.SCH_EMAIL, A.SCH_SEQ, A.IMG_URL,\n    CONCAT(B.NICKNM, ' (\uB098)') AS NICKNM, A.TITLE, A.CONTENT,\n    CONCAT(\n        CONCAT(DATE_FORMAT(A.REGISTER_DATETIME, '%Y-%m-%d '), CASE DATE_FORMAT(A.REGISTER_DATETIME, '%p') WHEN 'PM' THEN '\uC624\uD6C4' ELSE '\uC624\uC804' END),\n        DATE_FORMAT(A.REGISTER_DATETIME, ' %l:%i')\n    ) AS REGISTER_DATETIME, A.IS_PUBLIC,\n  0 AS LIKE_CNT, 'N' AS IS_LIKE, 0 AS COM_CNT\nFROM SCHEDULE AS A\nINNER JOIN USER_INFO AS B\n    ON A.SCH_EMAIL = B.EMAIL\nWHERE SCH_EMAIL = ?\nORDER BY REGISTER_DATETIME DESC\nLIMIT ?, 10\n", [requestEmail, requestEmail, requestEmail, Number(requestRow)])];
                    case 1:
                        feedList = _a.sent();
                        return [4 /*yield*/, connection.query("\nSELECT COUNT(1) AS CNT\nFROM LIKE_HISTORY\nWHERE MY_EMAIL = ?\n", [requestEmail])];
                    case 2:
                        count = _a.sent();
                        return [4 /*yield*/, connection.query("\nSELECT NICKNM, NOTE_YN\nFROM USER_INFO\nWHERE EMAIL = ?\n", [requestEmail])];
                    case 3:
                        userInfo = _a.sent();
                        return [2 /*return*/, res.json({
                                isSuccess: true,
                                message: "",
                                likedScheduleCount: String(count[0].CNT),
                                nickname: userInfo[0].NICKNM,
                                isReceiveNote: userInfo[0].NOTE_YN,
                                feedList: feedList
                            })];
                    case 4:
                        error_4 = _a.sent();
                        return [2 /*return*/, res.json({ isSuccess: false, message: "서버와의 연결이 불안정합니다." })];
                    case 5: return [2 /*return*/];
                }
            });
        }); })();
    };
    return MainController;
}());
exports.MainController = MainController;
