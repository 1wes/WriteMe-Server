const jwt=require('jsonwebtoken');
const {secret_key}=require('../env-config');

let verifyToken=(req, res, next)=>{

    let authCookie=req.cookies.authorizationToken;

    if(authCookie){

        const isTokenValid=()=>{

            return tokens=jwt.verify(authCookie, secret_key, (err, decoded)=>{

                if(err){

                    errorObject={
                        statusCode:401, 
                        message:err.message
                    }

                    res.clearCookie("authorizationToken", {domain:'localhost', path:'/'});

                    return new Error(errorObject);
                }

                return decoded;
            })
        }

        const tokenIsValid=isTokenValid();

        if(tokenIsValid){

            statusCode=200;

            tokenInfo=tokenIsValid;
                
            next();
        }else{

            statusCode=401;

            next();
        }
    }else{

        statusCode=403;

        next();
    }
}
module.exports=verifyToken;