import crypto from 'crypto';

let generateId=(maxNumber:number):string=>{
    return crypto.randomInt(1, maxNumber).toString();
}

export default generateId;