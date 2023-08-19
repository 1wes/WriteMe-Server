const bcrypt=require('bcrypt');

const hashPasssword=async(plain_password)=>{

    return await bcrypt.hash(plain_password, 10) ;
}

const comparePassword=async (plain_password, hashed_password)=>{

    return await bcrypt.compare(plain_password, hashed_password);
}

module.exports={
    hashPasssword, 
    comparePassword
}