const bcrypt=require('bcrypt');

const hashPasssword=async(plain_password)=>{

    return await bcrypt.hash(plain_password, 10) ;
}

module.exports=hashPasssword;