import {pool, promiseMysqlModule} from '../config/mysql.pool';
import {Request, Response} from 'express';

export class ScheduleController {
    createSchedule(req: Request, res: Response) {
        let requestEmail = req.query.email,
            requestStartDate = req.query.start_date,
            requestEndDate = req.query.end_date,
            requestTitle = req.query.schedule_title,
            requestContent = req.query.schedule_content,
            requestImgUrl = req.query.img_url,
            requestLocation = req.query.schedule_location,
            requestUrl1 = req.query.url1,
            requestUrl2 = req.query.url2,
            requestUrl3 = req.query.url3,
            requestCategory = req.query.category,
            requestEtc = req.query.etc,
            requestIsPublic = req.query.is_public;

        if (!requestEmail) return res.json({isSuccess: false, message: "이메일을 입력해주세요."});
        if (!requestStartDate) return res.json({isSuccess: false, message: "시작 날짜를 선택해주세요."});
        if (!requestEndDate) return res.json({isSuccess: false, message: "종료 날짜를 선택해주세요."});
        if (!requestTitle) return res.json({isSuccess: false, message: "제목을 입력해주세요."});
        if (!requestContent) return res.json({isSuccess: false, message: "내용을 입력해주세요."});
        if (!requestLocation) return res.json({isSuccess: false, message: "장소를 입력해주세요."});
        if (!requestCategory) return res.json({isSuccess: false, message: "관심분야를 선택해주세요."});

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
        } else {
            return res.json({
                isSuccess: false,
                message: "선택한 관심분야 값이 올바르지 않습니다."
            });
        }

        let executeSQL, executeSQL2 = "";

        // 트랜잭션에서 다중쿼리 async/await 하는 부분을 잘 모르겠음
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                return res.json({isSuccess: false, message: "서버와의 연결이 원활하지 않습니다."});
            }
            connection.query({
                    sql: "SELECT MAX(SCH_SEQ) + 1 AS addSequence \n" +
                         "FROM SCHEDULE \n" +
                         "WHERE SCH_EMAIL = ?",
                    timeout: 10000
                },
                [requestEmail],
                function (error_1, results_1) {
                    if (error_1) {
                        connection.release();
                        return res.json({isSuccess: false, message: "스케줄 등록(이메일 중복 검사)에 실패하였습니다.\n값을 확인해주세요."});
                    }

                    executeSQL += "CALL datelist('" + requestStartDate + "', '" + requestEndDate + "', '" + results_1[0].addSequence + "', '" + requestEmail + "');";

                    executeSQL2 += "INSERT INTO SCHEDULE (SCH_EMAIL, SCH_SEQ, START_DATE, END_DATE, TITLE, CONTENT, IMG_URL, LOCATION, URL_1, URL_2, URL_3, CTGR, ETC, IS_PUBLIC) \
                                   VALUES ('" + requestEmail + "', '" + results_1[0].addSequence + "', '" + requestStartDate + "', '" + requestEndDate + "', '" +
                                    requestTitle + "', '" + requestContent + "', '" + requestImgUrl + "', '" + requestLocation + "', '" + requestUrl1 + "', '" +
                                    requestUrl2 + "', '" + requestUrl3 + requestCategory + "', '" + requestEtc + "', '" + requestIsPublic + "');";

                    connection.beginTransaction(function (err) {
                        if (err) {
                            connection.release();
                            return res.json({isSuccess: false, message: "스케줄 등록에 실패하였습니다.\n값을 확인해주세요."});
                        }

                        connection.query(executeSQL, function (error_2) {
                            if (error_2) {
                                return connection.rollback(function () {
                                    connection.release();
                                    res.json({isSuccess: false, message: "스케줄 등록에 실패하였습니다.\n값을 확인해주세요."});
                                });
                            }

                            connection.query(executeSQL2, function (error_2) {
                                if (error_2) {
                                    return connection.rollback(function () {
                                        connection.release();
                                        res.json({isSuccess: false, message: "스케줄 등록에 실패하였습니다.\n값을 확인해주세요."});
                                    });
                                }

                                connection.commit(function (error_3) {
                                    if (error_3) {
                                        return connection.rollback(function () {
                                            connection.release();
                                            res.json({isSuccess: false, message: "스케줄 등록에 실패하였습니다.\n값을 확인해주세요."});
                                        });
                                    }

                                    connection.release();
                                    res.json({isSuccess: true, message: "스케줄 등록이 성공적으로 이루어졌습니다!"});
                                });
                            });
                        });
                    });
                });
        });

    }

    modifySchedule(req: Request, res: Response) {
        let requestSequence = req.query.sequence,
            requestEmail = req.query.email,
            requestStartDate = req.query.start_date,
            requestEndDate = req.query.end_date,
            requestTitle = req.query.schedule_title,
            requestContent = req.query.schedule_content,
            requestImgUrl = req.query.img_url,
            requestLocation = req.query.schedule_location,
            requestUrl1 = req.query.url1,
            requestUrl2 = req.query.url2,
            requestUrl3 = req.query.url3,
            requestCategory = req.query.category,
            requestEtc = req.query.etc,
            requestIsPublic = req.query.is_public;


        if (!requestSequence) return res.json({isSuccess: false, message: "잘못된 일정입니다."});
        if (!requestEmail) return res.json({isSuccess: false, message: "이메일을 입력해주세요."});
        if (!requestStartDate) return res.json({isSuccess: false, message: "시작 날짜를 선택해주세요."});
        if (!requestEndDate) return res.json({isSuccess: false, message: "종료 날짜를 선택해주세요."});
        if (!requestTitle) return res.json({isSuccess: false, message: "제목을 입력해주세요."});
        if (!requestContent) return res.json({isSuccess: false, message: "내용을 입력해주세요."});
        if (!requestLocation) return res.json({isSuccess: false, message: "장소를 입력해주세요."});
        if (!requestCategory) return res.json({isSuccess: false, message: "관심분야를 선택해주세요."});

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
        } else {
            return res.json({
                isSuccess: false,
                message: "선택한 관심분야 값이 올바르지 않습니다."
            });
        }

        promiseMysqlModule.connect(async (connection: any) => {
            try {
                await connection.query(`
SELECT SCH_SEQ
FROM SCHEDULE
WHERE SCH_EMAIL = ?`, [requestEmail]);
                await connection.query(`
UPDATE SCHEDULE
SET START_DATE = ?, END_DATE = ?, TITLE = ?, CONTENT = ?, IMG_URL = ?, LOCATION = ?, URL_1 = ?, URL_2 = ?, URL_3 = ?, CTGR = ?, ETC = ?, IS_PUBLIC = ?
WHERE SCH_EMAIL = ? AND SCH_SEQ = ?`, [requestStartDate, requestEndDate, requestTitle, requestContent, requestImgUrl, requestLocation,
                    requestUrl1, requestUrl2, requestUrl3, requestCategory, requestEtc, requestIsPublic, requestEmail, requestSequence]);
                return res.json({isSuccess: true, message: ""});
            } catch (error) {
                return res.json({isSuccess: false, message: "서버와의 연결이 불안정합니다."});
            }
        })();

    }
}