"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_pool_1 = require("../config/mysql.pool");
class MainController {
    getScheduleAndFeedList(req, res) {
        let requestEmail = req.query.email;
        if (!requestEmail)
            return res.json({ isSuccess: false, message: "이메일을 입력해주세요." });
        requestEmail = requestEmail.replace(/(\s*)/g, '');
        //const get = promiseMysqlModule.connect((con: any, id: string) => con.query('select * from user', [id]));
        mysql_pool_1.promiseMysqlModule.connect((connection) => __awaiter(this, void 0, void 0, function* () {
            try {
                const scheduleList = yield connection.query(`
SELECT TOT.SCH_DATE, COUNT(0) AS SCH_CNT
FROM (
  SELECT SCH_DATE
  FROM CALENDAR
  WHERE SCH_EMAIL = ?

  UNION ALL

  SELECT A.SCH_DATE
  FROM CALENDAR AS A
    INNER JOIN LIKE_HISTORY AS B
      ON B.MY_EMAIL = ?
         AND A.SCH_EMAIL = B.SCH_EMAIL
         AND A.SCH_SEQ = B.SCH_SEQ
    INNER JOIN USER_INFO AS C
      ON B.SCH_EMAIL = C.EMAIL
      AND C.DELETE_YN = 'N'
) TOT
GROUP BY TOT.SCH_DATE
ORDER BY TOT.SCH_DATE ASC
`, [requestEmail, requestEmail]);
                const feedList = yield connection.query(`
SELECT A.SCH_EMAIL, A.SCH_SEQ, A.IMG_URL,
  B.NICKNM, A.TITLE, A.CONTENT,
  CONCAT(
    CONCAT(DATE_FORMAT(A.REGISTER_DATETIME, '%Y-%m-%d '), CASE DATE_FORMAT(A.REGISTER_DATETIME, '%p') WHEN 'PM' THEN '오후' ELSE '오전' END),
    DATE_FORMAT(A.REGISTER_DATETIME, ' %l:%i')
  ) AS REGISTER_DATETIME, A.IS_PUBLIC,
  (SELECT COUNT(0) AS LIKE_CNT
    FROM LIKE_HISTORY AS LH
    WHERE LH.SCH_EMAIL = A.SCH_EMAIL
    AND LH.SCH_SEQ = A.SCH_SEQ) AS LIKE_CNT,
  (SELECT CASE COUNT(0) WHEN 0 THEN 'N' ELSE 'Y' END AS IS_LIKE
    FROM LIKE_HISTORY AS LH
    WHERE LH.SCH_EMAIL = A.SCH_EMAIL
    AND LH.SCH_SEQ = A.SCH_SEQ
    AND LH.MY_EMAIL = ?) AS IS_LIKE,
  (SELECT COUNT(0) AS COM_CNT
    FROM COMMENT_HISTORY AS CH
    WHERE CH.SCH_EMAIL = A.SCH_EMAIL
    AND CH.SCH_SEQ = A.SCH_SEQ) AS COM_CNT
FROM SCHEDULE AS A
INNER JOIN USER_INFO AS B
  ON A.SCH_EMAIL = B.EMAIL
  AND B.DELETE_YN = 'N'
WHERE EXISTS (
  SELECT UC.CTGR
  FROM USER_CATEGORY AS UC
  WHERE UC.EMAIL = ?
  AND A.CTGR = UC.CTGR
)
AND A.IS_PUBLIC = 'Y'

UNION

SELECT A.SCH_EMAIL, A.SCH_SEQ, A.IMG_URL,
  CONCAT(B.NICKNM, ' (나)') AS NICKNM, A.TITLE, A.CONTENT,
  CONCAT(
    CONCAT(DATE_FORMAT(A.REGISTER_DATETIME, '%Y-%m-%d '), CASE DATE_FORMAT(A.REGISTER_DATETIME, '%p') WHEN 'PM' THEN '오후' ELSE '오전' END),
    DATE_FORMAT(A.REGISTER_DATETIME, ' %l:%i')
  ) AS REGISTER_DATETIME, A.IS_PUBLIC,
  0 AS LIKE_CNT, 'N' AS IS_LIKE, 0 AS COM_CNT
FROM SCHEDULE AS A
INNER JOIN USER_INFO AS B
  ON A.SCH_EMAIL = B.EMAIL
WHERE SCH_EMAIL = ?
ORDER BY SCH_EMAIL, SCH_SEQ DESC
LIMIT 10
`, [requestEmail, requestEmail, requestEmail]);
                return res.json({ isSuccess: true, message: "", scheduleList: scheduleList, feedList: feedList });
            }
            catch (error) {
                return res.json({ isSuccess: false, message: "서버와의 연결이 불안정합니다." });
            }
        }))();
    }
    getFeedList(req, res) {
        let requestEmail = req.query.email;
        if (!requestEmail)
            return res.json({ isSuccess: false, message: "이메일을 입력해주세요." });
        requestEmail = requestEmail.replace(/(\s*)/g, '');
        let requestRow = req.query.row;
        if (!requestRow || isNaN(requestRow) || requestRow < 0)
            return res.json({
                isSuccess: false,
                message: "조회 번호가 잘못되었습니다."
            });
        mysql_pool_1.promiseMysqlModule.connect((connection) => __awaiter(this, void 0, void 0, function* () {
            try {
                const feedList = yield connection.query(`
SELECT A.SCH_EMAIL, A.SCH_SEQ, A.IMG_URL,
  B.NICKNM, A.TITLE, A.CONTENT,
  CONCAT(
    CONCAT(DATE_FORMAT(A.REGISTER_DATETIME, '%Y-%m-%d '), CASE DATE_FORMAT(A.REGISTER_DATETIME, '%p') WHEN 'PM' THEN '오후' ELSE '오전' END),
    DATE_FORMAT(A.REGISTER_DATETIME, ' %l:%i')
  ) AS REGISTER_DATETIME, A.IS_PUBLIC,
  (SELECT COUNT(0) AS LIKE_CNT
    FROM LIKE_HISTORY AS LH
    WHERE LH.SCH_EMAIL = A.SCH_EMAIL
    AND LH.SCH_SEQ = A.SCH_SEQ) AS LIKE_CNT,
  (SELECT CASE COUNT(0) WHEN 0 THEN 'N' ELSE 'Y' END AS IS_LIKE
    FROM LIKE_HISTORY AS LH
    WHERE LH.SCH_EMAIL = A.SCH_EMAIL
    AND LH.SCH_SEQ = A.SCH_SEQ
    AND LH.MY_EMAIL = ?) AS IS_LIKE,
  (SELECT COUNT(0) AS COM_CNT
    FROM COMMENT_HISTORY AS CH
    WHERE CH.SCH_EMAIL = A.SCH_EMAIL
    AND CH.SCH_SEQ = A.SCH_SEQ) AS COM_CNT
FROM SCHEDULE AS A
INNER JOIN USER_INFO AS B
  ON A.SCH_EMAIL = B.EMAIL
  AND B.DELETE_YN = 'N'
WHERE EXISTS (
  SELECT UC.CTGR
  FROM USER_CATEGORY AS UC
  WHERE UC.EMAIL = ?
  AND A.CTGR = UC.CTGR
)
AND A.IS_PUBLIC = 'Y'

UNION

SELECT A.SCH_EMAIL, A.SCH_SEQ, A.IMG_URL,
  CONCAT(B.NICKNM, ' (나)') AS NICKNM, A.TITLE, A.CONTENT,
  CONCAT(
    CONCAT(DATE_FORMAT(A.REGISTER_DATETIME, '%Y-%m-%d '), CASE DATE_FORMAT(A.REGISTER_DATETIME, '%p') WHEN 'PM' THEN '오후' ELSE '오전' END),
    DATE_FORMAT(A.REGISTER_DATETIME, ' %l:%i')
  ) AS REGISTER_DATETIME, A.IS_PUBLIC,
  0 AS LIKE_CNT, 'N' AS IS_LIKE, 0 AS COM_CNT
FROM SCHEDULE AS A
INNER JOIN USER_INFO AS B
  ON A.SCH_EMAIL = B.EMAIL
WHERE SCH_EMAIL = ?
ORDER BY SCH_EMAIL, SCH_SEQ DESC
LIMIT ?, 10
`, [requestEmail, requestEmail, requestEmail, Number(requestRow)]);
                return res.json({ isSuccess: true, message: "", feedList: feedList });
            }
            catch (error) {
                return res.json({ isSuccess: false, message: "서버와의 연결이 불안정합니다." });
            }
        }))();
    }
    getFeedListForDay(req, res) {
        let requestEmail = req.query.email;
        if (!requestEmail)
            return res.json({ isSuccess: false, message: "이메일을 입력해주세요." });
        requestEmail = requestEmail.replace(/(\s*)/g, '');
        let requestRow = req.query.row;
        if (!requestRow || isNaN(requestRow) || requestRow < 0)
            return res.json({
                isSuccess: false,
                message: "조회 번호가 잘못되었습니다."
            });
        let requestScheduleDate = req.query.scheduleDate;
        if (!requestScheduleDate)
            return res.json({ isSuccess: false, message: "조회 일자를 입력해주세요." });
        requestScheduleDate = requestScheduleDate.replace(/(\s*)/g, '');
        if (requestScheduleDate.length != 8)
            return res.json({ isSuccess: false, message: "조회 일자를 올바르게 입력해주세요." });
        mysql_pool_1.promiseMysqlModule.connect((connection) => __awaiter(this, void 0, void 0, function* () {
            try {
                const feedList = yield connection.query(`
SELECT A.SCH_EMAIL, A.SCH_SEQ, A.IMG_URL,
  B.NICKNM, A.TITLE, A.CONTENT,
  DATE_FORMAT(A.REGISTER_DATETIME, '%Y-%m-%d %p %l:%i') AS REGISTER_DATETIME, A.IS_PUBLIC,
  (SELECT COUNT(0) AS LIKE_CNT
    FROM LIKE_HISTORY AS LH
    WHERE LH.SCH_EMAIL = A.SCH_EMAIL
    AND LH.SCH_SEQ = A.SCH_SEQ) AS LIKE_CNT,
  (SELECT CASE COUNT(0) WHEN 0 THEN 'N' ELSE 'Y' END AS IS_LIKE
    FROM LIKE_HISTORY AS LH
    WHERE LH.SCH_EMAIL = A.SCH_EMAIL
    AND LH.SCH_SEQ = A.SCH_SEQ
    AND LH.MY_EMAIL = ?) AS IS_LIKE,
  (SELECT COUNT(0) AS COM_CNT
    FROM COMMENT_HISTORY AS CH
    WHERE CH.SCH_EMAIL = A.SCH_EMAIL
    AND CH.SCH_SEQ = A.SCH_SEQ) AS COM_CNT
FROM SCHEDULE AS A
INNER JOIN USER_INFO AS B
  ON A.SCH_EMAIL = B.EMAIL
  AND B.DELETE_YN = 'N'
INNER JOIN LIKE_HISTORY AS C
      ON C.MY_EMAIL = ?
         AND A.SCH_EMAIL = C.SCH_EMAIL
         AND A.SCH_SEQ = C.SCH_SEQ
WHERE EXISTS (
  SELECT UC.CTGR
  FROM USER_CATEGORY AS UC
  WHERE UC.EMAIL = ?
  AND A.CTGR = UC.CTGR
)
AND A.START_DATE <= ?
AND A.END_DATE >= ?
AND A.IS_PUBLIC = 'Y'

UNION ALL

SELECT A.SCH_EMAIL, A.SCH_SEQ, A.IMG_URL,
  CONCAT(B.NICKNM, ' (나)') AS NICKNM, A.TITLE, A.CONTENT,
  DATE_FORMAT(A.REGISTER_DATETIME, '%Y-%m-%d %p %l:%i') AS REGISTER_DATETIME, A.IS_PUBLIC,
  0 AS LIKE_CNT, 'N' AS IS_LIKE, 0 AS COM_CNT
FROM SCHEDULE AS A
INNER JOIN USER_INFO AS B
  ON A.SCH_EMAIL = B.EMAIL
WHERE A.SCH_EMAIL = ?
AND A.START_DATE <= ?
AND A.END_DATE >= ?
ORDER BY SCH_EMAIL, SCH_SEQ DESC
LIMIT ?, 10
`, [requestEmail, requestEmail, requestEmail, requestScheduleDate, requestScheduleDate,
                    requestEmail, requestScheduleDate, requestScheduleDate,
                    Number(requestRow)]);
                return res.json({ isSuccess: true, message: "", feedList: feedList });
            }
            catch (error) {
                return res.json({ isSuccess: false, message: "서버와의 연결이 불안정합니다." });
            }
        }))();
    }
}
exports.MainController = MainController;
//# sourceMappingURL=mainController.js.map