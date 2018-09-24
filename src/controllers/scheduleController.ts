import {pool} from '../config/mysql.pool';
import {Request, Response} from 'express';
import {isBoolean} from "util";

export class ScheduleController {
    createSchedule(req: Request, res: Response) {
        let requestEmail = req.body.email,
            requestStartDate = req.body.start_date,
            requestEndDate = req.body.end_date,
            requestStartDatetime = req.body.start_datetime,
            requestEndDatetime = req.body.end_datetime,
            requestTitle = req.body.title,
            requestContent = req.body.content,
            requestImgUrl = req.body.img_url,
            requestLocation = req.body.location,
            requestUrl1 = req.body.url1,
            requestUrl2 = req.body.url2,
            requestUrl3 = req.body.url3,
            requestCategory = req.body.category,
            requestEtc = req.body.etc,
            requestIsPublic = req.body.is_public;

        if (!requestEmail) return res.json({isSuccess: false, message: "이메일을 입력해주세요."});
        if (!requestStartDate) return res.json({isSuccess: false, message: "시작 날짜를 선택해주세요."});
        if (!requestEndDate) return res.json({isSuccess: false, message: "종료 날짜를 선택해주세요."});
        if (!requestStartDatetime) return res.json({isSuccess: false, message: "시작 세부날짜를 선택해주세요."});
        if (!requestEndDatetime) return res.json({isSuccess: false, message: "종료 세부날짜를 선택해주세요."});
        if (!requestTitle) return res.json({isSuccess: false, message: "제목을 입력해주세요."});
        if (!requestContent) return res.json({isSuccess: false, message: "내용을 입력해주세요."});
        if (!requestLocation) return res.json({isSuccess: false, message: "장소를 입력해주세요."});
        if (!requestCategory && requestCategory !== 0) return res.json({isSuccess: false, message: "관심분야를 선택해주세요."});

        requestEmail = requestEmail.replace(/(\s*)/g, '');
        requestTitle = requestTitle.replace(/(\s*)/g, '');
        requestContent = requestContent.replace(/(\s*)/g, '');
        requestLocation = requestLocation.replace(/(\s*)/g, '');

        if (isBoolean(requestIsPublic) == false)
            return res.json({isSuccess: false, message: "스케줄 공개 여부 값을 올바르게 입력해주세요."});

        switch (requestCategory) {
            case 0:
                requestCategory = "001";
                break;
            case 1:
                requestCategory = "002";
                break;
            case 2:
                requestCategory = "003";
                break;
            case 3:
                requestCategory = "004";
                break;
            case 4:
                requestCategory = "005";
                break;
            case 5:
                requestCategory = "006";
                break;
            default:
                return res.json({
                    isSuccess: false,
                    message: "선택한 관심분야 값이 올바르지 않습니다."
                });
        }

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
                        return res.json({isSuccess: false, message: "스케줄 등록(0)에 실패하였습니다.\n값을 확인해주세요."});
                    }

                    let executeSQL = "CALL datelist('" + requestEmail + "', " + results_1[0].addSequence + ", '" + requestStartDate + "', '" + requestEndDate + "');";

                    executeSQL += "INSERT INTO SCHEDULE (SCH_EMAIL, SCH_SEQ, START_DATE, END_DATE, START_DATETIME, END_DATETIME, TITLE, CONTENT, LOCATION, CTGR, IS_PUBLIC";

                    let columnSQL = "";
                    let parameterSQL = "";
                    if (requestImgUrl) {
                        columnSQL += ", IMG_URL";
                        parameterSQL += ", '" + requestImgUrl + "'";
                    }

                    if (requestUrl1) {
                        columnSQL += ", URL_1";
                        parameterSQL += ", '" + requestUrl1 + "'";
                    }

                    if (requestUrl2) {
                        columnSQL += ", URL_2";
                        parameterSQL += ", '" + requestUrl2 + "'";
                    }

                    if (requestUrl3) {
                        columnSQL += ", URL_3";
                        parameterSQL += ", '" + requestUrl3 + "'";
                    }

                    if (requestEtc) {
                        columnSQL += ", ETC";
                        parameterSQL += ", '" + requestEtc + "'";
                    }

                    executeSQL += columnSQL + ") ";
                    executeSQL += "VALUES ('" + requestEmail + "', " + results_1[0].addSequence + ", '" + requestStartDate + "', '" + requestEndDate + "', '" + requestStartDatetime + "', '" + requestEndDatetime + "', '" +
                        requestTitle + "', '" + requestContent + "', '" + requestLocation + "', '" + requestCategory + "', '" + (requestIsPublic == true ? "Y" : "N") + "'";
                    executeSQL += parameterSQL + ");";

                    connection.beginTransaction(function (err) {
                        if (err) {
                            connection.release();
                            return res.json({isSuccess: false, message: "스케줄 등록(1)에 실패하였습니다.\n값을 확인해주세요."});
                        }

                        connection.query(executeSQL, function (error_2) {
                            if (error_2) {
                                return connection.rollback(function () {
                                    connection.release();
                                    res.json({isSuccess: false, message: "스케줄 등록(2)에 실패하였습니다.\n값을 확인해주세요."});
                                });
                            }

                            connection.commit(function (error_3) {
                                if (error_3) {
                                    return connection.rollback(function () {
                                        connection.release();
                                        res.json({isSuccess: false, message: "스케줄 등록(3)에 실패하였습니다.\n값을 확인해주세요."});
                                    });
                                }

                                connection.release();
                                res.json({isSuccess: true, message: ""});
                            });
                        });
                    });
                });
        });
    }

    updateSchedule(req: Request, res: Response) {
        let requestSequence = req.body.sequence,
            requestEmail = req.body.email,
            requestStartDate = req.body.start_date,
            requestEndDate = req.body.end_date,
            requestStartDatetime = req.body.start_datetime,
            requestEndDatetime = req.body.end_datetime,
            requestTitle = req.body.title,
            requestContent = req.body.content,
            requestImgUrl = req.body.img_url,
            requestLocation = req.body.location,
            requestUrl1 = req.body.url1,
            requestUrl2 = req.body.url2,
            requestUrl3 = req.body.url3,
            requestCategory = req.body.category,
            requestEtc = req.body.etc,
            requestIsPublic = req.body.is_public;

        if (!requestSequence) return res.json({isSuccess: false, message: "잘못된 일정입니다."});
        if (!requestEmail) return res.json({isSuccess: false, message: "이메일을 입력해주세요."});
        if (!requestStartDate) return res.json({isSuccess: false, message: "시작 날짜를 선택해주세요."});
        if (!requestEndDate) return res.json({isSuccess: false, message: "종료 날짜를 선택해주세요."});
        if (!requestStartDatetime) return res.json({isSuccess: false, message: "시작 세부날짜를 선택해주세요."});
        if (!requestEndDatetime) return res.json({isSuccess: false, message: "종료 세부날짜를 선택해주세요."});
        if (!requestTitle) return res.json({isSuccess: false, message: "제목을 입력해주세요."});
        if (!requestContent) return res.json({isSuccess: false, message: "내용을 입력해주세요."});
        if (!requestLocation) return res.json({isSuccess: false, message: "장소를 입력해주세요."});
        if (!requestCategory && requestCategory !== 0) return res.json({isSuccess: false, message: "관심분야를 선택해주세요."});

        requestEmail = requestEmail.replace(/(\s*)/g, '');
        requestTitle = requestTitle.replace(/(\s*)/g, '');
        requestContent = requestContent.replace(/(\s*)/g, '');
        requestLocation = requestLocation.replace(/(\s*)/g, '');

        if (isBoolean(requestIsPublic) == false)
            return res.json({isSuccess: false, message: "스케줄 공개 여부 값을 올바르게 입력해주세요."});

        switch (requestCategory) {
            case 0:
                requestCategory = "001";
                break;
            case 1:
                requestCategory = "002";
                break;
            case 2:
                requestCategory = "003";
                break;
            case 3:
                requestCategory = "004";
                break;
            case 4:
                requestCategory = "005";
                break;
            case 5:
                requestCategory = "006";
                break;
            default:
                return res.json({
                    isSuccess: false,
                    message: "선택한 관심분야 값이 올바르지 않습니다."
                });
        }

        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                return res.json({isSuccess: false, message: "서버와의 연결이 원활하지 않습니다."});
            }
            connection.query({
                    sql: "SELECT COUNT(1) AS CNT \n" +
                        "FROM SCHEDULE \n" +
                        "WHERE SCH_EMAIL = ? \n" +
                        "AND SCH_SEQ = ?",
                    timeout: 10000
                },
                [requestEmail, requestSequence],
                function (error_1, results_1) {
                    if (error_1) {
                        connection.release();
                        return res.json({isSuccess: false, message: "스케줄 수정(0)에 실패하였습니다.\n값을 확인해주세요."});
                    }

                    if (results_1[0].CNT === 0) {
                        return res.json({isSuccess: false, message: "존재하지 않는 스케줄입니다."});
                    }

                    let executeSQL = "DELETE FROM CALENDAR WHERE SCH_EMAIL = '" + requestEmail + "' AND SCH_SEQ = " + requestSequence + ";";
                    executeSQL += "DELETE FROM SCHEDULE WHERE SCH_EMAIL = '" + requestEmail + "' AND SCH_SEQ = " + requestSequence + ";";
                    executeSQL += "CALL datelist('" + requestEmail + "', " + requestSequence + ", '" + requestStartDate + "', '" + requestEndDate + "');";
                    executeSQL += "INSERT INTO SCHEDULE (SCH_EMAIL, SCH_SEQ, START_DATE, END_DATE, START_DATETIME, END_DATETIME, TITLE, CONTENT, LOCATION, CTGR, IS_PUBLIC";

                    let columnSQL = "";
                    let parameterSQL = "";
                    if (requestImgUrl) {
                        columnSQL += ", IMG_URL";
                        parameterSQL += ", '" + requestImgUrl + "'";
                    }

                    if (requestUrl1) {
                        columnSQL += ", URL_1";
                        parameterSQL += ", '" + requestUrl1 + "'";
                    }

                    if (requestUrl2) {
                        columnSQL += ", URL_2";
                        parameterSQL += ", '" + requestUrl2 + "'";
                    }

                    if (requestUrl3) {
                        columnSQL += ", URL_3";
                        parameterSQL += ", '" + requestUrl3 + "'";
                    }

                    if (requestEtc) {
                        columnSQL += ", ETC";
                        parameterSQL += ", '" + requestEtc + "'";
                    }

                    executeSQL += columnSQL + ") ";
                    executeSQL += "VALUES ('" + requestEmail + "', " + requestSequence + ", '" + requestStartDate + "', '" + requestEndDate +  ", '" + requestStartDatetime + "', '" + requestEndDatetime + "', '" +
                        requestTitle + "', '" + requestContent + "', '" + requestLocation + "', '" + requestCategory + "', '" + (requestIsPublic == true ? "Y" : "N") + "'";
                    executeSQL += parameterSQL + ");";

                    connection.beginTransaction(function (err) {
                        if (err) {
                            connection.release();
                            return res.json({isSuccess: false, message: "스케줄 수정(1)에 실패하였습니다.\n값을 확인해주세요."});
                        }

                        connection.query(executeSQL, function (error_2) {
                            if (error_2) {
                                return connection.rollback(function () {
                                    connection.release();
                                    res.json({isSuccess: false, message: "스케줄 수정(2)에 실패하였습니다.\n값을 확인해주세요."});
                                });
                            }

                            connection.commit(function (error_3) {
                                if (error_3) {
                                    return connection.rollback(function () {
                                        connection.release();
                                        res.json({isSuccess: false, message: "스케줄 수정(3)에 실패하였습니다.\n값을 확인해주세요."});
                                    });
                                }

                                connection.release();
                                res.json({isSuccess: true, message: ""});
                            });
                        });
                    });
                });
        });
    }
}