import bcrypt from 'bcrypt'

export const hashPasssword=async(plain_password:string)=>{

    return await bcrypt.hash(plain_password, 10) ;
}

export const comparePassword=async (plain_password:string, hashed_password:string)=>{

    return await bcrypt.compare(plain_password, hashed_password);
}

