import bcrypt from 'bcrypt'

export const hashPassword = async (plain_password: string, salt: string): Promise<string> => {
    
    return await bcrypt.hash(plain_password, salt);
}

export const comparePassword=async (plain_password:string, hashed_password:string):Promise<boolean>=>{

    return await bcrypt.compare(plain_password, hashed_password);
}

