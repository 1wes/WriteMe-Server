import express, {Request, Response} from 'express';
import dbConnection from'../db';
import { hashPasssword, comparePassword } from '../utils/password';
import generateId from '../utils/generateId';
import generateToken from '../utils/token';
import verifyToken from '../middleware/cookie-validation';
import bcrypt from 'bcrypt';


const router=express.Router();

router.use((req, res, next)=>{
    next();
});


router.post("/register", async(req:Request, res:Response)=>{
    
    const {firstName, lastName, email, dialCode, phoneNumber, confirmPassword}=req.body;

    const checkEmailStatement:string=`SELECT COUNT(email) AS count FROM users WHERE email=?`;

    dbConnection.query(checkEmailStatement, email, async (err, result:any)=>{

        if(err){
            console.log(err);
        }

        if(result[0].count>0){            
            res.sendStatus(403);
        }else{

            let userId=generateId(100000);

            const phone=dialCode+phoneNumber;

            const salt = await bcrypt.genSalt(10 as number);
        
            const hashedPassword=await hashPasssword(confirmPassword, salt);

            const role='user';
        
            let userInfo=[
                userId, firstName, lastName, email, phone, hashedPassword, salt, role
            ]
        
            let sqlStatement=`INSERT INTO users (uuid, first_name, last_name, email, phone_no, password, role) VALUES (?)`;
        
            dbConnection.query(sqlStatement, [userInfo], (err, result:any)=>{
        
                if(err){
                    console.log(err)
                }

                res.sendStatus(200);
            }) 
        }
    })
});

router.post("/login", (req:Request, res:Response)=>{

    const {email, password}=req.body;

    const selectStatement=`SELECT first_name, last_name, password, uuid, role FROM users WHERE email=?`;

    dbConnection.query(selectStatement, email, async(err, result:any)=>{

        if(err){
            console.log(err);
        }

        if(result.length===0){

            return res.sendStatus(404)
        }

        let passwordMatch=await comparePassword(password, result[0].password)

        if(passwordMatch){

            let token=generateToken(email, result[0].uuid, result[0].role, result[0].first_name, result[0].last_name);

            res.cookie("authorizationToken", token, {
                httpOnly:true,
                secure:true,
                sameSite:'lax'
            });

            res.json({
                code:200, 
                role: result[0].role,
                firstName: result[0].first_name,
                lastName:result[0].last_name
            })

        }else{

            return res.sendStatus(403);
        }
    })
});

router.get("/user-details", verifyToken, (req: Request, res: Response) => {
    
    const { statusCode, tokenInfo } = req;

    switch(statusCode){

        case 200:
            let getUserName=`SELECT first_name, last_name FROM  users WHERE email=?`;

            dbConnection.query(getUserName, tokenInfo.email, (err, result:any)=>{

                if(err){
                    console.log(err);
                }

                const userName=`${result[0].first_name} ${result[0].last_name}`;

                res.send(userName);            
            });

            break;

        case 401:
            res.sendStatus(401);

            break;

        case 403:
            res.sendStatus(403);

            break;
    }
});



router.get("/check-token", verifyToken, (req: Request, res: Response) => {
    
    const { statusCode, tokenInfo } = req;

    switch(statusCode){

        case 200:
            res.json({
                code: 200,
                role: tokenInfo.role,
                firstName: tokenInfo.firstName,
                lastName:tokenInfo.lastName
            });

            break;

        case 401:
            res.sendStatus(401);

            break;
        
        case 403:
            res.sendStatus(403);

            break;
    }
})

router.post("/forgot-password", (req, res)=>{


})

export default router;