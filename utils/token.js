const jwt=require('jsonwebtoken');
const {secret_key}=require('../env-config');

const generateToken=(email, uuid)=>{

    return jwt.sign({email:email, uuid:uuid}, secret_key, {expiresIn:"1h"})
}

module.exports=generateToken;
