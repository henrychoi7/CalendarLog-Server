import { pool } from '../config/mysql.pool';
import { Request, Response } from 'express';

export class UserController {
    public getLogin (req: Request, res: Response) {
        console.log("Success")
    }
}