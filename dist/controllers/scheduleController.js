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
class ScheduleController {
    createSchedule(req, res) {
        let requestEmail = req.query.email, requestStartDate = req.query.startDate, requestEndDate = req.query.endDate, requestTitle = req.query.schedule_title, requestContent = req.query.schedule_content, requestImgUrl = req.query.img_url, requestLocation = req.query.schedule_location, requestUrl1 = req.query.url1, requestUrl2 = req.query.url2, requestUrl3 = req.query.url3, requestCategory = req.query.category, requestEtc = req.query.etc, requestIsPublic = req.query.is_public;
        if (!requestEmail)
            return res.json({ isSuccess: false, message: "이메일을 입력해주세요." });
        if (!requestStartDate)
            return res.json({ isSuccess: false, message: "시작 날짜를 선택해주세요." });
        if (!requestEndDate)
            return res.json({ isSuccess: false, message: "종료 날짜를 선택해주세요." });
        if (!requestTitle)
            return res.json({ isSuccess: false, message: "제목을 입력해주세요." });
        if (!requestContent)
            return res.json({ isSuccess: false, message: "내용을 입력해주세요." });
        if (!requestLocation)
            return res.json({ isSuccess: false, message: "장소를 입력해주세요." });
        if (!requestCategory)
            return res.json({ isSuccess: false, message: "관심분야를 선택해주세요." });
        requestEmail = requestEmail.replace(/(\s*)/g, '');
        requestTitle = requestTitle.replace(/(\s*)/g, '');
        requestContent = requestContent.replace(/(\s*)/g, '');
        requestLocation = requestLocation.replace(/(\s*)/g, '');
        if (requestCategory instanceof Array) {
            for (let i = 0; i < requestCategory.length; i++) {
                let categoryCode = "";
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
            }
        }
        else {
            return res.json({
                isSuccess: false,
                message: "선택한 관심분야 값이 올바르지 않습니다."
            });
        }
        //const get = promiseMysqlModule.connect((con: any, id: string) => con.query('select * from user', [id]));
        mysql_pool_1.promiseMysqlModule.connect((connection) => __awaiter(this, void 0, void 0, function* () {
            try {
                const addSequence = yield connection.query(`
SELECT MAX(SCH_SEQ) + 1
FROM SCHEDULE
WHERE SCH_EMAIL = ?`, [requestEmail]);
                yield connection.query(`
INSERT SCHEDULE (SCH_EMAIL, SCH_SEQ, START_DATE, END_DATE, TITLE, CONTENT, IMG_URL, LOCATION, URL_1, URL_2, URL_3, CTGR, ETC, IS_PUBLIC)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)`, [requestEmail, addSequence, requestStartDate, requestEndDate, requestTitle, requestContent,
                    requestImgUrl, requestLocation, requestUrl1, requestUrl2, requestUrl3, requestCategory, requestEtc, requestIsPublic]);
                return res.json({ isSuccess: true, message: "" });
            }
            catch (error) {
                return res.json({ isSuccess: false, message: "서버와의 연결이 불안정합니다." });
            }
        }))();
    }
    modifySchedule(req, res) {
        let requestSequence = req.query.sequence, requestEmail = req.query.email, requestStartDate = req.query.startDate, requestEndDate = req.query.endDate, requestTitle = req.query.schedule_title, requestContent = req.query.schedule_content, requestImgUrl = req.query.img_url, requestLocation = req.query.schedule_location, requestUrl1 = req.query.url1, requestUrl2 = req.query.url2, requestUrl3 = req.query.url3, requestCategory = req.query.category, requestEtc = req.query.etc, requestIsPublic = req.query.is_public;
        if (!requestSequence)
            return res.json({ isSuccess: false, message: "잘못된 일정입니다." });
        if (!requestEmail)
            return res.json({ isSuccess: false, message: "이메일을 입력해주세요." });
        if (!requestStartDate)
            return res.json({ isSuccess: false, message: "시작 날짜를 선택해주세요." });
        if (!requestEndDate)
            return res.json({ isSuccess: false, message: "종료 날짜를 선택해주세요." });
        if (!requestTitle)
            return res.json({ isSuccess: false, message: "제목을 입력해주세요." });
        if (!requestContent)
            return res.json({ isSuccess: false, message: "내용을 입력해주세요." });
        if (!requestLocation)
            return res.json({ isSuccess: false, message: "장소를 입력해주세요." });
        if (!requestCategory)
            return res.json({ isSuccess: false, message: "관심분야를 선택해주세요." });
        requestSequence = requestSequence.replace(/(\s*)/g, '');
        requestEmail = requestEmail.replace(/(\s*)/g, '');
        requestTitle = requestTitle.replace(/(\s*)/g, '');
        requestContent = requestContent.replace(/(\s*)/g, '');
        requestLocation = requestLocation.replace(/(\s*)/g, '');
        if (requestCategory instanceof Array) {
            for (let i = 0; i < requestCategory.length; i++) {
                let categoryCode = "";
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
            }
        }
        else {
            return res.json({
                isSuccess: false,
                message: "선택한 관심분야 값이 올바르지 않습니다."
            });
        }
        mysql_pool_1.promiseMysqlModule.connect((connection) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield connection.query(`
SELECT SCH_SEQ
FROM SCHEDULE
WHERE SCH_EMAIL = ?`, [requestEmail]);
                yield connection.query(`
UPDATE SCHEDULE
SET START_DATE = ?, END_DATE = ?, TITLE = ?, CONTENT = ?, IMG_URL = ?, LOCATION = ?, URL_1 = ?, URL_2 = ?, URL_3 = ?, CTGR = ?, ETC = ?, IS_PUBLIC = ?
WHERE SCH_EMAIL = ? AND SCH_SEQ = ?`, [requestStartDate, requestEndDate, requestTitle, requestContent, requestImgUrl, requestLocation,
                    requestUrl1, requestUrl2, requestUrl3, requestCategory, requestEtc, requestIsPublic, requestEmail, requestSequence]);
                return res.json({ isSuccess: true, message: "" });
            }
            catch (error) {
                return res.json({ isSuccess: false, message: "서버와의 연결이 불안정합니다." });
            }
        }))();
    }
}
exports.ScheduleController = ScheduleController;
//# sourceMappingURL=scheduleController.js.map