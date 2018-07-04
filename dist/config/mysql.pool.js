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
const mysql = require("mysql");
exports.pool = mysql.createPool({
    //밑에 설정 조건들, 다 Default 라서 주석
    //connectionLimit: 10,
    //queueLimit: 0,
    //waitForConnections: true,
    //acquireTimeout: 10000
    host: '13.209.31.64',
    user: 'penguinEx',
    password: 'vpdrnls!',
    database: 'PENGUIN_EX',
    charset: 'utf8mb4',
    multipleStatements: true
    //2017.08.20
    //mysql connection pool 공홈 참고해봤는데 뭔가 이상하다.
    //local 이 default 라는데, Z값이나 +00:10 이런거하면 제대로안먹히고
    //아래와 같이 +0000 = +HHMM 해야 타임존이 yyyy-mm-dd hh:mm:ss 이렇게 나오는데 또 값이 플러스가 안됨
    //일단은 원하는형식으로 나오길래 아래와 같이 해놓음
    //timezone:+0001
});
/**
 * 기존 import 하는 방식이 아닌 이유는 promise-mysql은
 * 정의 파일(typings)이 없기 때문에 아래와 같이 쓴다.
 */
const promiseMysql = require('promise-mysql');
const promisePool = promiseMysql.createPool({
    //밑에 설정 조건들, 다 Default 라서 주석
    //connectionLimit: 10,
    //queueLimit: 0,
    //waitForConnections: true,
    //acquireTimeout: 10000
    host: '13.209.31.64',
    user: 'penguinEx',
    password: 'vpdrnls!',
    database: 'PENGUIN_EX',
    charset: 'utf8mb4',
    multipleStatements: true
    //2017.08.20
    //mysql connection pool 공홈 참고해봤는데 뭔가 이상하다.
    //local 이 default 라는데, Z값이나 +00:10 이런거하면 제대로안먹히고
    //아래와 같이 +0000 = +HHMM 해야 타임존이 yyyy-mm-dd hh:mm:ss 이렇게 나오는데 또 값이 플러스가 안됨
    //일단은 원하는형식으로 나오길래 아래와 같이 해놓음
    //timezone:+0001
});
var promiseMysqlModule;
(function (promiseMysqlModule) {
    promiseMysqlModule.connect = fn => (...args) => __awaiter(this, void 0, void 0, function* () {
        /* DB connection 을 한다. */
        const promiseConnection = yield promisePool.getConnection();
        /* 로직에 connection 과 args(넘겨받은 parameters)를 넘겨준다. */
        const result = yield fn(promiseConnection, ...args).catch(error => {
            /* 에러시 connection 을 닫아준다. */
            promiseConnection.connection.release();
            throw error;
        });
        /* connection 을 닫아준다. */
        promiseConnection.connection.release();
        return result;
    });
    promiseMysqlModule.transaction = fn => (...args) => __awaiter(this, void 0, void 0, function* () {
        /* DB connection 을 한다. */
        const promiseConnection = yield promisePool.getConnection();
        /* 트렌젝션 시작 */
        yield promiseConnection.connection.beginTransaction();
        /* 비지니스 로직에 connection 을 넘겨준다. */
        const result = yield fn(promiseConnection, ...args).catch((error) => __awaiter(this, void 0, void 0, function* () {
            /* rollback 을 진행한다. */
            yield promiseConnection.rollback();
            /* 에러시 connection 을 닫아준다. */
            promiseConnection.connection.release();
            throw error;
        }));
        /* commit 을 해준다. */
        yield promiseConnection.commit();
        /* connection 을 닫아준다. */
        promiseConnection.connection.release();
        return result;
    });
})(promiseMysqlModule = exports.promiseMysqlModule || (exports.promiseMysqlModule = {}));
//# sourceMappingURL=mysql.pool.js.map