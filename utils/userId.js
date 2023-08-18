const crypto=require('crypto');

let generateUserId=()=>{
    return id=`${crypto.randomInt(1, 100000).toString()}`
}

module.exports=generateUserId;