const jwt=require('jsonwebtoken');
const {secret_key}=require('../env-config');

let verifyToken=(req, res, next)=>{

    let authCookie=req.cookies.authorizationToken;

    if(authCookie){

        const isTokenValid=()=>{

            return tokens=jwt.verify(authCookie, secret_key, (err, decoded)=>{

                if(err){

                    return response={
                        code:401,
                        message:err.message
                    }

                }else{
                    return response={
                        code:200,
                        message:decoded
                    }
                }
            })
        }
        const tokenStatus=isTokenValid();

        if(tokenStatus.code==200){

            statusCode=tokenStatus.code;

            tokenInfo=tokenStatus.message
                            
            next();
        }else{

            statusCode=tokenStatus.code;

            next();
        }
    }else{

        statusCode=403;

        next();
    }
}
module.exports=verifyToken;