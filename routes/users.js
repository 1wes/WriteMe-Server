const express=require('express');
const router=express.Router();
const dbConnection=require('../db');
const {hashPasssword, comparePassword}=require('../utils/password');
const generateUserId=require('../utils/userId');
const generateToken=require('../utils/token');
const verifyToken=require('../middleware/cookie-validation.js');

router.use((req, res, next)=>{
    next();
});

router.post("/register", async(req, res)=>{
    
    const {firstName, lastName, email, dialCode, phoneNumber, confirmPassword}=req.body;

    const checkEmailStatement=`SELECT COUNT(email) AS count FROM users WHERE email=?`;

    dbConnection.query(checkEmailStatement, email, async (err, result)=>{

        if(err){
            console.log(err);
        }

        if(result[0].count>0){            
            res.sendStatus(403);
        }else{

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

                res.sendStatus(200);
            })

            
        }

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

router.get("/user-details", verifyToken, (req, res)=>{

    switch(statusCode){

        case 200:
            let getUserName=`SELECT first_name, last_name FROM  users WHERE email=?`;

            dbConnection.query(getUserName, tokenInfo.email, (err, result)=>{

                if(err){
                    console.log(err);
                }

                const userName=`${result[0].first_name} ${result[0].last_name}`;

                res.send(userName);            
            })
    }
});

router.get("/logout", verifyToken, (req, res)=>{

    if(statusCode){

        res.clearCookie("authorizationToken", {domain:"localhost", path:"/"});

        res.sendStatus(200);
    }
});

router.get("/check-token", verifyToken, (req, res)=>{

    switch(statusCode){

        case 200:
            res.sendStatus(200);

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

module.exports=router;