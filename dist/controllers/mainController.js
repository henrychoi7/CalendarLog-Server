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
                        return [4 /*yield*/, connection.query('SELECT SCH_DATE, COUNT(0) AS SCH_CNT \
                    FROM ( \
                      SELECT SCH_DATE \
                      FROM CALENDAR \
                      WHERE SCH_EMAIL = ? \
                    \
                      UNION ALL \
                    \
                      SELECT A.SCH_DATE \
                      FROM CALENDAR AS A \
                        INNER JOIN LIKE_HISTORY AS B \
                          ON B.MY_EMAIL = ? \
                             AND A.SCH_EMAIL = B.SCH_EMAIL \
                             AND A.SCH_SEQ = B.SCH_SEQ \
                    ) TOT \
                    GROUP BY SCH_DATE \
                    ORDER BY SCH_DATE ASC', [requestEmail, requestEmail])];
                    case 1:
                        scheduleList = _a.sent();
                        return [4 /*yield*/, connection.query('SELECT A.SCH_EMAIL, A.SCH_SEQ, A.IMG_URL, \
                      B.NICKNM, A.TITLE, A.CONTENT, \
                      DATE_FORMAT(A.REGISTER_DATETIME, \'%Y-%m-%d %p %l:%i\') AS REGISTER_DATETIME, IS_PUBLIC, \
                      (SELECT COUNT(0) AS LIKE_CNT \
                        FROM LIKE_HISTORY AS LH \
                        WHERE LH.SCH_EMAIL = A.SCH_EMAIL \
                        AND LH.SCH_SEQ = A.SCH_SEQ) AS LIKE_CNT, \
                      (SELECT CASE COUNT(0) WHEN 0 THEN \'N\' ELSE \'Y\' END AS IS_LIKE \
                        FROM LIKE_HISTORY AS LH \
                        WHERE LH.SCH_EMAIL = A.SCH_EMAIL \
                        AND LH.SCH_SEQ = A.SCH_SEQ \
                        AND LH.MY_EMAIL = ?) AS IS_LIKE, \
                      (SELECT COUNT(0) AS COM_CNT \
                        FROM COMMENT_HISTORY AS CH \
                        WHERE CH.SCH_EMAIL = A.SCH_EMAIL \
                        AND CH.SCH_SEQ = A.SCH_SEQ) AS COM_CNT \
                    FROM SCHEDULE AS A \
                    INNER JOIN USER_INFO AS B \
                      ON A.SCH_EMAIL = B.EMAIL \
                      AND B.DELETE_YN = \'N\' \
                    WHERE EXISTS ( \
                      SELECT UC.CTGR \
                      FROM USER_CATEGORY AS UC \
                      WHERE UC.EMAIL = ? \
                      AND A.CTGR = UC.CTGR \
                    ) \
                    AND A.IS_PUBLIC = \'Y\' \
                     \
                    UNION \
                     \
                    SELECT A.SCH_EMAIL, A.SCH_SEQ, A.IMG_URL, \
                      B.NICKNM, A.TITLE, A.CONTENT, \
                      DATE_FORMAT(A.REGISTER_DATETIME, \'%Y-%m-%d %p %l:%i\') AS REGISTER_DATETIME, IS_PUBLIC, \
                      0 AS LIKE_CNT, \'N\' AS IS_LIKE, 0 AS COM_CNT \
                    FROM SCHEDULE AS A \
                    INNER JOIN USER_INFO AS B \
                      ON A.SCH_EMAIL = B.EMAIL \
                      AND B.DELETE_YN = \'N\' \
                    WHERE SCH_EMAIL = ? \
                    ORDER BY SCH_EMAIL, SCH_SEQ DESC \
                    LIMIT 10', [requestEmail, requestEmail, requestEmail])];
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
                        return [4 /*yield*/, connection.query('SELECT A.SCH_EMAIL, A.SCH_SEQ, A.IMG_URL, \
                      B.NICKNM, A.TITLE, A.CONTENT, \
                      DATE_FORMAT(A.REGISTER_DATETIME, \'%Y-%m-%d %p %l:%i\') AS REGISTER_DATETIME, IS_PUBLIC, \
                      (SELECT COUNT(0) AS LIKE_CNT \
                        FROM LIKE_HISTORY AS LH \
                        WHERE LH.SCH_EMAIL = A.SCH_EMAIL \
                        AND LH.SCH_SEQ = A.SCH_SEQ) AS LIKE_CNT, \
                      (SELECT CASE COUNT(0) WHEN 0 THEN \'N\' ELSE \'Y\' END AS IS_LIKE \
                        FROM LIKE_HISTORY AS LH \
                        WHERE LH.SCH_EMAIL = A.SCH_EMAIL \
                        AND LH.SCH_SEQ = A.SCH_SEQ \
                        AND LH.MY_EMAIL = ?) AS IS_LIKE, \
                      (SELECT COUNT(0) AS COM_CNT \
                        FROM COMMENT_HISTORY AS CH \
                        WHERE CH.SCH_EMAIL = A.SCH_EMAIL \
                        AND CH.SCH_SEQ = A.SCH_SEQ) AS COM_CNT \
                    FROM SCHEDULE AS A \
                    INNER JOIN USER_INFO AS B \
                      ON A.SCH_EMAIL = B.EMAIL \
                      AND B.DELETE_YN = \'N\' \
                    WHERE EXISTS ( \
                      SELECT UC.CTGR \
                      FROM USER_CATEGORY AS UC \
                      WHERE UC.EMAIL = ? \
                      AND A.CTGR = UC.CTGR \
                    ) \
                    AND A.IS_PUBLIC = \'Y\' \
                     \
                    UNION \
                     \
                    SELECT A.SCH_EMAIL, A.SCH_SEQ, A.IMG_URL, \
                      B.NICKNM, A.TITLE, A.CONTENT, \
                      DATE_FORMAT(A.REGISTER_DATETIME, \'%Y-%m-%d %p %l:%i\') AS REGISTER_DATETIME, IS_PUBLIC, \
                      0 AS LIKE_CNT, \'N\' AS IS_LIKE, 0 AS COM_CNT \
                    FROM SCHEDULE AS A \
                    INNER JOIN USER_INFO AS B \
                      ON A.SCH_EMAIL = B.EMAIL \
                      AND B.DELETE_YN = \'N\' \
                    WHERE SCH_EMAIL = ? \
                    ORDER BY SCH_EMAIL, SCH_SEQ DESC \
                    LIMIT ?, 10', [requestEmail, requestEmail, requestEmail, Number(requestRow)])];
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
    return MainController;
}());
exports.MainController = MainController;
