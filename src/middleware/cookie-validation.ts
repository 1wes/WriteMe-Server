import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import envConfig from '../env-config';


const { secret_key } = envConfig;

let verifyToken=(req:Request, res:Response, next:NextFunction):any=>{

    let authCookie: string | undefined = req.cookies.authorizationToken;

    if (!authCookie) {
        return res.sendStatus(403);
    }

    try {
        
        const decoded = jwt.verify(authCookie as string, secret_key as string | Buffer);

        req.statusCode = 200;

        req.tokenInfo = decoded;

        next();

    } catch (err) {
        
        return res.sendStatus(401);
    }
}
export default verifyToken;