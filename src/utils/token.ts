const jwt=require('jsonwebtoken');
const {secret_key}=require('../env-config');

const generateToken=(email, uuid, role, firstName, lastName)=>{

    return jwt.sign({firstName:firstName, lastName:lastName,email:email, uuid:uuid, role:role}, secret_key, {expiresIn:"1h"})
}

module.exports=generateToken;
