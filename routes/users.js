const express=require('express');
const router=express.Router();

router.use((req, res, next)=>{
    next();
});

router.get("/register", (req, res)=>{
    res.send("am the register page")
});

router.get("/login", (req, res)=>{

    res.send("Am the login page");
});

module.exports=router;