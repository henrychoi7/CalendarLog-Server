import {pool, promiseMysqlModule} from '../config/mysql.pool';
import {Request, Response} from 'express';
import * as regexEmail from "regex-email";
import * as bcrypt from "bcrypt";
import {isBoolean} from "util";

let saltRounds = 10;

export class UserController {
    getLogin(req: Request, res: Response) {
        let requestEmail = req.query.email;
        if (!requestEmail) return res.json({isSuccess: false, message: "이메일을 입력해주세요."});

        requestEmail = requestEmail.replace(/(\s*)/g, '');

        promiseMysqlModule.connect(async (connection: any) => {
            try {
                const getLogin = await connection.query(`
SELECT DELETE_YN 
FROM USER_INFO 
WHERE EMAIL = ?`, [requestEmail]);
                if (!getLogin.length) {
                    return res.json({isSuccess: false, message: ""});
                }

                if (getLogin[0].DELETE_YN === 'Y') {
                    return res.json({isSuccess: false, message: "계정을 탈퇴한 이메일입니다."});
                }
                res.json({isSuccess: true, message: ""});
            } catch (error) {
                return res.json({isSuccess: false, message: "서버와의 연결이 불안정합니다."});
            }
        })();
    }

    postLogin(req: Request, res: Response) {
        let requestEmail = req.body.email,
            requestPassword = req.body.password;

        if (!requestEmail) return res.json({isSuccess: false, message: "이메일을 입력해주세요."});
        if (!requestPassword) return res.json({isSuccess: false, message: "비밀번호를 입력해주세요."});

        requestEmail = requestEmail.replace(/(\s*)/g, "");
        requestPassword = requestPassword.replace(/(\s*)/g, "");

        promiseMysqlModule.connect(async (connection: any) => {
            try {
                const postLogin = await connection.query(`
SELECT PSWD, DELETE_YN
FROM USER_INFO
WHERE EMAIL = ?`, [requestEmail]);
                if (!postLogin.length) {
                    return res.json({isSuccess: false, message: "이메일이 올바르지 않습니다."});
                }

                if (postLogin[0].DELETE_YN === 'Y') {
                    return res.json({isSuccess: false, message: "계정을 탈퇴한 이메일입니다."});
                }

                bcrypt.compare(requestPassword, postLogin[0].PSWD, function (error_2, isMatched) {
                    if (error_2) {
                        return res.json({isSuccess: false, message: "로그인(비밀번호 매칭)에 실패하였습니다.\n값을 확인해주세요."});
                    }
                    if (isMatched === true) {
                        res.json({isSuccess: true, message: ""});
                    } else {
                        res.json({isSuccess: false, message: "비밀번호가 일치하지 않습니다."});
                    }
                });
            } catch (error) {
                return res.json({isSuccess: false, message: "로그인에 실패하였습니다.\n값을 확인해주세요."});
            }
        })();
    }

    postRegister(req: Request, res: Response) {

        let requestEmail = req.body.email,
            requestPassword = req.body.password,
            requestPasswordConfirmation = req.body.password_confirmation,
            requestNickname = req.body.nickname,
            requestSex = req.body.sex,
            requestCategory = req.body.category,
            requestAssociate = req.body.associate;

        if (!requestEmail) return res.json({isSuccess: false, message: "이메일을 입력해주세요."});
        if (!requestPassword) return res.json({isSuccess: false, message: "비밀번호를 입력해주세요."});
        if (!requestPasswordConfirmation) return res.json({isSuccess: false, message: "비밀번호 확인 값을 입력해주세요."});
        if (!requestNickname) return res.json({isSuccess: false, message: "닉네임을 입력해주세요."});
        if (!requestSex) return res.json({isSuccess: false, message: "성별을 선택해주세요."});
        if (!requestCategory) return res.json({isSuccess: false, message: "관심분야를 선택해주세요."});
        if (!requestAssociate) return res.json({isSuccess: false, message: "단체 / 기관을 입력해주세요."});

        requestEmail = requestEmail.replace(/(\s*)/g, "");
        requestPassword = requestPassword.replace(/(\s*)/g, "");
        requestPasswordConfirmation = requestPasswordConfirmation.replace(/(\s*)/g, "");
        requestNickname = requestNickname.replace(/(\s*)/g, "");
        requestAssociate = requestAssociate.replace(/(\s*)/g, "");


        if (requestEmail.length > 30) return res.json({
            isSuccess: false,
            message: "이메일은 30자리 미만으로 입력해주세요."
        });
        if (requestPassword.length < 6 || requestPassword.length > 20) return res.json({
            isSuccess: false,
            message: "비밀번호는 6~20자리를 입력해주세요."
        });
        if (requestPasswordConfirmation.length < 6 || requestPasswordConfirmation.length > 20) return res.json({
            isSuccess: false,
            message: "비밀번호 확인 값은 6~20자리를 입력해주세요."
        });
        if (requestPassword !== requestPasswordConfirmation) return res.json({
            isSuccess: false,
            message: "비밀번호가 일치하지 않습니다."
        });
        if (requestNickname.length < 2 || requestNickname.length > 25) return res.json({
            isSuccess: false,
            message: "닉네임은 2~25자리를 입력해주세요."
        });
        if (requestSex !== 'M' && requestSex !== 'F') return res.json({
            isSuccess: false,
            message: "성별을 선택해주세요."
        });
        if (requestCategory.length < 3 || requestCategory.arr) return res.json({
            isSuccess: false,
            message: "관심분야를 3개 이상 선택해주세요."
        });

        let executeSQL = "";
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

                executeSQL += "INSERT INTO USER_CATEGORY (EMAIL, CTGR) \
                            VALUES ('" + requestEmail + "', '" + categoryCode + "');";
            }
        } else {
            return res.json({
                isSuccess: false,
                message: "선택한 관심분야 값이 올바르지 않습니다."
            });
        }

        if (requestAssociate.length === 0 || requestAssociate.length > 30) return res.json({
            isSuccess: false,
            message: "단체 / 기관을 입력해주세요."
        });

        if (!regexEmail.test(requestEmail)) return res.json({isSuccess: false, message: "이메일을 정확하게 입력해주세요."});

        // 트랜잭션에서 다중쿼리 async/await 하는 부분을 잘 모르겠음
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                return res.json({isSuccess: false, message: "서버와의 연결이 원활하지않습니다."});
            }
            connection.query({
                    sql: 'SELECT COUNT(1) AS CNT \
                  FROM USER_INFO \
                  WHERE EMAIL = ?',
                    timeout: 10000
                },
                [requestEmail],
                function (error_1, results_1, columns_1) {
                    if (error_1) {
                        connection.release();
                        return res.json({isSuccess: false, message: "회원가입(이메일 중복 검사)에 실패하였습니다.\n값을 확인해주세요."});
                    }

                    if (results_1[0].CNT !== 0) {
                        connection.release();
                        return res.json({isSuccess: false, message: "중복되는 아이디입니다."});
                    }

                    bcrypt.hash(requestPassword, saltRounds, function (error_2, hash) {
                        if (error_2) {
                            connection.release();
                            return res.json({isSuccess: false, message: "회원가입(비밀번호 암호화)에 실패하였습니다.\n값을 확인해주세요."});
                        }

                        executeSQL += "INSERT INTO USER_INFO (EMAIL, PSWD, NICKNM, SEX, ASSOCIATE) \
                                        VALUES ('" + requestEmail + "', '" + hash + "', '" + requestNickname + "', '" + requestSex + "', '" + requestAssociate + "');";

                        connection.beginTransaction(function (err) {
                            if (err) {
                                connection.release();
                                return res.json({isSuccess: false, message: "회원가입(사용자 등록)에 실패하였습니다.\n값을 확인해주세요."});
                            }


                            connection.query(executeSQL, function (error_2, results_2, fields) {
                                if (error_2) {
                                    return connection.rollback(function () {
                                        connection.release();
                                        res.json({isSuccess: false, message: "회원가입(사용자 등록)에 실패하였습니다.\n값을 확인해주세요."});
                                    });
                                }

                                connection.commit(function (error_3) {
                                    if (error_3) {
                                        return connection.rollback(function () {
                                            connection.release();
                                            res.json({isSuccess: false, message: "회원가입(사용자 등록)에 실패하였습니다.\n값을 확인해주세요."});
                                        });
                                    }

                                    connection.release();
                                    res.json({isSuccess: true, message: "회원가입이 성공적으로 이루어졌습니다!"});
                                });
                            });
                        });

                    });
                });
        });
    }

    updateNoteStatus(req: Request, res: Response) {
        let requestEmail = req.body.email;
        const requestIsReceiveNote = req.body.isReceiveNote;

        if (!requestEmail) return res.json({isSuccess: false, message: "이메일을 입력해주세요."});
        if (isBoolean(requestIsReceiveNote) == false)
            return res.json({isSuccess: false, message: "쪽지 수신 여부 값을 올바르게 입력해주세요."});

        requestEmail = requestEmail.replace(/(\s*)/g, "");

        promiseMysqlModule.connect(async (connection: any) => {
            try {
                const userInfo = await connection.query(`
UPDATE USER_INFO
SET NOTE_YN = ?
WHERE EMAIL = ?`, [requestIsReceiveNote == true ? "Y" : "N", requestEmail]);
                if (userInfo.affectedRows === 0) {
                    res.json({isSuccess: false, message: "이메일이 올바르지 않습니다."});
                } else {
                    res.json({isSuccess: true, message: ""});
                }
            } catch (error) {
                return res.json({isSuccess: false, message: "쪽지 수신 여부를 변경하는데 실패하였습니다.\n다시 시도해주세요."});
            }
        })();
    }

    deleteUserInfo(req: Request, res: Response) {
        let requestEmail = req.body.email;

        if (!requestEmail) return res.json({isSuccess: false, message: "이메일을 입력해주세요."});

        requestEmail = requestEmail.replace(/(\s*)/g, "");

        promiseMysqlModule.connect(async (connection: any) => {
            try {
                const userInfo = await connection.query(`
UPDATE USER_INFO
SET DELETE_YN = 'Y'
WHERE EMAIL = ?`, [requestEmail]);
                if (userInfo.affectedRows === 0) {
                    res.json({isSuccess: false, message: "이메일이 올바르지 않습니다."});
                } else {
                    res.json({isSuccess: true, message: ""});
                }
            } catch (error) {
                return res.json({isSuccess: false, message: "회원탈퇴에 실패하였습니다.\n다시 시도해주세요."});
            }
        })();
    }

    getUserInfoForEdit(req: Request, res: Response) {
        let requestEmail = req.query.email;

        if (!requestEmail) return res.json({isSuccess: false, message: "이메일을 입력해주세요."});

        requestEmail = requestEmail.replace(/(\s*)/g, "");

        promiseMysqlModule.connect(async (connection: any) => {
            try {
                const userInfo = await connection.query(`
SELECT SEX, ASSOCIATE
FROM USER_INFO
WHERE EMAIL = ?`, [requestEmail]);

                const userCategoryIndexes = await connection.query(`
SELECT CAST(CTGR AS UNSIGNED) - 1 AS IDX
FROM USER_CATEGORY
WHERE EMAIL = ?`, [requestEmail]);

                let categories = [];

                for (let index of userCategoryIndexes) {
                    categories.push(index.IDX);
                }

                res.json({
                    isSuccess: true,
                    message: "이메일이 올바르지 않습니다.",
                    sex: userInfo[0].SEX,
                    categories: categories,
                    associate: userInfo[0].ASSOCIATE
                });
            } catch (error) {
                return res.json({isSuccess: false, message: "계정정보를 불러오는데 실패하였습니다.\n다시 시도해주세요."});
            }
        })();
    }
}