const jwt=require('jsonwebtoken');
const {secret_key}=require('../env-config');

const generateToken=(email)=>{

    return jwt.sign({email:email}, secret_key, {expiresIn:"1h"})
}

module.exports=generateToken;
