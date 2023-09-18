const jwt=require('jsonwebtoken');
const {secret_key}=require('../env-config');

const generateToken=(email, uuid, role)=>{

    return jwt.sign({email:email, uuid:uuid, role:role}, secret_key, {expiresIn:"1h"})
}

module.exports=generateToken;
