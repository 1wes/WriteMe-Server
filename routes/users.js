const express=require('express');
const router=express.Router();
const dbConnection=require('../db');
const {hashPasssword, comparePassword}=require('../utils/password');
const generateUserId=require('../utils/userId');
const generateToken=require('../utils/token');

router.use((req, res, next)=>{
    next();
});

router.post("/register", async(req, res)=>{
    
    const {firstName, lastName, email, dialCode, phoneNumber, confirmPassword}=req.body;

    let userId=generateUserId();

    const phone=dialCode+phoneNumber;

    const hashedPassword=await hashPasssword(confirmPassword);

    let userInfo=[
        userId, firstName, lastName, email, phone, hashedPassword
    ]

    let sqlStatement=`INSERT INTO users (uuid, first_name, last_name, email, phone_no, password) VALUES (?)`;

    dbConnection.query(sqlStatement, [userInfo], (err, result)=>{

        if(err){
            console.log(err)
        }

        console.log(result);
    })

});

router.post("/login", (req, res)=>{

    const {email, password}=req.body;

    const selectStatement=`SELECT password FROM users WHERE email=?`;

    dbConnection.query(selectStatement, email, async(err, result)=>{

        if(err){
            console.log(err);
        }

        if(result.length==0){

            return res.sendStatus(404)
        }

        let passwordMatch=await comparePassword(password, result[0].password)

        if(passwordMatch){

            let token=generateToken(email);

            res.cookie("authorizationToken", token, {
                httpOnly:true,
                secure:true,
                sameSite:'lax'
            });

            res.sendStatus(200);

        }else{

            return res.sendStatus(403);
        }
    })
});

module.exports=router;