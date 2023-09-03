const jwt=require('jsonwebtoken');
const {secret_key}=require('../env-config');

let verifyToken=(req, res, next)=>{

    let authCookie=req.cookies.authorizationToken;

    if(authCookie){

        const isTokenValid=()=>{

            return tokens=jwt.verify(authCookie, secret_key, (err, decoded)=>{

                if(err){

                    return err.message;

                }else{
                    return decoded;
                }
            })
        }

        const tokenStatus=isTokenValid();

        if(tokenStatus=='jwt expired'){

            statusCode=401;
                            
            next();
        }else{

            statusCode=200;

            tokenInfo=tokenStatus;

            next();
        }
    }else{

        statusCode=403;

        next();
    }
}
module.exports=verifyToken;