const crypto=require('crypto');

let generateId=(maxNumber)=>{
    return id=`${crypto.randomInt(1, maxNumber).toString()}`
}

module.exports=generateId;