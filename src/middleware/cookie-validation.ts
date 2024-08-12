import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import envConfig from '../env-config';


const { secret_key } = envConfig;

let verifyToken=(req:Request, res:Response, next:NextFunction):any=>{

    let authCookie: string | undefined = req.cookies.authorizationToken;

    if(authCookie){

        const isTokenValid=()=>{

            return jwt.verify(authCookie as string, secret_key as string | Buffer, (err, decoded)=>{

                if(err){

                    return {
                        code:401,
                        message:err.message
                    }

                }else{
                    return {
                        code:200,
                        message:decoded
                    }
                }
            })
        }

        const tokenStatus: any = isTokenValid();

        if(tokenStatus.code==200){

            req.statusCode=tokenStatus.code;

            req.tokenInfo=tokenStatus.message
                            
            next();
        }else{

            req.statusCode=tokenStatus.code;

            next();
        }
    }else{

        req.statusCode=403;

        next();
    }
}
export default verifyToken;