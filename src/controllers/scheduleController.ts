import {promiseMysqlModule} from '../config/mysql.pool';
import {Request, Response} from 'express';

export class ScheduleController {
    createSchedule(req: Request, res: Response) {
        let requestEmail = req.query.email,
            requestStartDate = req.query.startDate,
            requestEndDate = req.query.endDate,
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

        //const get = promiseMysqlModule.connect((con: any, id: string) => con.query('select * from user', [id]));

        promiseMysqlModule.connect(async (connection: any) => {
            try {
                const addSequence = await connection.query(`
SELECT MAX(SCH_SEQ) + 1
FROM SCHEDULE
WHERE SCH_EMAIL = ?`, [requestEmail]);
                await connection.query(`
INSERT SCHEDULE (SCH_EMAIL, SCH_SEQ, START_DATE, END_DATE, TITLE, CONTENT, IMG_URL, LOCATION, URL_1, URL_2, URL_3, CTGR, ETC, IS_PUBLIC)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)`, [requestEmail, addSequence, requestStartDate, requestEndDate, requestTitle, requestContent,
                requestImgUrl, requestLocation, requestUrl1, requestUrl2, requestUrl3, requestCategory, requestEtc, requestIsPublic]);
                return res.json({isSuccess: true, message: ""});
            } catch (error) {
                return res.json({isSuccess: false, message: "서버와의 연결이 불안정합니다."});
            }
        })();

    }

    modifySchedule(req: Request, res: Response) {
        let requestEmail = req.query.email;
        if (!requestEmail) return res.json({isSuccess: false, message: "이메일을 입력해주세요."});
        requestEmail = requestEmail.replace(/(\s*)/g, '');

        promiseMysqlModule.connect(async (connection: any) => {
            try {
                const modifySchedule = await connection.query('SELECT SCH_DATE, COUNT(0) AS SCH_CNT \
                    FROM ( \
                      SELECT SCH_DATE \
                      FROM CALENDAR \
                      WHERE SCH_EMAIL = ? \
                    \
                      UNION ALL \
                    \
                      INSERT INTO SCHEDULE \
                      SELECT A.SCH_DATE \
                      FROM CALENDAR AS A \
                        INNER JOIN LIKE_HISTORY AS B \
                          ON B.MY_EMAIL = ? \
                             AND A.SCH_EMAIL = B.SCH_EMAIL \
                             AND A.SCH_SEQ = B.SCH_SEQ \
                    ) TOT \
                    GROUP BY SCH_DATE \
                    ORDER BY SCH_DATE ASC', [requestEmail, requestEmail]);
                return res.json({isSuccess: true, message: ""});
            } catch (error) {
                return res.json({isSuccess: false, message: "서버와의 연결이 불안정합니다."});
            }
        })();

    }
}