import { pool } from '../config/mysql.pool';
import { Request, Response } from 'express';

export class UserController {
    public getLogin (req: Request, res: Response) {
        console.log("get login")
    }

    public postLogin (req: Request, res: Response) {
        console.log("post login")
    }

    public postRegister(req: Request, res: Response) {
        console.log("post register")
    }
}