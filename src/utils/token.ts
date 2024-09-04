import jwt from 'jsonwebtoken';
import envConfig from '../env-config';

const { secret_key } = envConfig;

const generateToken=(email:string, uuid:string, role:string, firstName:string, lastName:string):string=>{

    return jwt.sign({firstName:firstName, lastName:lastName,email:email, uuid:uuid, role:role}, secret_key, {expiresIn:"1h"})
}

export default generateToken;
