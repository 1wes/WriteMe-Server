const express=require('express');
const router=express.Router();
const dbConnection=require('../db');
const hashPasssword=require('../utils/password');
const generateUserId=require('../utils/userId');

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

    dbConnection.end();

});

router.post("/login", (req, res)=>{

});

module.exports=router;